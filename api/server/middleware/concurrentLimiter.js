const clearPendingReq = require('../../cache/clearPendingReq');
const { logViolation, getLogStores } = require('../../cache');
const denyRequest = require('./denyRequest');

const {
  USE_REDIS = false,
  CONCURRENT_MESSAGE_MAX = 1,
  CONCURRENT_VIOLATION_SCORE: score,
} = process.env || {};
const REQUEST_TTL = 1000 * 60 * 1; // 1 minute

/**
 * Middleware to limit concurrent requests for a user.
 *
 * This middleware checks if a user has exceeded a specified concurrent request limit.
 * If the user exceeds the limit, an error is returned. If the user is within the limit,
 * their request count is incremented. After the request is processed, the count is decremented.
 * If the `cache` store is not available, the middleware will skip its logic.
 *
 * @function
 * @param {Object} req - Express request object containing user information.
 * @param {Object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @throws {Error} Throws an error if the user exceeds the concurrent request limit.
 */
const concurrentLimiter = async (req, res, next) => {
  const namespace = 'pending_req';
  const cache = getLogStores(namespace);
  if (!cache) {
    return next();
  }

  const isAbortRequest =
    Object.keys(req?.body ?? {}).length === 1 && req?.body?.abortKey;

  if (isAbortRequest) {
    return next();
  }

  const userId = req.user?.id ?? req.user?._id ?? '';
  const limit = Math.max(CONCURRENT_MESSAGE_MAX, 1);
  const type = 'concurrent';

  const key = `${USE_REDIS ? namespace : ''}:${userId}`;
  const pendingRequests = +((await cache.get(key)) ?? 0);

  if (pendingRequests >= limit) {
    const errorMessage = {
      type,
      limit,
      pendingRequests,
    };

    await logViolation(req, res, type, errorMessage, score);
    return await denyRequest(req, res, errorMessage);
  } else {
    await cache.set(key, pendingRequests + 1, REQUEST_TTL);
  }

  // Ensure the requests are removed from the store once the request is done
  let cleared = false;
  const cleanUp = async () => {
    if (cleared) {
      return;
    }
    cleared = true;
    await clearPendingReq({ userId, cache });
  };

  if (pendingRequests < limit) {
    res.on('finish', cleanUp);
    res.on('close', cleanUp);
  }

  next();
};

module.exports = concurrentLimiter;
