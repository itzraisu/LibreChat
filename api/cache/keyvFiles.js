const { KeyvFile } = require('keyv-file');

// Define a constant for the directory where the data files are stored
const DATA_DIR = './data';

// Define a function to create a KeyvFile instance for a given filename
const createKeyvFile = (filename) => {
  return new KeyvFile({ filename: `${DATA_DIR}/${filename}.json` });
};

// Create KeyvFile instances for each of the data files
const logFile = createKeyvFile('logs');
const pendingReqFile = createKeyvFile('pendingReqCache');
const violationFile = createKeyvFile('violations');

// Export the KeyvFile instances as an object
module.exports = {
  logFile,
  pendingReqFile,
  violationFile,
};
