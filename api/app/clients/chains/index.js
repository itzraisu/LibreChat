const runTitleChain = require('./runTitleChain');
const predictNewSummary = require('./predictNewSummary');

// Export the functions using the module.exports object
module.exports = {
  runTitleChain,
  predictNewSummary,
};

// Add some error handling to ensure that the required modules are properly defined
if (typeof runTitleChain !== 'function' || typeof predictNewSummary !== 'function') {
  throw new Error('One or more required modules are not properly defined');
}

