const express = require("express");
const app = express();

let carts = new Map();
let inventory = new Map();

app.get('/carts/:username/items', (req, res) => {
    const userCart = carts.get(req.params.username);
    userCart ? res.status(200).json(userCart) : res.status(404).json({ err: 'Cart not found' });
});

app.post('/carts/:username/items/:item', (req, res) => {
    const { username, item } = req.params;

    if (!inventory.get(item)) {
        res.status(404).json({ err: 'Could not find item in inventory' });
    }

    inventory.set(item, inventory.get(item) - 1);
    const newItems = (carts.get(username) || []).concat(item);
    carts.set(username, newItems);
    res.status(201).json(newItems);
});

module.exports = {
    app,
    inventory,
    carts
};
