const db = require('knex')(require('./knexfile').test);

const closeDatabaseConnection = () => db.destroy();

module.exports = { db, closeDatabaseConnection };
