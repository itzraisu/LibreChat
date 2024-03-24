const rateLimit = require('express-rate-limit');
const { ViolationTypes } = require('librechat-data-provider');
const logViolation = require('~/cache/logViolation');

const getEnvVariable = (name, defaultValue) => {
  const value = process.env[name] || defaultValue;
  if (isNaN(value)) {
    throw new Error(`Invalid environment variable: ${name}`);
  }
  return parseInt(value, 10);
};

const getRateLimitConfig = () => {
  const FILE_UPLOAD_IP_MAX = getEnvVariable('FILE_UPLOAD_IP_MAX', 100);
  const FILE_UPLOAD_IP_WINDOW = getEnvVariable('FILE_UPLOAD_IP_WINDOW', 15);
  const FILE_UPLOAD_USER_MAX = getEnvVariable('FILE_UPLOAD_USER_MAX', 50);
  const FILE_UPLOAD_USER_WINDOW = getEnvVariable('FILE_UPLOAD_USER_WINDOW', 15);

  const ipWindowMs = FILE_UPLOAD_IP_WINDOW * 60 * 1000;
  const ipMax = FILE_UPLOAD_IP_MAX;
  const ipWindowInMinutes = ipWindowMs / 60000;

  const userWindowMs = FILE_UPLOAD_USER_WINDOW * 60 * 1000;
  const userMax = FILE_UPLOAD_USER_MAX;
  const userWindowInMinutes = userWindowMs / 60000;

  return {
    ipWindowMs,
    ipMax,
    ipWindowInMinutes,
    userWindowMs,
    userMax,
    userWindowInMinutes,
  };
};

const createRateLimiter = ({ max, windowMs, handler, keyGenerator }) =>
  rateLimit({ windowMs, max, handler, keyGenerator });

const createErrorMessage = ({ type, max, limiter, windowInMinutes }) => ({
  type,
  max,
  limiter,
  windowInMinutes,
});

const createFileUploadHandler = (ip, { ipWindowMs, ipMax, userWindowMs, userMax }) =>
  async (req, res) => {
    const type = ViolationTypes.FILE_UPLOAD_LIMIT;
    const errorMessage = createErrorMessage({
      type,
      max: ip ? ipMax : userMax,
      limiter: ip ? 'ip' : 'user',
      windowInMinutes: ip ? ipWindowMs : userWindowMs,
    });

    await logViolation(req, res, type, errorMessage);
    res.status(429).json({ message: 'Too many file upload requests. Try again later' });
  };

const createFileLimiters = () => {
  const config = getRateLimitConfig();

  const fileUploadIpLimiter = createRateLimiter({
    max: config.ipMax,
    windowMs: config.ipWindowMs,
    handler: createFileUploadHandler(true, config),
  });

  const fileUploadUserLimiter = createRateLimiter({
    max: config.userMax,
    windowMs: config.userWindowMs,
    handler: createFileUploadHandler(false, config),
    keyGenerator: function (req) {
      return req.user?.id || null;
    },
  });

  return { fileUploadIpLimiter, fileUploadUserLimiter };
};

module.exports = {
  createFileLimiters,
};
