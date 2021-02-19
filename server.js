const express = require('express');
const app = express();
const { db } = require('./dbConnection');

const { hashPassword, authenticationMiddleware } = require('./authenticationController');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const { addItemToCart } = require('./cartController');

app.use(async (req, res, next) => {
  if (req.url.startsWith("/carts")) {
    return authenticationMiddleware(req, res, next);
  }
  await next();
});

app.put('/users/:username', async (req, res) => {
  const { username } = req.params;
  const { email, password } = req.body;

  const userAlreadyExists = await db
      .select()
      .from("users")
      .where({ username })
      .first();

  if (userAlreadyExists) {
    return res.status(409).json({ message: `${username} already exists.` });
  }

  await db("users").insert({
    username,
    email,
    passwordHash: hashPassword(password)
  });

  res.status(201).json({ message: `${username} created successfully` });
});

app.post('/carts/:username/items', async (req, res) => {
  const { username } = req.params;
  const { item, quantity } = req.body;
  let newItems;

  for (let i = 0; i < quantity; i++) {
    try {
      newItems = await addItemToCart(username, item);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
  res.status(200).json(newItems);
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

app.delete('/carts/:username/items/:item', async (req, res) => {
  const { username, item } = req.params;

  const user = await db
      .select()
      .from("users")
      .where({ username })
      .first();

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const itemEntry = await db
      .select()
      .from("carts_items")
      .where({ userId: user.id, itemName: item })
      .first();

  if (!itemEntry || itemEntry.quantity === 0) {
    return res.status(400).json({ message: `${item} is not in the cart` });
  }

  await db("carts_items")
      .decrement("quantity")
      .where({ userId: user.id, itemName: item });

  const inventoryEntry = await db
      .select()
      .from("inventory")
      .where({ itemName: item })
      .first();

  if (inventoryEntry) {
    await db("inventory")
        .increment("quantity")
        .where({ userId: itemEntry.userId, itemName: item });
  } else {
    await db("inventory").insert({ itemName: item, quantity: 1 });
  }

  const responseBody = await db
      .select("itemName", "quantity")
      .from("carts_items")
      .where({ userId: user.id });

  res.status(200).send(responseBody);
});

module.exports = {
  app,
};
