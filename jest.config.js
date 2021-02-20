module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: [
      "<rootDir>/truncateTables.js",
      "<rootDir>/seedUser.js",
      "<rootDir>/disconnectFromDb.js"
  ],
  globalSetup: "<rootDir>/migrateDatabases.js",
};
