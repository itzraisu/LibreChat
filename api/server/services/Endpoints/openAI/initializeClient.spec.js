const { EModelEndpoint, validateAzureGroups } = require('librechat-data-provider');
const { getUserKey, checkUserKeyExpiry } = require('~/server/services/UserService');
const initializeClient = require('./initializeClient');
const { OpenAIClient } = require('~/app');

// Mock getUserKey since it's the only function we want to mock
jest.mock('~/server/services/UserService', () => ({
  getUserKey: jest.fn(),
  checkUserKeyExpiry: jest.requireActual('~/server/services/UserService').checkUserKeyExpiry,
}));

describe('initializeClient', () => {
  // Set up environment variables
  const originalEnvironment = { ...process.env };
  const app = {
    locals: {},
  };

  const validAzureConfigs = [
    // ... (same as before)
  ];

  const { modelNames, modelGroupMap, groupMap } = validateAzureGroups(validAzureConfigs);

  beforeEach(() => {
    jest.resetModules(); // Clears the cache
    process.env = { ...originalEnvironment }; // Make a copy
  });

  afterAll(() => {
    process.env = originalEnvironment; // Restore original env vars
  });

  // ... (same tests as before)

  it('should initialize client correctly for Azure OpenAI with valid configuration', async () => {
    // ... (same test as before)
  });

  it('should initialize client with default options when certain env vars are not set', async () => {
    // ... (same test as before)
  });

  it('should correctly use user-provided apiKey and baseURL when provided', async () => {
    // ... (same test as before)
  });
});

