const rateLimit = require('express-rate-limit');
const { logViolation } = require('../../cache');
const { removePorts } = require('../utils');

// Validate environment variables
const envVars = ['REGISTER_WINDOW', 'REGISTER_MAX', 'REGISTRATION_VIOLATION_SCORE'];
for (const varName of envVars) {
  if (!process.env[varName]) {
    console.error(`Missing environment variable: ${varName}`);
    process.exit(1);
  }
}

const REGISTER_WINDOW = parseInt(process.env.REGISTER_WINDOW, 10);
const REGISTER_MAX = parseInt(process.env.REGISTER_MAX, 10);
const REGISTRATION_VIOLATION_SCORE = parseInt(process.env.REGISTRATION_VIOLATION_SCORE, 10);

// Calculate windowMs, windowInMinutes, and message
const windowMs = REGISTER_WINDOW * 60 * 1000;
const max = REGISTER_MAX;
const windowInMinutes = windowMs / 60000;
const message = `Too many accounts created, please try again after ${windowInMinutes} minutes`;

// Validate req object
const validateReq = req => {
  if (!req || !req.ip) {
    throw new Error('Invalid req object');
  }
};

const handler = async (req, res) => {
  const type = 'registrations';
  const errorMessage = {
    type,
    max,
    windowInMinutes,
  };

  try {
    validateReq(req);
    await logViolation(req, res, type, errorMessage, REGISTRATION_VIOLATION_SCORE);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message:
