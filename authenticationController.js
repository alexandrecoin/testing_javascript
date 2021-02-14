const crypto = require('crypto');

const users = new Map();

const hashPassword = password => {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
}

const areCredentialsValid = (username, password) => {
  const userExists = users.has(username);
  if (!userExists) return false;

  const currentPasswordHash = users.get(username).passwordHash;
  return hashPassword(password) === currentPasswordHash;
}

module.exports = {
  users,
  hashPassword,
  areCredentialsValid
};
