const bcrypt = require('bcryptjs');
const User = require('./User');

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};
