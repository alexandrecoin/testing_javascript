const crypto = require('crypto');
const {
  hashPassword,
  areCredentialsValid,
  authenticationMiddleware
} = require('./authenticationController');

const { user } = require('./userTestUtils')

// Unit testing
describe('hashPassword', () => {
  test('hashing password', () => {
    const plainTextPassword = 'azerty123';
    const hash = crypto.createHash("sha256");
    hash.update(plainTextPassword);
    
    const expectedHash = hash.digest("hex");
    const actualHash = hashPassword(plainTextPassword);
    expect(actualHash).toEqual(expectedHash);
  });
});

describe('authenticationMiddleware', () => {
  test('returns an error with invalid credentials', async () => {
    const fakeAuth = Buffer.from('invalid:credentials').toString("base64");

    const req = {
      headers: {
        authorization: `Basic ${fakeAuth}`
      }
    };

    const res = {};
    const next = jest.fn();

    await authenticationMiddleware(req, res, next);

    expect(next.mock.calls).toHaveLength(0);
    expect(res).toEqual({
      ...res,
      status: 401,
      error: { message: 'Please provide valid credentials' }
    })
  });

  test('calls next with valid credentials', async () => {

    const req = {
      headers: {
        authorization: user.authHeader
      }
    };
    const res = {};
    const next = jest.fn();

    await authenticationMiddleware(req, res, next);

    expect(next.mock.calls).toHaveLength(1);
  });
});

// Integration testing
describe('areCredentialsValid', () => {
  test('valid credentials', async () => {
    const hasValidCredentials = await areCredentialsValid(user.username, user.password);

    expect(hasValidCredentials).toBe(true);
  });

  test('invalid credentials', async () => {
    const hasValidCredentials = await areCredentialsValid(user.username, 'qsdfgh456');

    expect(hasValidCredentials).toBe(false);
  });

  test('user does not exist', async () => {
    const result = await areCredentialsValid('test_user_not_existing', 'azerty123');

    expect(result).toBe(false);
  });
});
