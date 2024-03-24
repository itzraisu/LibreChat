const URL = require('url').URL;
const path = require('path');

const imageExtensionRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|svg|webp)$/i;

/**
 * Extracts the basename of a file from a given URL.
 *
 * @param {string} urlString - The URL string from which the file basename is to be extracted.
 * @param {('http:'|'https:')?} [protocol] - The protocol to check against. Optional.
 * @returns {string} The basename of the file from the URL.
 * Returns an empty string if the URL parsing fails or the pathname is missing.
 */
function getBasename(urlString, protocol) {
  try {
    const url = new URL(urlString);

    // Check if the URL has a valid protocol
    if (protocol && url.protocol !== protocol) {
      return '';
    }

    // Check if the URL has a pathname
    if (!url.pathname) {
      return '';
    }

    const basename = path.basename(url.pathname);

    // Check if the basename matches the image extension regex
    if (imageExtensionRegex.test(basename)) {
      return basename;
    }

    // If the basename doesn't match the image extension regex, return it as is
    return path.basename(url.pathname, path.extname(url.pathname));
  } catch (error) {
    // If URL parsing fails, return an empty string
    return '';
  }
}

module.exports = {
  getBasename,
};
