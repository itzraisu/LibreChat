const FacebookStrategy = require('passport-facebook').Strategy;
const { createNewUser, handleExistingUser } = require('./process');
const { logger } = require('~/config');
const User = require('~/models/User');

const facebookLogin = async (accessToken, refreshToken, profile, cb) => {
  try {
    const { emails, id, photos } = profile;
    const email = emails[0]?.value;
    const avatarUrl = photos[0]?.value;
    const oldUser = await User.findOne({ email });
    const ALLOW_SOCIAL_REGISTRATION =
      process.env.ALLOW_SOCIAL_REGISTRATION?.toLowerCase() === 'true';

    if (oldUser) {
      await handleExistingUser(oldUser, avatarUrl);
      return cb(null, oldUser);
    }

    if (ALLOW_SOCIAL_REGISTRATION) {
      const { name: { givenName, familyName }, displayName } = profile;
      const newUser = await createNewUser({
        email,
        avatarUrl,
        provider: 'facebook',
        providerKey: 'facebookId',
        providerId: id,
        username: displayName,
        name: `${givenName} ${familyName}`,
      });
      return cb(null, newUser);
    }
  } catch (err) {
    logger.error('[facebookLogin]', err);
    return cb(err);
  }
};

const facebookStrategyOptions = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: `${process.env.DOMAIN_SERVER}${process.env.FACEBOOK_CALLBACK_URL}`,
  proxy: true,
  scope: ['public_profile'],
  profileFields: ['id', 'email', 'name'],
};

const facebookStrategy = new FacebookStrategy(
  facebookStrategyOptions,
  facebookLogin,
);

module.exports = facebookStrategy;

