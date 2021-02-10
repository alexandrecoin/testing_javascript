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

const deleteItemFromCart = (username, item) => {
    if (!carts.has(username) || !carts.get(username).includes(item)) {
        const err = new Error({ message: 'An error has occured' });
        err.status = 404;
        throw err;
    }

    const newItems = ([carts.get(username)]).filter(i => i !== item);
    inventory.set(item, (inventory.get(item) + 1));
    carts.set(username, newItems);
};

module.exports = {
    addItemToCart,
    deleteItemFromCart,
    carts
};
