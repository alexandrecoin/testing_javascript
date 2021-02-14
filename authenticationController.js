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

const authenticationMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const credentials = Buffer.from(
        authHeader.slice("basic".length + 1),
        "base64"
    ).toString();

    const [username, password] = credentials.split(':');

    if(!areCredentialsValid(username, password)) {
      throw new Error('Invalid credentials');
    }
  } catch (e) {
    res.error = { message: 'Please provide valid credentials' };
    res.status = 401;
    return res
  }
  await next();
}

module.exports = {
  users,
  hashPassword,
  areCredentialsValid,
  authenticationMiddleware
};
