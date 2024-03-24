const { logger } = require('~/config');

const handleDuplicateKeyError = (err, res) => {
  logger.error('Duplicate key error:', err.keyValue);
  const field = Object.keys(err.keyValue)[0];
  const message = `An document with that ${field} already exists.`;
  res.status(409).json({ message, field });
};

const handleValidationError = (err, res) => {
  logger.error('Validation error:', err.errors);
  const errors = Object.values(err.errors).map((el) => el.message);
  const fields = Object.values(err.errors).map((el) => el.path);
  const message = errors.length > 1 ? errors.join(' ') : errors[0];
  res.status(400).json({ message, fields });
};

const errorHandler = (err, req, res, next) => {
  try {
    if (err.name === 'ValidationError') {
      return handleValidationError(err, res);
    }
    if (err.code && err.code === 11000) {
      return handleDuplicateKeyError(err, res);
    }
  } catch (error) {
    logger.error('ErrorController => error', error);
    return res.status(500).json({ message: 'An unknown error occurred.' });
  }

  next(err);
};

module.exports = errorHandler;


app.use(yourMiddleware);
app.use(errorHandler);
app.use('/', yourRoutes);
