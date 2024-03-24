const { AnthropicClient } = require('~/app');
const { getUserKey, checkUserKeyExpiry } = require('~/server/services/UserService');

const initializeClient = async ({ req, res, endpointOption }) => {
  const { ANTHROPIC_API_KEY, ANTHROPIC_REVERSE_PROXY, PROXY } = process.env;

  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  if (ANTHROPIC_REVERSE_PROXY && !ANTHROPIC_REVERSE_PROXY.startsWith('http')) {
    throw new Error('ANTHROPIC_REVERSE_PROXY environment variable is not a valid URL');
  }

  if (PROXY && !PROXY.startsWith('http')) {
    throw new Error('PROXY environment variable is not a valid URL');
  }

  const expiresAt = req.body.key ? new Date(req.body.key.expiresAt) : null;
  const isUserProvided = ANTHROPIC_API_KEY === 'user_provided';

  let anthropicApiKey;
  if (isUserProvided) {
    if (!expiresAt) {
      throw new Error('User-provided API key is missing an expiration time');
    }

    anthropicApiKey = await getAnthropicUserKey(req.user.id);

    if (expiresAt < new Date()) {
      throw new Error('Your ANTHROPIC_API_KEY has expired. Please provide your API key again.');
    }
  } else {
