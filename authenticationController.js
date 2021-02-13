const crypto = require('crypto');

const users = new Map();

const hashPassword = password => {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
}

module.exports = { users, hashPassword };