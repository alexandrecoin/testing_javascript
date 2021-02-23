const { addItemToCart, monitorStaleItems } = require('./cartController');
const { db } = require('./dbConnection');
const fs = require('fs');
const { user } = require('./userTestUtils');

describe('addItemToCart', () => {
  beforeEach(() => {
    fs.writeFileSync('/tmp/logs.out', '');
  });

  test('adding unavailable items to the cart', async () => {

    await db('inventory').insert({itemName: 'cheesecake', quantity: 0});

    try {
      await addItemToCart(user.username, 'cheesecake');
    } catch (err) {
      const expectedError = new Error('cheesecake is unavailable');
      expectedError.code = 404;

      expect(expectedError).toEqual(err);
    }

    const finalCartContent = await db
        .select('carts_items.*')
        .from('carts_items')
        .join("users", "users.id", "carts_items.userId")
        .where("users.username", user.username);

    expect(finalCartContent).toEqual([]);
    expect.assertions(2);
  });

  test('adding item above limit in the cart', async () => {

    await db('inventory').insert({itemName: 'cheesecake', quantity: 1});

    await db('carts_items').insert({
      userId: user.id,
      itemName: 'cheesecake',
      quantity: 3
    });

    try {
      await addItemToCart(user.username, 'cheesecake');
    } catch (e) {
      const expectedError = new Error('Max 3 units of one particular item in your cart');
      expectedError.code = 400;

      expect(e).toEqual(expectedError);
    }

    const finalCartContent = await db
        .select('carts_items.itemName', 'carts_items.quantity')
        .from('carts_items')
        .join("users", "users.id", "carts_items.userId")
        .where("users.username", user.username);

    expect(finalCartContent).toEqual([{itemName: 'cheesecake', quantity: 3}]);
    expect.assertions(2);
  });

  test("logging added items", async () => {

    await db("inventory").insert({itemName: "cheesecake", quantity: 1});
    await db("carts_items").insert({
      userId: user.id,
      itemName: "cheesecake",
      quantity: 1
    });

    await addItemToCart(user.username, "cheesecake");

    const logs = fs.readFileSync("/tmp/logs.out", "utf-8");
    expect(logs).toContain("cheesecake has been added to test_user cart");

  });
});

describe('monitorStaleItems',() =>{
  const waitMs = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const hoursInMs = n => 1000 * 60 * 60 * n;

  let timer;

  afterEach(() => {
    if (timer) clearTimeout(timer);
  });

  test("removing stale items", async () => {
      await db("inventory").insert({
      itemName: "cheesecake",
      quantity: 1
    });

    await addItemToCart(user.username, "cheesecake");
    await waitMs(hoursInMs(4));
    timer = monitorStaleItems();
    await waitMs(hoursInMs(2));

    const finalCartContent = await db
        .select()
        .from("carts_items")
        .join("users", "users.id", "carts_items.userId")
        .where("users.username", user.username);

    expect(finalCartContent).toEqual([]);

    const inventoryContent = await db .select("itemName", "quantity")
        .from("inventory");

    expect(inventoryContent).toEqual([
      { itemName: "cheesecake", quantity: 1 }
    ]);
  });
});
