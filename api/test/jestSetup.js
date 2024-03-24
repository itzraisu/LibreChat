// Load environment variables from .env.test file
require('dotenv').config({ path: './test/.env.test' });

// Set production-like environment variables for testing
const environmentVariables = {
  BAN_VIOLATIONS: 'true',
  BAN_DURATION: '7200000',
  BAN_INTERVAL: '20',
};

Object.keys(environmentVariables).forEach((key) => {
  if (process.env[key] === undefined) {
    process.env[key] = environmentVariables[key];
  }
});
