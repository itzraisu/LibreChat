const shouldNoIndex = () => {
  if (process.env.NO_INDEX) {
    return process.env.NO_INDEX.toLowerCase() === 'true';
  }
  return true;
};

const noIndex = (req, res, next) => {
  if (shouldNoIndex()) {
    res.setHeader('X-Robots-Tag', 'noindex');
  }

  next();
};

module.exports = noIndex;

