const express = require("express");
const app = express();

let carts = new Map();

function resetState() {
    carts = new Map();
}

app.get('/carts/:username/items', (req, res) => {
    const userCart = carts.get(req.params.username);
    userCart ? res.status(200).json(userCart) : res.status(404).json({ err: 'Cart not found' });
});

app.post('/carts/:username/items/:item', (req, res) => {
    const { username, item } = req.params;
    const newItems = (carts.get(username) || []).concat(item);
    carts.set(username, newItems);
    res.status(201).json(newItems);
});


const port = 3000;
const server = app.listen(port);

module.exports = {
    server,
    resetState
};
