const { app, inventory, carts } = require('./server');
const request = require('supertest');

beforeEach(() => {
  carts.clear();
  inventory.set("cheesecake", 1)
})

// E2E tests for API
describe('#Server', () => {

  test("Getting items from a non-existing cart", async () => {
    const getItemsResponse = await request(app).get('/carts/test_user/items')
    expect(getItemsResponse.status).toEqual(404);
  })
  
  test("Getting items from an existing cart", async () => {
    inventory.set('cheesecake', 1);
    const addItemResponse = await request(app).post(`/carts/test_user/items/cheesecake`);
    expect(addItemResponse.status).toEqual(201);
    expect(addItemResponse.body).toEqual(['cheesecake']);
    expect(inventory.get('cheesecake')).toBe(0)
  
    const getItemsResponse = await request(app).get('/carts/test_user/items');
    expect(getItemsResponse.status).toEqual(200);
    expect(getItemsResponse.body).toEqual(['cheesecake']);
  });

  test("Getting items from an empty inventory", async () => {
    inventory.set('cheesecake', 0)
    const addItemResponse = await request(app).post(`/carts/test_user/items/cheesecake`);
    expect(addItemResponse.status).toEqual(404);
  });
});

  
describe("addItem", () => {

  test("correct response", async () => {
    const addItemResponse = await request(app).post('/carts/test_user/items/cheesecake');
    expect(addItemResponse.status).toBe(201);
    expect(addItemResponse.body).toEqual(["cheesecake"]);
  });
  test("soldout items", async () => { 
    inventory.set("cheesecake", 0);
    const failedAddItem = await request(app).post('/carts/test_user/items/cheesecake'); 
    expect(failedAddItem.status).toBe(404);
  }); 

  test("inventory update", async () => {
    await request(app).post('/carts/test_user/items/cheesecake'); 
    expect(inventory.get("cheesecake")).toBe(0);
  });

  test("cart update", async () => {
    await request(app).post('/carts/test_user/items/cheesecake'); 
    expect(carts.get("test_user")).toEqual(["cheesecake"]);
    });
});

