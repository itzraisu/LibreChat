const path = require('path');
const { connectDb } = require('../lib/db/connectDb');

const basePath = path.resolve(__dirname, '..', 'api');

async function connect() {
  // Attempt to connect to the database
  try {
    console.log('Warming up the engines...');
    await connectDb();
    console.log('Connected to the database.');
  } catch (e) {
    console.error('Error connecting to the database:', e);
    console.error('Exiting the process...');
    process.exit(1);
  }
}

// Use the --experimental-specifier-resolution=node flag instead of module-alias
module.exports = connect;


node --experimental-specifier-resolution=node your-script.js
