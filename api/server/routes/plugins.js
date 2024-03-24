const express = require('express');
const PluginController = require('../controllers/PluginController');
const requireJwtAuth = require('../middleware/requireJwtAuth');

const router = express.Router();

// Get all available plugins
router.get('/', requireJwtAuth, PluginController.getAvailablePlugins);

// Add more routes here as needed
// ...

// Export the router
module.exports = router;

