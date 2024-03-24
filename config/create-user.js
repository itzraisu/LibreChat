const path = require('path');
const readline = require('readline');
const { check, validationResult } = require('express-validator');
const { registerUser } = require('../server/services/AuthService');
const { askQuestion, silentExit } = require('./helpers');
const User = require('../models/User');
const connect = require('./connect');
const { moduleAlias, dotenv } = require('../package.json').dependencies;

if (!moduleAlias || !dotenv) {
  console.error('Error: The "module-alias" and/or "dotenv" packages are missing.');
  process.exit(1);
}

require('module-alias')({ base: path.resolve(__dirname, '..', 'api') });
dotenv.config();

(async () => {
  await connect();

  /**
   * Show the welcome / help menu
   */
  console.purple('--------------------------');
  console.purple('Create a new user account!');
  console.purple('--------------------------');

  /**
   * Set up the variables we need and get the arguments if they were passed in
   */
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const args = process.argv.slice(2);
  const email = args[0];
  const name = args[1];
  const username = args[2];
  let password = '';

  if (args.length === 4) {
    password = args[3];
  } else {
    rl.question('Password: (leave blank, to generate one)', (input) => {
      if (input) {
        password = input;
      }
      rl.close();
    });
  }

  rl.on('close', async () => {
    if (!email || !name || !username) {
      console.orange('Usage: npm run create-user <email> <name> <username>');
      console.orange('Note: if you do not pass in the arguments, you will be prompted for them.');
      console.orange(
        'If you really need to pass in the password, you can do so as the 4th argument (not recommended for security).',
      );
      console.purple('--------------------------');
      silentExit(1);
    }

    /**
     * Validate the email
     */
    const emailValidationRules = [
      check('email').isEmail().withMessage('Error: Invalid email address!'),
    ];

    const validatedEmail = await new Promise((resolve) => {
      const errors = validationResult(rl);
      if (!errors.isEmpty()) {
        console.red(errors.array()[0].msg);
        resolve(null);
      }
      resolve(email);
    });

    if (!validatedEmail) {
      silentExit(1);
    }

    /**
     * Set the default name and username if they are not provided
     */
    const defaultName = validatedEmail.split('@')[0];
    const finalName = name || defaultName;
    const finalUsername = username || defaultName;

    /**
     * Check if the user already exists
     */
    const userExists = await User.findOne({ $or: [{ email: validatedEmail }, { username: finalUsername }] });

    if (userExists) {
      console.red('Error: A user with that email or username already exists!');
      silentExit(1);
    }

    /**
     * Create the user
     */
    const user = { email: validatedEmail, password, name: finalName, username: finalUsername, confirm_password: password };
    let result;
    try {
      result = await registerUser(user);
    } catch (error) {
      console.red('Error: ' + error.message);
      silentExit(1);
    }

    /**
     * Check the result
     */
    if (result.status !== 200) {
      console.red('Error: ' + result.message);
      silentExit(1);
    }

    /**
     * Done!
     */
    const userCreated = await User.findOne({ $or: [{ email: validatedEmail }, { username: finalUsername }] });
    if (userCreated) {
      console.green('User created successfully!');
      silentExit(0);
    }
  });
})();

process.on('uncaughtException', (err) => {
  if (!err.message.includes('fetch failed')) {
    console.error('There was an uncaught error:');
    console.error(err);
  }

  if (err.message.includes('fetch failed')) {
    return;
  } else {
    process.exit(1);
  }
});
