// Message methods
const {
  getMessages,
  saveMessage,
  recordMessage,
  updateMessage,
  deleteMessagesSince,
  deleteMessages,
} = require('./Message');

// Conversation methods
const {
  getConvoTitle,
  getConvo,
  saveConvo,
  deleteConvos,
} = require('./Conversation');

// Preset methods
const {
  getPreset,
  getPresets,
  savePreset,
  deletePresets,
} = require('./Preset');

// User methods
const {
  hashPassword,
  getUser,
  updateUser,
} = require('./userMethods');

// File methods
const {
  findFileById,
  createFile,
  updateFile,
  deleteFile,
  deleteFiles,
  getFiles,
  updateFileUsage,
} = require('./File');

// Other models
const Key = require('./Key');
const Session = require('./Session');
const Balance = require('./Balance');


// Export all methods and models
module.exports = {
  // Message methods
  getMessages,
  saveMessage,
  recordMessage,
  updateMessage,
  deleteMessagesSince,
  deleteMessages,

  // Conversation methods
  getConvoTitle,
  getConvo,
  saveConvo,
  deleteConvos,

  // Preset methods
  getPreset,
  getPresets,
  savePreset,
  deletePresets,

  // User methods
  hashPassword,
  getUser,
  updateUser,

  // File methods
  findFileById,
  createFile,
  updateFile,
  deleteFile,
  deleteFiles,
  getFiles,
  updateFileUsage,

  // Other models
  Key,
  Session,
  Balance,
};
