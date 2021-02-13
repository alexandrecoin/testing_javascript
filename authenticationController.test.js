const { TestScheduler } = require('jest');
const crypto = require('crypto');
const { hashPassword } = require('./authenticationController');

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