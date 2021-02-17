const crypto = require('crypto');
const { db } = require('./dbConnection');

const hashPassword = password => {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
}

const areCredentialsValid = async (username, password) => {
  const user = await db
      .select()
      .from('users')
      .where({ username })
      .first();

  if (!user) return false;
  return hashPassword(password) === user.passwordHash;
}

const authenticationMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const credentials = Buffer.from(
        authHeader.slice("basic".length + 1),
        "base64"
    ).toString();

    const [username, password] = credentials.split(':');

    const validCredentialsSent = await areCredentialsValid(username, password);

    if(!validCredentialsSent) {
      throw new Error('Invalid credentials');
    }
  } catch (e) {
    res.error = { message: 'Please provide valid credentials' };
    res.status = 401;
    return res;
  }
  await next();
}

module.exports = {
  hashPassword,
  areCredentialsValid,
  authenticationMiddleware
};
