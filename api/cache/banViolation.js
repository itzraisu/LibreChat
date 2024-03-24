const Session = require('~/models/Session');
const getLogStores = require('./getLogStores');
const { isEnabled, math, removePorts } = require('~/server/utils');
const { logger } = require('~/config');

const { BAN_VIOLATIONS, BAN_INTERVAL, BAN_DURATION } = process.env;

// Convert string value of BAN_INTERVAL to integer and set default value
const interval = math(parseInt(BAN_INTERVAL, 10) || 20, 20);

/**
 * Bans a user based on violation criteria.
 *
 * If the user's violation count is a multiple of the BAN_INTERVAL, the user will be banned.
 * The duration of the ban is determined by the BAN_DURATION environment variable.
 * If BAN_DURATION is not set or invalid, the user will not be banned.
 * Sessions will be deleted and the refreshToken cookie will be cleared even with
 * an invalid or null duration, which is a "soft" ban; the user can remain active until
 * access token expiry.
 *
 * @async
 * @param {Object} req - Express request object containing user information.
 * @param {Object} res - Express response object.
 * @param {Object} errorMessage - Object containing user violation details.
 * @param {string} errorMessage.type - Type of the violation.
 * @param {string} errorMessage.user_id - ID of the user who committed the violation.
 * @param {number} errorMessage.violation_count - Number of violations committed by the user.
 *
 * @returns {Promise<void>}
 *
 */
const banViolation = async (req, res, errorMessage) => {
  if (!isEnabled(BAN_VIOLATIONS)) {
    return;
  }

  if (!errorMessage) {
    return;
  }

  const { type, user_id, prev_count, violation_count } = errorMessage;

  // Check if the user has crossed the threshold for ban
  const prevThreshold = Math.floor(prev_count / interval);
  const currentThreshold = Math.floor(violation_count / interval);

  if (prevThreshold >= currentThreshold) {
    return;
  }

  // Delete user sessions and clear refreshToken cookie
  await Session.deleteAllUserSessions(user_id);
  res.clearCookie('refreshToken');

  const banLogs = getLogStores('ban');

  // Calculate ban duration
  let duration = errorMessage.duration || banLogs.opts.ttl;

  if (duration <= 0 || !duration) {
    return;
  }

  req.ip = removePorts(req);
  logger.info(
    `[BAN] Banning user ${user_id} ${req.ip ? `@ ${req.ip} ` : ''}for ${
      duration / 1000 / 60
    } minutes`,
  );

  // Set ban logs with expiry time
  const expiresAt = Date.now() + duration;
  await banLogs.set(user_id, { type, violation_count, duration, expiresAt });
  if (req.ip) {
    await banLogs.set(req.ip, { type, user_id, violation_count, duration, expiresAt });
  }

  // Set ban properties in errorMessage object
  errorMessage.ban = true;
  errorMessage.ban_duration = duration;

  return;
};

module.exports = banViolation;
