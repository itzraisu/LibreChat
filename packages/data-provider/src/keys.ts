/**
 * Enums for query keys
 */
export enum QueryKeys {
  // Conversations
  MESSAGES = 'messages',
  ALL_CONVERSATIONS = 'allConversations',
  SEARCH_CONVERSATIONS = 'searchConversations',
  CONVERSATION = 'conversation',
  SEARCH_ENABLED = 'searchEnabled',

  // User
  USER = 'user',
  NAME = 'name', // user key name

  // Models
  MODELS = 'models',
  BALANCE = 'balance',
  ENDPOINTS = 'endpoints',
  PRESETS = 'presets',
  SEARCH_RESULTS = 'searchResults',
  TOKEN_COUNT = 'tokenCount',
  AVAILABLE_PLUGINS = 'availablePlugins',
  STARTUP_CONFIG = 'startupConfig',

  // Assistants
  ASSISTANTS = 'assistants',
  ASSISTANT = 'assistant',
  ENDPOINTS_CONFIG_OVERRIDE = 'endpointsConfigOverride',

  // Files
  FILES = 'files',
  FILE_CONFIG = 'fileConfig',

  // Tools
  TOOLS = 'tools',

  // Actions
  ACTIONS = 'actions',

  // Assistant Docs
  ASSISTANT_DOCS = 'assistantDocs',
}

/**
 * Enums for mutation keys
 */
export enum MutationKeys {
  FILE_UPLOAD = 'fileUpload',
  FILE_DELETE = 'fileDelete',
  UPDATE_PRESET = 'updatePreset',
  DELETE_PRESET = 'deletePreset',
  LOGOUT_USER = 'logoutUser',
  AVATAR_UPLOAD = 'avatarUpload',
  ASSISTANT_AVATAR_UPLOAD = 'assistantAvatarUpload',
  UPDATE_ACTION = 'updateAction',
  DELETE_ACTION = 'deleteAction',
}
