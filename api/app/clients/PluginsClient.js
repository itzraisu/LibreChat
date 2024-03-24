const OpenAIClient = require('./OpenAIClient');
const { CallbackManager } = require('langchain/callbacks');
const { BufferMemory, ChatMessageHistory } = require('langchain/memory');
const { initializeCustomAgent, initializeFunctionsAgent } = require('./agents');
const { addImages, buildErrorInput, buildPromptPrefix } = require('./output_parsers');
const { processFileURL } = require('~/server/services/Files/process');
const { EModelEndpoint } = require('librechat-data-provider');
const { formatLangChainMessages } = require('./prompts');
const checkBalance = require('~/models/checkBalance');
const { SelfReflectionTool } = require('./tools');
const { isEnabled } = require('~/server/utils');
const { extractBaseURL } = require('~/utils');
const { loadTools } = require('./tools/util');
const { logger } = require('~/config');

class PluginsClient extends OpenAIClient {
  constructor(apiKey, options = {}) {
    super(apiKey, options);
    this.sender = options.sender ?? 'Assistant';
    this.tools = [];
    this.actions = [];
    this.setOptions(options);
    this.openAIApiKey = this.apiKey;
    this.executor = null;
  }

  setOptions(options) {
    this.agentOptions = { ...options.agentOptions };
    this.functionsAgent = this.agentOptions?.agent === 'functions';
    this.agentIsGpt3 = this.agentOptions?.model?.includes('gpt-3');

    super.setOptions(options);

    this.isGpt3 = this.modelOptions?.model?.includes('gpt-3');

    if (this.options.reverseProxyUrl) {
      this.langchainProxy = extractBaseURL(this.options.reverseProxyUrl);
    }
  }

  getSaveOptions() {
    return {
      chatGptLabel: this.options.chatGptLabel,
      promptPrefix: this.options.promptPrefix,
      ...this.modelOptions,
      agentOptions: this.agentOptions,
    };
  }

  saveLatestAction(action) {
    this.actions.push(action);
  }

  getFunctionModelName(input) {
    if (/-(?!0314)\d{4}/.test(input)) {
      return input;
    } else if (input.includes('gpt-3.5-turbo')) {
      return 'gpt-3.5-turbo';
    } else if (input.includes('gpt-4')) {
      return 'gpt-4';
    } else {
      return 'gpt-3.5-turbo';
    }
  }

  async initialize({ user, message, onAgentAction, onChainEnd, signal }) {
    try {
      const modelOptions = {
        modelName: this.agentOptions.model,
        temperature: this.agentOptions.temperature,
      };

      const model = this.initializeLLM({
        ...modelOptions,
        context: 'plugins',
        initialMessageCount: this.currentMessages.length + 1,
      });

      logger.debug(
        `[PluginsClient] Agent Model: ${model.modelName} | Temp: ${model.temperature} | Functions: ${this.functionsAgent}`,
      );

      const pastMessages = formatLangChainMessages(this.currentMessages.slice(0, -1), {
        userName: this.options?.name,
      });
      logger.debug('[PluginsClient] pastMessages: ' + pastMessages.length);

      const memory = new BufferMemory({
        llm: model,
        chatHistory: new ChatMessageHistory(pastMessages),
      });

      this.tools = await loadTools({
        user,
        model,
        tools: this.options.tools,
        functions: this.functionsAgent,
        options: {
          memory,
          signal: this.abortController.signal,
          openAIApiKey: this.openAIApiKey,
          conversationId: this.conversationId,
          fileStrategy: this.options.req.app.locals.fileStrategy,
          processFileURL,
          message,
        },
      });

      if (this.tools.length > 0 && !this.functionsAgent) {
        this.tools.push(new SelfReflectionTool({ message, isGpt3: false }));
      }

      logger.debug('[PluginsClient] Requested Tools', this.options.tools);
      logger.debug(
        '[PluginsClient] Loaded Tools',
        this.tools.map((tool) => tool.name),
      );

      const handleAction = (action, runId, callback = null) => {
        this.saveLatestAction(action);

        logger.debug('[PluginsClient] Latest Agent Action ', this.actions[this.actions.length - 1]);

        if (typeof callback === 'function') {
          callback(action, runId);
        }
      };

      const initializer = this.functionsAgent ? initializeFunctionsAgent : initializeCustomAgent;
      this.executor = await initializer({
        model,
        signal,
        pastMessages,
        tools: this.tools,
        currentDateString: this.currentDateString,
        verbose: this.options.debug,
        returnIntermediateSteps: true,
        callbackManager: CallbackManager.fromHandlers({
          async handleAgentAction(action, runId) {
            handleAction(action, runId, onAgentAction);
          },
          async handleChainEnd(action) {
            if (typeof onChainEnd === 'function') {
              onChainEnd(action);
            }
          },
        }),
      });

      logger.debug('[PluginsClient] Loaded agent.');
    } catch (error) {
      logger.error
