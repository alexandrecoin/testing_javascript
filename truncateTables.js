const { db } = require('./dbConnection');
const TABLES_TO_TRUNCATE = ['inventory', 'carts_items', 'users'];

beforeEach(() => {
    return Promise.all(TABLES_TO_TRUNCATE.map((t) => {
        return db(t).truncate()
    }));
})
