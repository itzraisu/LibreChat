const express = require('express');
const AskController = require('~/server/controllers/AskController');
const { addTitle, initializeClient } = require('~/server/services/Endpoints/anthropic');
const {
  setHeaders,
  handleAbort,
  validateModel,
  validateEndpoint,
  buildEndpointOption,
} = require('~/server/middleware');

const router = express.Router();

// Use handleAbort as a middleware function, not calling it directly
router.post('/abort', handleAbort);

router.post(
  '/',
  validateEndpoint,
  validateModel,
  buildEndpointOption,
  setHeaders,
  async (req, res, next) => {
    try {
      await AskController(req, res, initializeClient, addTitle);
    } catch (error) {
      next(error);
    }
  },
);

// Export the router as an object, not a function
module.exports = { router };

