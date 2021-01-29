const { server, resetState } = require('./server');
const request = require('supertest');


beforeEach(() => resetState())
afterAll(() => server.close());

// E2E tests for API
describe('#Server', () => {

  test("Getting items from a non-existing cart", async () => {
    const getItemsResponse = await request(server).get('/carts/test_user/items')
    expect(getItemsResponse.status).toEqual(404);
  })
  
  test("Getting items from an existing cart", async () => {
    const addItemResponse = await request(server).post(`/carts/test_user/items/cheesecake`);
    expect(addItemResponse.status).toEqual(201);
    expect(addItemResponse.body).toEqual(['cheesecake']);
  
    const getItemsResponse = await request(server).get('/carts/test_user/items');
    expect(getItemsResponse.status).toEqual(200);
    expect(getItemsResponse.body).toEqual(['cheesecake']);
  });
});
