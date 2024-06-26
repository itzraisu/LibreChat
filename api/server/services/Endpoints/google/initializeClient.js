const { GoogleClient } = require('~/app');
const { getUserKey, checkUserKeyExpiry } = require('~/server/services/UserService');

const initializeClient = async ({ req, res, endpointOption }) => {
  const { GOOGLE_KEY, GOOGLE_REVERSE_PROXY, PROXY, NO_PROXY } = process.env;
  const isUserProvided = GOOGLE_KEY === 'user_provided';
  const { key: expiresAt } = req.body;

  let userKey = null;
  if (expiresAt && isUserProvided) {
    try {
      checkUserKeyExpiry(
        new Date(expiresAt),
        'Your Google Credentials have expired. Please provide your Service Account JSON Key or Generative Language API Key again.',
      );
      userKey = await getUserKey({ userId: req.user.id, name: 'google' });
    } catch (error) {
      return {
        error: {
          message: error.message,
          status: error.status,
        },
      };
    }
  }

  let serviceKey = {};
  try {
    serviceKey = require('~/data/auth.json');
  } catch (e) {
    // Do nothing
  }

  const credentials = isUserProvided
    ? userKey
    : {
      [AuthKeys.GOOGLE_SERVICE_KEY]: serviceKey,
      [AuthKeys.GOOGLE_API_KEY]: GOOGLE_KEY,
    };

  const client = new GoogleClient(credentials, {
    req,
    res,
    reverseProxyUrl:
