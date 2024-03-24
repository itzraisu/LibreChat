const logger = require('./logger');
const { v4: uuidv4 } = require('uuid');

const redactPatterns = [
  /api[-_]?key/i,
  /password/i,
  /token/i,
  /secret/i,
  /key/i,
  /certificate/i,
  /client[-_]?id/i,
  /authorization[-_]?code/i,
  /authorization[-_]?login[-_]?hint/i,
  /authorization[-_]?acr[-_]?values/i,
  /authorization[-_]?response[-_]?mode/i,
  /authorization[-_]?nonce/i,
];

const sanitizeValue = (value, patterns) => {
  for (const pattern of patterns) {
    if (pattern.test(value)) {
      return '***';
    }
  }
  return value;
};

const sanitizeObject = (obj, patterns) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, patterns));
  }

  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    newObj[key] = sanitizeValue(value, patterns);
  }
  return newObj;
};

const levels = {
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  FATAL: 60,
};

let level = levels.INFO;

module.exports = {
  levels,
  setLevel: (l) => (level = l),
  log: {
    trace: (msg, obj) => {
      if (level <= levels.TRACE) {
        return;
      }
      logger.trace({ id: uuidv4(), msg, ...sanitizeObject(obj, redactPatterns) });
    },
    debug: (msg, obj) => {
      if (level <= levels.DEBUG) {
        return;
      }
      logger.debug({ id: uuidv4(), msg, ...sanitizeObject(obj, redactPatterns) });
    },
    info: (msg, obj) => {
      if (level <= levels.INFO) {
        return;
      }
      logger.info({ id: uuidv4(), msg, ...sanitizeObject(obj, redactPatterns) });
    },
    warn: (msg, obj) => {
      if (level <= levels.WARN) {
        return;
      }
      logger.warn({ id: uuidv4(), msg, ...sanitizeObject(obj, redactPatterns) });
    },
    error: (msg, obj) => {
      if (level <= levels.ERROR) {
        return;
      }
      logger.error({ id: uuidv4(), msg, ...sanitizeObject(obj, redactPatterns) });
    },
    fatal: (msg, obj) => {
      if (level <= levels.FATAL) {
        return;
      }
      logger.fatal({ id: uuidv4(), msg, ...sanitizeObject(obj, redactPatterns) });
    },
  },
};
