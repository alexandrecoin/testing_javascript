const { removeFromInventory } = require('./inventoryController');
const { db } = require('./dbConnection');
const logger = require('./logger');

const addItemToCart = async (username, item) => {
  await removeFromInventory(item) ;

  const user = await db
      .select()
      .from('users')
      .where({ username })
      .first();

  if (!user) {
    const userNotFound = new Error('User not found');
    userNotFound.code = 404;
    throw userNotFound;
  }

  const itemEntry = await db
      .select()
      .from('carts_items')
      .where({ userId: user.id, itemName: item })
      .first();

  if (itemEntry && itemEntry.quantity + 1 > 3) {
    const limitError = new Error("Max 3 units of one particular item in your cart");
    limitError.code = 400;
    throw limitError;
  }

  if (itemEntry) {
    await db('carts_items')
        .increment('quantity')
        .where({
          userId: itemEntry.userId,
          itemName: item
        });
  } else {
    await db('cart_items')
        .insert({
          userId: user.id,
          itemName: item,
          quantity: 1
        });
  }

  logger.log(`${item} has been added to ${username} cart.`);
  return db
      .select('itemName', 'quantity')
      .from('carts_items')
      .where({ userId: user.id });
};

module.exports = {
  addItemToCart,
};
