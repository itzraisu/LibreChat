// gptPlugins/initializeClient.spec.js
const { PluginsClient } = require('~/app');
const { validateAzureGroups, EModelEndpoint } = require('librechat-data-provider');
const { getUserKey } = require('~/server/services/UserService');
const initializeClient = require('./initializeClient');

const mockGetUserKey = (apiKey, baseURL) =>
  Promise.resolve(JSON.stringify({ apiKey, baseURL }));

jest.mock('~/server/services/UserService', () => ({
  getUserKey: jest.fn(),
  checkUserKeyExpiry: jest.requireActual('~/server/services/UserService').checkUserKeyExpiry,
}));

describe('gptPlugins/initializeClient', () => {
  const originalEnvironment = process.env;
  const app = {
    locals: {},
  };

  const validAzureConfigs = [
    // ... (same as the original code)
  ];

  const { modelNames, modelGroupMap, groupMap } = validateAzureGroups(validAzureConfigs);

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnvironment };
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  // ... (same test cases as the original code)

  test('should correctly use user-provided apiKey and baseURL when provided', async () => {
    process.env.OPENAI_API_KEY = 'user_provided';
    process.env.OPENAI_REVERSE_PROXY = 'user_provided';
    const req = {
      body: {
        key: new Date(Date.now() + 10000).toISOString(),
        endpoint: EModelEndpoint.openAI,
      },
      user: {
        id: '123',
      },
      app,
    };
    const res = {};
    const endpointOption = {};

    getUserKey.mockImplementation(mockGetUserKey);

    const result = await initializeClient({ req, res, endpointOption });

    expect(getUserKey).toHaveBeenCalledWith('123', EModelEndpoint.openAI);
    expect(result.openAIApiKey).toBe('test');
    expect(result.client.options.reverseProxyUrl).toBe('https://user-provided-url.com');
  });

  // ... (other test cases)
});

// Add this helper function and mock to simplify the tests
const mockGetUserKey = (apiKey, baseURL) =>
  Promise.resolve(JSON.stringify({ apiKey, baseURL }));
