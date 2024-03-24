const winston = require('winston');

// Set up a custom logging format
const myFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  })
);

// Create the logger with the specified settings
const logger = winston.createLogger({
  level: 'info',
  format: myFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'login-logs.log' })
  ]
});

// Ensure that the logger is always able to log, even if there's an error
logger.exitOnError = false;

// Export the logger as a module
module.exports = logger;
