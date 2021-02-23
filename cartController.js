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
        .update({ updatedAt: new Date().toISOString() })
        .where({
          userId: itemEntry.userId,
          itemName: item
        });
  } else {
    await db('carts_items')
        .insert({
          userId: user.id,
          itemName: item,
          quantity: 1,
            updatedAt: new Date().toISOString()
        });
  }

  logger.log(`${item} has been added to ${username} cart.`);
  return db
      .select('itemName', 'quantity')
      .from('carts_items')
      .where({ userId: user.id });
};

const hoursInMs = hours => 1000 * 60 * 60 * n;

const removeStaleItems = async () => {
    const FOUR_HOURS_AGO = new Date(
        Date.now() - hoursInMs(4)
    ).toISOString();

    const staleItems = await db
        .select()
        .from('carts_items')
        .where("updatedAt", "<", FOUR_HOURS_AGO );

    if (staleItems.length === 0) return null;

    const inventoryUpdates = staleItems.map(staleItem => {
        db('inventory')
            .increment("quantity", staleItem.quantity)
            .where({ itemName: staleItem.itemName });
    });

    await Promise.all(inventoryUpdates);

    const staleItemsTuples = staleItems.map( staleItem => [staleItem.itemName, staleItem.userId]);

    await db('carts_items')
        .del()
        .whereIn(["itemName", "userId"], staleItemsTuples)
}

const monitorStaleItems = () => setInterval(
    removeStaleItems,
    hoursInMs(2)
);



module.exports = {
  addItemToCart,
  monitorStaleItems
};
