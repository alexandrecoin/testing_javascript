const express = require("express");
const app = express();

const { addItemToCart, carts } = require('./cartController');
const { inventory } = require('./inventoryController');

app.get('/carts/:username/items', (req, res) => {
    const userCart = carts.get(req.params.username);
    userCart ? res.status(200).json(userCart) : res.status(404).json({ err: 'Cart not found' });
});

app.post('/carts/:username/items/:item', (req, res) => {
    try {
        const { username, item } = req.params;
        const newItems = addItemToCart(username, item);
        res.status(201).json(newItems);
    } catch (err) {
        res.status(err.code).json(err.message);
    }
});

app.delete('/carts/:username/items/:item', (req, res) => {
    const { username, item } = req.params;

    if (!carts.has(username) || !carts.get(username).includes(item)) {
        return res.status(404).json({ err: "An error has occurred" });
    }

    const newItems = ([carts.get(username)]).filter(i => i !== item);
    inventory.set(item, (inventory.get(item) + 1));
    carts.set(username, newItems);
    res.status(200).json({ message: `${item} deleted` });
});

module.exports = {
    app,
};
