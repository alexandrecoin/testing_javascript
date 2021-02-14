const crypto = require('crypto');
const { hashPassword, areCredentialsValid, authenticationMiddleware, users } = require('./authenticationController');

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
    users.set('test_user', {
      email: 'test_user@test.fr',
      passwordHash: hashPassword('azerty123')
    });
    const fakeAuth = Buffer.from('test_user:azerty123').toString("base64");

    const req = {
      headers: {
        authorization: `Basic ${fakeAuth}`
      }
    };

    const res = {};
    const next = jest.fn();

    await authenticationMiddleware(req, res, next);

    expect(next.mock.calls).toHaveLength(1);
  });
});

// Integration testing

beforeEach(() => users.clear());

describe('areCredentialsValid', () => {
  test('valid credentials', () => {
    users.set('test_user', {
      email: 'test_user@test.fr',
      passwordHash: hashPassword('azerty123')
    });

    const hasValidCredentials = areCredentialsValid('test_user', 'azerty123');

    expect(hasValidCredentials).toBe(true);
  });

  test('invalid credentials', () => {
    users.set('test_user', {
      email: 'test_user@test.fr',
      passwordHash: hashPassword('azerty123')
    });

    const hasValidCredentials = areCredentialsValid('test_user', 'qsdfgh456');

    expect(hasValidCredentials).toBe(false);
  });

  test('user does not exist', () => {
    const result = areCredentialsValid('test_user', 'azerty123');

    expect(result).toBe(false);
  });
});
