const express = require('express');
const EditController = require('~/server/controllers/EditController');
const { initializeClient } = require('~/server/services/Endpoints/openAI');
const {
  handleAbort,
  setHeaders,
  validateModel,
  validateEndpoint,
  buildEndpointOption,
  moderateText,
} = require('~/server/middleware');

const router = express.Router();

// Apply middleware functions to the router
router.use(moderateText);
router.post('/abort', handleAbort);

router.post(
  '/',
  validateEndpoint,
  validateModel,
  buildEndpointOption,
  setHeaders,
  async (req, res, next) => {
    try {
      // Initialize the client before passing it to the controller
      const client = initializeClient();
      await EditController(req, res, next, client);
    } catch (error) {
      // Handle any errors that occur during initialization
      next(error);
    }
  },
);

module.exports = router;

