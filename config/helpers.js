/**
 * Helper functions
 * This allows us to give the console some colour when running in a terminal
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const askQuestion = (query) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('\x1b[36m' + query + '\n> ' + '\x1b[0m', (ans) => {
      rl.close();
      resolve(ans);
    });
  }).catch((err) => {
    console.error(err);
  });
};

function isDockerRunning() {
  if (process.platform === 'win32') {
    try {
      execSync('cmd /c ver');
      return true;
    } catch (e) {
      return false;
    }
  } else {
    try {
      execSync('docker info');
      return true;
    } catch (e) {
      return false;
    }
  }
}

function deleteNodeModules(dir) {
  if (typeof dir !== 'string') {
    throw new Error('dir must be a string');
  }

  const nodeModulesPath = path.join(dir, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    console.purple(`Deleting node_modules in ${dir}`);
    fs.rmdir(nodeModulesPath, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
}

const silentExit = (code = 0) => {
  console.log = () => {};
  process.exit(code);
};

// Set the console colours
console.orange = (msg) => console.log('\x1b[33m%s\x1b[0m', msg);
console.green = (msg) => console.log('\x1b[32m%s\x1b[0m', msg);
console.red = (msg) => console.log
