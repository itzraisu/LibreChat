import Anthropic from '@anthropic-ai/sdk';
import { encodeAndFormat } from '~/server/services/Files/images/encode';
import {
  titleFunctionPrompt,
  parseTitleFromPrompt,
  truncateText,
  formatMessage,
  createContextHandlers,
} from './prompts';
import { spendTokens, getModelMaxTokens } from '~/models/spendTokens';
import { AbortController } from 'abort-controller-x';

const HUMAN_PROMPT = '\n\nHuman:';
const AI_PROMPT = '\n\nAssistant:';

class AnthropicClient {
  anthropic!: Anthropic.default;
  apiKey!: string;
  userLabel = HUMAN_PROMPT;
  assistantLabel = AI_PROMPT;
  contextStrategy!: string;
  modelOptions!: Anthropic.default.ModelOptions;
  isClaude3 = false;
  useMessages = false;
  defaultVisionModel = '';
  maxContextTokens = 100000;
  maxResponseTokens = 1500;
  maxPromptTokens = 0;
  sender!: string;
  startToken = '||>';
  endToken = '';
  gptEncoder!: Anthropic.default.Tokenizer;

  constructor(apiKey: string, options?: { contextStrategy?: string; visionModel?: string; modelsConfig?: any }) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY;
    this.contextStrategy = options?.contextStrategy ?? 'discard';
    this.defaultVisionModel = options?.visionModel ?? 'claude-3-sonnet-20240229';

    this.setOptions(options);
  }

  setOptions(options: { modelOptions?: Anthropic.default.ModelOptions }) {
    this.options = options;

    this.modelOptions = {
      model: options.modelOptions?.model || 'claude-1',
      temperature: options.modelOptions?.temperature || 1,
      topP: options.modelOptions?.topP || 0.7,
      topK: options.modelOptions?.topK || 40,
      stop: options.modelOptions?.stop,
    };

    this.isClaude3 = this.modelOptions.model.includes('claude-3');
    this.useMessages = this.isClaude3 || !!options.attachments;

    this.maxPromptTokens = this.maxContextTokens - this.maxResponseTokens;

    if (this.maxPromptTokens + this.maxResponseTokens > this.maxContextTokens) {
      throw new Error('Max prompt and response tokens must be less than or equal to max context tokens');
    }

    this.sender = options.sender ?? getResponseSender({
      model: this.modelOptions.model,
      endpoint: EModelEndpoint.anthropic,
      modelLabel: options.modelLabel,
    });

    this.gptEncoder = Anthropic.getTokenizer('cl100k_base');

    if (!this.modelOptions.stop) {
      this.modelOptions.stop = [this.startToken, `${this.userLabel}`, '<|diff_marker|>'];
    }

    this.anthropic = new Anthropic({ apiKey: this.apiKey });

    if (this.options.reverseProxyUrl) {
      this.anthropic.setBaseURL(this.options.reverseProxyUrl);
    }
  }

  async buildMessages(messages: any[], parentMessageId: string) {
    const orderedMessages = this.getMessagesForConversation({
      messages,
      parentMessageId,
    });

    if (this.options.attachments) {
      const attachments = await this.options.attachments;
      const images = attachments.filter((file: any) => file?.type && file?.type?.includes('image'));

      if (images.length && !this.isVisionModel) {
        throw new Error('Images are only supported with the Claude 3 family of models');
      }

      const latestMessage = orderedMessages[orderedMessages.length - 1];

      if (this.message_file_map) {
        this.message_file_map[latestMessage.messageId] = attachments;
      } else {
        this.message_file_map = {
          [latestMessage.messageId]: attachments,
        };
      }

      const files = await this.addImageURLs(latestMessage, attachments);

      this.options.attachments = files;
    }

    if (this.message_file_map) {
      this.contextHandlers = createContextHandlers(
        this.options.req,
        orderedMessages[orderedMessages.length - 1].text,
      );
    }

    const formattedMessages = orderedMessages.map((message) => {
      const formattedMessage = this.useMessages
        ? formatMessage({
          message,
          endpoint: EModelEndpoint.anthropic,
        })
        : {
          author: message.isCreatedByUser ? this.userLabel : this.assistantLabel,
          content: message?.content ?? message.text,
        };

      const needsTokenCount = this.contextStrategy && !orderedMessages[orderedMessages.length - 1].tokenCount;
      if (needsTokenCount) {
        orderedMessages[orderedMessages.length - 1].tokenCount = this.getTokenCountForMessage(formattedMessage);
      }

      return formattedMessage;
    });

    if (this.contextHandlers) {
      this.augmentedPrompt = await this.contextHandlers.createContext();
    }

    return formattedMessages;
  }

  async
