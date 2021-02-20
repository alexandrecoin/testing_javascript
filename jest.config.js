module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: [
      "<rootDir>/truncateTables.js",
      "<rootDir>/seedUser.js"
  ],
  globalSetup: "<rootDir>/migrateDatabases.js",
};
