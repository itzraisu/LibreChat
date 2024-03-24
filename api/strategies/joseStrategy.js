const { Strategy: CustomStrategy } = require('passport-custom');
const jose = require('jose');
const User = require('~/models/User');

const joseLogin = async () =>
  new CustomStrategy(async (req, done) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return done(null, false, { message: 'Unauthorized. No auth token provided or incorrect format.' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jose.jwtVerify(token, secret);

      if (!payload.id) {
        return done(null, false, { message: 'Invalid token format.' });
      }

      const user = await User.findById(payload.id).exec();

      if (user) {
        done(null, user);
      } else {
        done(null, false, { message: 'No user found.' });
      }
    } catch (err) {
      if (err?.code === 'ERR_JWT_EXPIRED') {
        done(null, false, { message: 'Unauthorized. Token has expired.' });
      } else {
        done(err);
      }
    }
  });

module.exports = joseLogin;
