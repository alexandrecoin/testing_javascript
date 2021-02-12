const { db, closeDatabaseConnection } = require('./dbConnection');
const { createCart, addItem } = require('./Cart');

afterAll(async () => await closeDatabaseConnection());

test('It creates a cart for a given username', async () => {
  await db('carts').truncate();
  await createCart('test_user');
  const result = await db.select('username').from('carts');
  expect(result).toEqual([{ username: 'test_user' }]);
});

test('It adds an item to a cart', async () => {
  await db('carts').truncate();
  await db('carts_items').truncate();

  await createCart('test_user');
  const { id: cartId } = await db
    .select()
    .from('carts')
    .where({ username: 'test_user' });

  await addItem(cartId, 'cheesecake');
  const result = await db.select('itemName').from('carts_items');
  expect(result).toEqual([{ cartId, itemName: 'cheesecake' }]);

  await closeDatabaseConnection();
});
