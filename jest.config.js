module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ["<rootDir>/truncateTables.js"],
  globalSetup: "<rootDir>/migrateDatabases.js",
};
