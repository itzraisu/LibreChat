const jwt = require('jsonwebtoken');

/**
 * Signs a given payload using either the `jose` library (for Bun runtime) or `jsonwebtoken`.
 *
 * @async
 * @function
 * @param {Object} options - The options for signing the payload.
 * @param {Object} options.payload - The payload to be signed.
 * @param {string} options.secret - The secret key used for signing.
 * @param {number} options.expirationTime - The expiration time in seconds.
 * @param {string} [options.algorithm='HS256'] - The algorithm used for signing.
 * @returns {Promise<string>} Returns a promise that resolves to the signed JWT.
 * @throws {TypeError} Throws a type error if any of the input types are incorrect.
 * @throws {Error} Throws an error if there's an issue during signing.
 *
 * @example
 * const signedPayload = await signPayload({
 *   payload: { userId: 123 },
 *   secret: 'my-secret-key',
 *   expirationTime: 3600,
 *   algorithm: 'RS256'
 * });
 */
async function signPayload({ payload, secret, expirationTime, algorithm = 'HS256' }) {
  if (typeof payload !== 'object') {
    throw new TypeError('Expected `payload` to be an object.');
  }

  if (typeof secret !== 'string' || secret.trim().length === 0) {
    throw new TypeError('Expected `secret` to be a non-empty string.');
  }

  if (typeof expirationTime !== 'number' || expirationTime <= 0) {
    throw new TypeError('Expected `expirationTime` to be a positive number.');
  }

  return jwt.sign(payload, secret, {
    expiresIn: expiration
