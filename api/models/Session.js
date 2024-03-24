const crypto = require('crypto');
const mongoose = require('mongoose');
const signPayload = require('~/server/services/signPayload');
const { logger } = require('~/config');

const REFRESH_TOKEN_EXPIRY_DEFAULT = 1000 * 60 * 60 * 24 * 7;
const REFRESH_TOKEN_EXPIRY_REGEX = /^\d+$/;

const { REFRESH_TOKEN_EXPIRY, JWT_REFRESH_SECRET } = process.env;
const expires = REFRESH_TOKEN_EXPIRY ? parseInt(REFRESH_TOKEN_EXPIRY, 10) : REFRESH_TOKEN_EXPIRY_DEFAULT;

if (!REFRESH_TOKEN_EXPIRY || !REFRESH_TOKEN_EXPIRY_REGEX.test(REFRESH_TOKEN_EXPIRY)) {
  logger.error('Invalid or missing REFRESH_TOKEN_EXPIRY environment variable.');
}

if (!JWT_REFRESH_SECRET) {
  logger.error('Missing JWT_REFRESH_SECRET environment variable.');
}

const sessionSchema = new mongoose.Schema({
  refreshTokenHash: {
    type: String,
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
    expires: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

sessionSchema.methods.generateRefreshToken = async function () {
  try {
    let expiresIn;
    if (this.expiration) {
      expiresIn = this.expiration.getTime();
    } else {
      expiresIn = Date.now() + expires;
      this.expiration = new Date(expiresIn);
    }

    const refreshToken = await signPayload({
      payload: { id: this.user },
      secret: JWT_REFRESH_SECRET,
      expirationTime: Math.floor((expiresIn - Date.now()) / 1000),
    });

    const hash = crypto.randomBytes(32).toString('hex');
    this.refreshTokenHash = hash;

    try {
      await this.save();
    } catch (error) {
      logger.error('Error saving session:', error);
      throw error;
    }

    return refreshToken;
  } catch (error) {

