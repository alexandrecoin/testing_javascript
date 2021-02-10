const { inventory } = require('./inventoryController');

const carts = new Map();

const addItemToCart = (username, item) => {
    if (!inventory.get(item)) {
        const err = new Error({ message : 'Could not find item in inventory' });
        err.code = 404;
        throw err;
    }

    inventory.set(item, inventory.get(item) - 1);
    const newItems = (carts.get(username) || []).concat(item);
    carts.set(username, newItems);
    return newItems;
};

module.exports = { addItemToCart, carts };
