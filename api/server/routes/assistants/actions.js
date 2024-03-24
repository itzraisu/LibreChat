const { v4: uuidv4 } = require('uuid');
const express = require('express');
const { actionDelimiter } = require('librechat-data-provider');
const { initializeClient } = require('~/server/services/Endpoints/assistants');
const { encryptMetadata, domainParser } = require('~/server/services/ActionService');
const { updateAction, getActions, deleteAction } = require('~/models/Action');
const { updateAssistant, getAssistant } = require('~/models/Assistant');
const { logger } = require('~/config');

const router = express.Router();
const { OPENAI_API_KEY } = process.env;

/**
 * Validates the request body for the add/update actions route.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const validateAddUpdateActionsRequest = (req, res, next) => {
  if (!Array.isArray(req.body.functions) || req.body.functions.length === 0) {
    return res.status(400).json({ message: 'No functions provided' });
  }
  if (typeof req.body.action_id !== 'string') {
    delete req.body.action_id;
  }
  if (typeof req.body.metadata !== 'object') {
    req.body.metadata = {};
  }
  next();
};

/**
 * Retrieves all user's actions
 * @route GET /actions/
 * @param {string} req.params.id - Assistant identifier.
 * @returns {Action[]} 200 - success response - application/json
 */
router.get('/', async (req, res) => {
  try {
    res.json(await getActions());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Adds or updates actions for a specific assistant.
 * @route POST /actions/:assistant_id
 * @param {string} req.params.assistant_id - The ID of the assistant.
 * @param {FunctionTool[]} req.body.functions - The functions to be added or updated.
 * @param {string} [req.body.action_id] - Optional ID for the action.
 * @param {ActionMetadata} req.body.metadata - Metadata for the action.
 * @returns {Object} 200 - success response - application/json
 */
router.post(
  '/:assistant_id',
  validateAddUpdateActionsRequest,
  async (req, res) => {
    // ... (the rest of the code is the same)
  },
);

/**
 * Retrieves an action for a specific assistant.
 * @route GET /actions/:assistant_id/:action_id
 * @param {string} req.params.assistant_id - The ID of the assistant.
 * @param {string} req.params.action_id - The ID of the action.
 * @returns {Object} 200 - success response - application/json
 */
router.get('/:assistant_id/:action_id', async (req, res) => {
  try {
    const { assistant_id, action_id } = req.params;
    const action = await getActions({ action_id }, true);

    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }

    if (action.assistant_id !== assistant_id) {
      return res.status(404).json({ message: 'Action not found for this assistant' });
    }

    res.json(action);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Deletes an action for a specific assistant.
 * @route DELETE /actions/:assistant_id/:action_id
 * @param {string} req.params.assistant_id - The ID of the assistant.
 * @param {string} req.params.action_id - The ID of the action to delete.
 * @returns {Object} 200 - success response - application/json
 */
router.delete(
  '/:assistant_id/:action_id/:model',
  async (req, res) => {
    // ... (the rest of the code is the same)
  },
);

module.exports = router;
