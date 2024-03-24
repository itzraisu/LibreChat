const { EModelEndpoint, extractEnvVariable } = require('librechat-data-provider');
const { fetchModels } = require('~/server/services/ModelService');
const { isUserProvided } = require('~/server/utils');
const getCustomConfig = require('./getCustomConfig');

/**
 * Load config endpoints from the cached configuration object
 * @function loadConfigModels
 * @param {Express.Request} req - The Express request object.
 */
async function loadConfigModels(req) {
  let customConfig;
  try {
    customConfig = await getCustomConfig();
  } catch (error) {
    console.error('Error fetching custom config:', error);
    return {};
  }

  if (!customConfig) {
    return {};
  }

  const { endpoints = {} } = customConfig ?? {};
  const modelsConfig = {};

  const azureEndpoint = endpoints[EModelEndpoint.azureOpenAI];
  const azureConfig = req.app.locals[EModelEndpoint.azureOpenAI] || {};

  if (azureEndpoint && azureConfig.modelNames) {
    modelsConfig[EModelEndpoint.azureOpenAI] = azureConfig.modelNames;
    modelsConfig[EModelEndpoint.gptPlugins] = azureConfig.modelNames;
  }

  if (
    azureEndpoint?.assistants &&
    azureConfig.assistantModels &&
    Array.isArray(azureConfig.assistantModels)
  ) {
    modelsConfig[EModelEndpoint.assistants] = azureConfig.assistantModels;
  }

  if (!Array.isArray(endpoints[EModelEndpoint.custom])) {
    return modelsConfig;
  }

  const customEndpoints = endpoints[EModelEndpoint.custom].filter(
    (endpoint) =>
      endpoint.baseURL &&
      endpoint.apiKey &&
      endpoint.name &&
      endpoint.models &&
      (endpoint.models.fetch || endpoint.models.default),
  );

  const fetchPromisesMap = {};
  const uniqueKeyToNameMap = {};

  for (const endpoint of customEndpoints) {
    const { models, name, baseURL, apiKey } = endpoint;

    const API_KEY = extractEnvVariable(apiKey);
    const BASE_URL = extractEnvVariable(baseURL);

    const uniqueKey = `${BASE_URL}__${API_KEY}`;

    modelsConfig[name] = [];

    if (models.fetch && !isUserProvided(API_KEY) && !isUserProvided(BASE_URL)) {
      fetchPromisesMap[uniqueKey] =
        fetchPromisesMap[uniqueKey] ||
        fetchModels({
          user: req.user.id,
          baseURL: BASE_URL,
          apiKey: API_KEY,
          name,
          userIdQuery: models.userIdQuery,
        });
      uniqueKeyToNameMap[uniqueKey] = uniqueKeyToNameMap[uniqueKey] || [];
      uniqueKeyToNameMap[uniqueKey].push(name);
      continue;
    }

    if (Array.isArray(models.default)) {
      modelsConfig[name] = models.default;
    }
  }

  const fetchedDataPromises = Object.values(fetchPromisesMap);

  const fetchedData = await Promise.allSettled(fetchedDataPromises);

  for (const [index, result] of Object.entries(fetchedData)) {
    if (result.status === 'fulfilled') {
      const modelData = result.value;
      const currentKey = Object.entries(fetchPromisesMap)[index][0];
      const associatedNames = uniqueKeyToNameMap[currentKey];

      for (const name of associatedNames) {
        modelsConfig[name] = modelData;
      }
    }
  }

  return modelsConfig;
}

module.exports = loadConfigModels;
