const {
  EModelEndpoint,
  resolveHeaders,
  mapModelToAzureConfig,
} = require('librechat-data-provider');
const { getUserKey, checkUserKeyExpiry } = require('~/server/services/UserService');
const { isEnabled, isUserProvided } = require('~/server/utils');
const { getAzureCredentials } = require('~/utils');
const { OpenAIClient } = require('~/app');

const initializeClient = async ({ req, res, endpointOption }) => {
  const {
    PROXY,
    OPENAI_API_KEY: openaiApiKeyEnv,
    AZURE_API_KEY: azureApiKeyEnv,
    OPENAI_REVERSE_PROXY: openaiReverseProxyEnv,
    AZURE_OPENAI_BASEURL: azureOpenAIBaseURLEnv,
    OPENAI_SUMMARIZE: openaiSummarizeEnv,
    DEBUG_OPENAI: debugOpenAIEnv,
  } = process.env;

  const { key: expiresAt, endpoint, model: modelName } = req.body;

  // Validate modelName and endpoint
  if (!Object.values(EModelEndpoint).includes(endpoint)) {
    throw new Error(`Invalid endpoint provided: ${endpoint}`);
  }
  if (!modelName) {
    throw new Error(`Invalid model name provided: ${modelName}`);
  }

  const contextStrategy = isEnabled(openaiSummarizeEnv) ? 'summarize' : null;

  const credentials = {
    [EModelEndpoint.openAI]: openaiApiKeyEnv,
    [EModelEndpoint.azureOpenAI]: azureApiKeyEnv,
  };

  const baseURLOptions = {
    [EModelEndpoint.openAI]: openaiReverseProxyEnv,
    [EModelEndpoint.azureOpenAI]: azureOpenAIBaseURLEnv,
  };

  const userProvidesKey = isUserProvided(credentials[endpoint]);
  const userProvidesURL = isUserProvided(baseURLOptions[endpoint]);

  let userValues = null;
  if (expiresAt && (userProvidesKey || userProvidesURL)) {
    checkUserKeyExpiry(
      expiresAt,
      'Your OpenAI API values have expired. Please provide them again.',
    );
    userValues = await getUserKey({ userId: req.user.id, name: endpoint });
    try {
      userValues = JSON.parse(userValues);
    } catch (e) {
      throw new Error(
        `Invalid JSON provided for ${endpoint} user values. Please provide them again.`,
      );
    }
  }

  let apiKey = userProvidesKey ? userValues?.apiKey : credentials[endpoint];
  let baseURL = userProvidesURL ? userValues?.baseURL : baseURLOptions[endpoint];

  const clientOptions = {
    debug: isEnabled(debugOpenAIEnv),
    contextStrategy,
    reverseProxyUrl: baseURL ? baseURL : null,
    proxy: PROXY ?? null,
    req,
    res,
    ...endpointOption,
  };

  const isAzureOpenAI = endpoint === EModelEndpoint.azureOpenAI;
  /** @type {false | TAzureConfig} */
  const azureConfig = isAzureOpenAI && req.app.locals[EModelEndpoint.azureOpenAI];

  if (isAzureOpenAI && azureConfig) {
    const { modelGroupMap, groupMap } = azureConfig;
    const {
      azureOptions,
      baseURL: azureBaseURL,
      headers = {},
      serverless,
    } = mapModelToAzureConfig({
      modelName,
      modelGroupMap,
      groupMap,
    });

    clientOptions.reverseProxyUrl = azureBaseURL ?? clientOptions.reverseProxyUrl;
    clientOptions.headers = resolveHeaders({ ...headers, ...(clientOptions.headers ?? {}) });

    clientOptions.titleConvo = azureConfig.titleConvo;
    clientOptions.titleModel = azureConfig.titleModel;
    clientOptions.titleMethod = azureConfig.titleMethod ?? 'completion';

    const groupName = modelGroupMap[modelName].group;
    clientOptions.addParams = azureConfig.groupMap[groupName].addParams;
    clientOptions.dropParams = azureConfig.groupMap[groupName].dropParams;
    clientOptions.forcePrompt = azureConfig.groupMap[groupName].forcePrompt;

    apiKey = azureOptions.azureOpenAIApiKey;
    clientOptions.azure = !serverless && azureOptions;
  } else if (isAzureOpenAI) {
    clientOptions.azure = userProvidesKey ? JSON.parse(userValues.apiKey) : getAzureCredentials();
    apiKey = clientOptions.azure.azureOpenAIApiKey;
  }

  if (!apiKey) {
    throw new Error(`${endpoint} API key not provided. Please provide it again.`);
  }

  const client = new OpenAIClient(apiKey, clientOptions);
  return {
    client,
    openAIApiKey: apiKey,
  };
};

module.exports = initializeClient;
