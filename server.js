const express = require('express');
const app = express();

const { users, hashPassword, authenticationMiddleware } = require('./authenticationController');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const {
  getItemsFromCart,
  addItemToCart,
  deleteItemFromCart,
} = require('./cartController');

app.use(async (req, res, next) => {
  if (req.url.startsWith("/carts")) {
    return authenticationMiddleware(req, res, next);
  }
  await next();
});

app.get('/carts/:username/items', (req, res) => {
  const userCart = getItemsFromCart(req.params.username);
  userCart
    ? res.status(200).json(userCart)
    : res.status(404).json({ err: 'Cart not found' });
});

app.put('/users/:username', (req, res) => {
  const { username } = req.params;
  const { email, password } = req.body;
  const userAlreadyExists = users.has(username);

  if (userAlreadyExists) {
    return res.status(409).json({ message: `${username} already exists.` });
  }

  users.set(username, { email, passwordHash: hashPassword(password) });

  res.status(201).json({ message: 'User created successfully' });
});

app.post('/carts/:username/items', (req, res) => {
  const { username } = req.params;
  const { item, quantity } = req.body;

  for (let i = 0; i < quantity; i++) {
    try {
      addItemToCart(username, item);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
  res.status(200).json({ message: 'Items have been added successfully' });
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
  try {
    const { username, item } = req.params;
    deleteItemFromCart(username, item);
    res.status(200).json({ message: `${item} deleted` });
  } catch (e) {
    res.status(e.status).json(e.message);
  }
});

module.exports = {
  app,
};
