const Keyv = require('keyv');
const { CacheKeys, ViolationTypes } = require('librechat-data-provider');
const { logFile, violationFile } = require('./keyvFiles');
const { math, isEnabled } = require('~/server/utils');
const keyvRedis = require('./keyvRedis');
const keyvMongo = require('./keyvMongo');

const { BAN_DURATION = '7200000', USE_REDIS = 'false' } = process.env;

const duration = math(BAN_DURATION, 7200000);

const createViolationInstance = (namespace) => {
  const config = isEnabled(USE_REDIS) ? { store: keyvRedis } : { store: violationFile, namespace };
  return new Keyv(config);
};

const pending_req = isEnabled(USE_REDIS)
  ? new Keyv({ store: keyvRedis })
  : new Keyv({ namespace: 'pending_req' });

const configStore = isEnabled(USE_REDIS)
  ? new Keyv({ store: keyvRedis, ttl: 1800000 })
  : new Keyv({ namespace: CacheKeys.CONFIG_STORE, ttl: 1800000 });

const tokenConfig = isEnabled(USE_REDIS)
  ? new Keyv({ store: keyvRedis, ttl: 1800000 })
  : new Keyv({ namespace: CacheKeys.TOKEN_CONFIG, ttl: 1800000 });

const genTitle = isEnabled(USE_REDIS)
  ? new Keyv({ store: keyvRedis, ttl: 120000 })
  : new Keyv({ namespace: CacheKeys.GEN_TITLE, ttl: 120000 });

const modelQueries = isEnabled(USE_REDIS)
  ? new Keyv({ store: keyvRedis, ttl: 1800000 })
  : new Keyv({ namespace: CacheKeys.MODEL_QUERIES, ttl: 1800000 });

const abortKeys = isEnabled(USE_REDIS)
  ? new Keyv({ store: keyvRedis, ttl: 600000 })
  : new Keyv({ namespace: CacheKeys.ABORT_KEYS, ttl: 600000 });

const namespaces = {
  [CacheKeys.CONFIG_STORE]: configStore,
  pending_req,
  ban: new Keyv({ store: keyvMongo, namespace: 'bans', ttl: duration }),
  general: new Keyv({ store: logFile, namespace: 'violations' }),
  concurrent: createViolationInstance('concurrent'),
  non_browser: createViolationInstance('non_browser'),
  message_limit: createViolationInstance('message_limit'),
  token_balance: createViolationInstance(ViolationTypes.TOKEN_BALANCE),
  registrations: createViolationInstance('registrations'),
  [ViolationTypes.FILE_UPLOAD_LIMIT]: createViolationInstance(ViolationTypes.FILE_UPLOAD_LIMIT),
  [ViolationTypes.ILLEGAL_MODEL_REQUEST]: createViolationInstance(
    ViolationTypes.ILLEGAL_MODEL_REQUEST,
  ),
  logins: createViolationInstance('logins'),
  [CacheKeys.ABORT_KEYS]: abortKeys,
  [CacheKeys.TOKEN_CONFIG]: tokenConfig,
  [CacheKeys.GEN_TITLE]: genTitle,
  [CacheKeys.MODEL_QUERIES]: modelQueries,
};

/**
 * Returns the keyv cache specified by type.
 * If an invalid type is passed, an error will be thrown.
 *
 * @param {string} key - The key for the namespace to access
 * @returns {Keyv} - If a valid key is passed, returns an object containing the cache store of the specified key.
 * @throws Will throw an error if an invalid key is passed.
 */
const getLogStores = (key) => {
  if (typeof key !== 'string') {
    throw new Error(`Invalid
