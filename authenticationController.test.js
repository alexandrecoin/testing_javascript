const crypto = require('crypto');
const { hashPassword, areCredentialsValid, users } = require('./authenticationController');

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

// Integration testing : Interaction with DB

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
