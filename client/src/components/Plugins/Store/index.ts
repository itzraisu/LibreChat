// plugins.js

export { default as PluginStoreDialog } from './PluginStoreDialog';
export { default as PluginStoreItem } from './PluginStoreItem';
export { default as PluginPagination } from './PluginPagination';
export { default as PluginStoreLinkButton } from './PluginStoreLinkButton';
export { default as PluginAuthForm } from './PluginAuthForm';
export { default as PluginTooltip } from './PluginTooltip';

// index.js

import * as plugins from './plugins';

export default plugins;


import plugins from 'path/to/plugins';

// Use the plugins like this:
const PluginStoreDialog = plugins.PluginStoreDialog;
const PluginStoreItem = plugins.PluginStoreItem;
// ...and so on.
