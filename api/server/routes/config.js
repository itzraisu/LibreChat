const express = require('express');
const { defaultSocialLogins } = require('librechat-data-provider');
const { isEnabled } = require('~/server/utils');
const { logger } = require('~/config');
const dotenvFlow = require('dotenv-flow');

const router = express.Router();
const emailLoginEnabled =
  (process.env.ALLOW_EMAIL_LOGIN === 'true' || process.env.ALLOW_EMAIL_LOGIN === undefined) && isEnabled(process.env.ALLOW_EMAIL_LOGIN);

// Load environment variables from .env file
dotenvFlow.config();

// Validate social login environment variables
const isValidClientId = (str) => /^[a-zA-Z0-9-._~]+$/.test(str);
const isValidClientSecret = (str) => /^[a-zA-Z0-9-._~]{40}$/.test(str);
const validateSocialLoginEnv = () => {
  if (process.env.DISCORD_CLIENT_ID && !isValidClientId(process.env.DISCORD_CLIENT_ID)) {
    throw new Error('Invalid DISCORD_CLIENT_ID');
  }
  if (process.env.DISCORD_CLIENT_SECRET && !isValidClientSecret(process.env.DISCORD_CLIENT_SECRET)) {
    throw new Error('Invalid DISCORD_CLIENT_SECRET');
  }
  if (process.env.FACEBOOK_CLIENT_ID && !isValidClientId(process.env.FACEBOOK_CLIENT_ID)) {
    throw new Error('Invalid FACEBOOK_CLIENT_ID');
  }
  if (process.env.FACEBOOK_CLIENT_SECRET && !isValidClientSecret(process.env.FACEBOOK_CLIENT_SECRET)) {
    throw new Error('Invalid FACEBOOK_CLIENT_SECRET');
  }
  if (process.env.GITHUB_CLIENT_ID && !isValidClientId(process.env.GITHUB_CLIENT_ID)) {
    throw new Error('Invalid GITHUB_CLIENT_ID');
  }
  if (process.env.GITHUB_CLIENT_SECRET && !isValidClientSecret(process.env.GITHUB_CLIENT_SECRET)) {
    throw new Error('Invalid GITHUB_CLIENT_SECRET');
  }
  if (process.env.GOOGLE_CLIENT_ID && !isValidClientId(process.env.GOOGLE_CLIENT_ID)) {
    throw new Error('Invalid GOOGLE_CLIENT_ID');
  }
  if (process.env.GOOGLE_CLIENT_SECRET && !isValidClientSecret(process.env.GOOGLE_CLIENT_SECRET)) {
    throw new Error('Invalid GOOGLE_CLIENT_SECRET');
  }
};

router.get('/', async function (req, res) {
  const isBirthday = () => {
    const today = new Date();
    return today.getMonth() === 1 && today.getDate() === 11;
  };

  try {
    validateSocialLoginEnv();

    const payload = {
      appTitle: process.env.APP_TITLE || 'LibreChat',
      socialLogins: Array.isArray(req.app.locals.
