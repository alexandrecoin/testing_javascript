const { addToInventory, removeFromInventory } = require('./inventoryController');
const logger = require("./logger");

const carts = new Map();

const getItemsFromCart = username => {
  return carts.get(username)
};

const addItemToCart = (username, item) => {
    removeFromInventory(item);
    const newItems = (carts.get(username) || []).concat(item);
    carts.set(username, newItems);
    logger.log(`${item} has been added to ${username} cart.`);
    return newItems;
};

const deleteItemFromCart = (username, item) => {
    if (!carts.has(username) || !carts.get(username).includes(item)) {
        const err = new Error({ message: 'An error has occured' });
        err.status = 404;
        throw err;
    }

    let allItems = carts.get(username);
    if(typeof allItems === 'string') {
        allItems = [allItems]
    }
    const newItems = (allItems).filter(i => i !== item);
    addToInventory(item, newItems.length)
    carts.set(username, newItems);
};

module.exports = {
    carts,
    getItemsFromCart,
    addItemToCart,
    deleteItemFromCart
};
