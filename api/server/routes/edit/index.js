const express = require('express');
const openAI = require('./openAI');
const custom = require('./custom');
const google = require('./google');
const anthropic = require('./anthropic');
const gptPlugins = require('./gptPlugins');
const { isEnabled } = require('~/server/utils');
const { EModelEndpoint } = require('librechat-data-provider');
const {
  checkBan,
  uaParser,
  requireJwtAuth,
  messageIpLimiter,
  concurrentLimiter,
  messageUserLimiter,
} = require('~/server/middleware');

const { LIMIT_CONCURRENT_MESSAGES, LIMIT_MESSAGE_IP, LIMIT_MESSAGE_USER } = process.env || {};
const DEFAULT_LIMITS = {
  LIMIT_CONCURRENT_MESSAGES: 10,
  LIMIT_MESSAGE_IP: 100,
  LIMIT_MESSAGE_USER: 500,
};

const router = express.Router();

const checkLimits = (limitName) => {
  if (isEnabled(limitName)) {
    return [eval(limitName)];
  }
  return [];
};

router.use(requireJwtAuth);
router.use(checkBan);
router.use(uaParser);

const limiterMiddleware = checkLimits(LIMIT_CONCURRENT_MESSAGES)
  .concat(checkLimits(LIMIT_MESSAGE_IP))
  .concat(checkLimits(LIMIT_MESSAGE_USER));

limiterMiddleware.forEach((middleware) => {
  if (middleware) {
    router.use(middleware);
  }
});

router.use([`/${EModelEndpoint.azureOpenAI}`, `/${EModelEndpoint.openAI}`], openAI);
