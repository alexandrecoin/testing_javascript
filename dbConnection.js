const db = require('knex')(require('./knexfile').development);

const closeDatabaseConnection = () => db.destroy();

module.exports = { db, closeDatabaseConnection };
