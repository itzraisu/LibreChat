const PluginAuth = require('~/models/schema/pluginAuthSchema');
const { encrypt, decrypt } = require('~/server/utils/');
const { logger } = require('~/config');

/**
 * Asynchronously retrieves and decrypts the authentication value for a user's plugin, based on a specified authentication field.
 *
 * @param {string} userId - The unique identifier of the user for whom the plugin authentication value is to be retrieved.
 * @param {string} authField - The specific authentication field (e.g., 'API_KEY', 'URL') whose value is to be retrieved and decrypted.
 * @returns {Promise<string|null>} A promise that resolves to the decrypted authentication value if found, or `null` if no such authentication value exists for the given user and field.
 *
 * The function throws an error if it encounters any issue during the retrieval or decryption process, or if the authentication value does not exist.
 *
 * @example
 * // To get the decrypted value of the 'token' field for a user with userId '12345':
 * getUserPluginAuthValue('12345', 'token').then(value => {
 *   console.log(value);
 * }).catch(err => {
 *   console.error(err);
 * });
 *
 * @throws {Error} Throws an error if there's an issue during the retrieval or decryption process, or if the authentication value does not exist.
 * @async
 */
const getUserPluginAuthValue = async (userId, authField) => {
  try {
    const pluginAuth = await PluginAuth.findOne({ userId, authField }).lean();
    if (!pluginAuth) {
      throw new Error(`No plugin auth ${authField} found for user ${userId}`);
    }

    const decryptedValue = decrypt(pluginAuth.value);
    return decryptedValue;
  } catch (err) {
    logger.error('[getUserPluginAuthValue]', err);
    throw err;
  }
};

const updateUserPluginAuth = async (userId, authField, pluginKey, value) => {
  try {
    const encryptedValue = encrypt(value);
    const update = { value: encryptedValue };

    if (pluginKey) {
      update.pluginKey = pluginKey;
    }

    const options = { new: true, upsert: true };
    const pluginAuth = await PluginAuth.findOneAndUpdate({ userId, authField }, update, options).lean();

    return pluginAuth;
  } catch (err) {
    logger.error('[updateUserPluginAuth]', err);
    throw err;
  }
};

const deleteUserPluginAuth = async (userId, authField) => {
  try {
    return await PluginAuth.deleteOne({ userId, authField });
  } catch (err) {
    logger.error('[deleteUserPluginAuth]', err);
    throw err;
  }
};

module.exports = {
  getUserPluginAuthValue,
  updateUserPluginAuth,
  deleteUserPluginAuth,
};
