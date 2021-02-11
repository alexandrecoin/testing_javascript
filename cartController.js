const { addToInventory, removeFromInventory } = require('./inventoryController');

const carts = new Map();

const addItemToCart = (username, item) => {
    removeFromInventory(item);
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
    addToInventory(item, newItems.length)
    carts.set(username, newItems);
};

module.exports = {
    carts,
    addItemToCart,
    deleteItemFromCart
};
