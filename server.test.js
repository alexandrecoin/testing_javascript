const { app } = require('./server');
const { carts } = require('./cartController');
const { inventory } = require('./inventoryController');
const request = require('supertest');
const { users, hashPassword } = require('./authenticationController');

beforeEach(() => {
  users.clear();
  carts.clear();
  inventory.set('cheesecake', 1);
});

// E2E tests for API
describe('#Server', () => {
  test('Getting items from a non-existing cart', async () => {
    const getItemsResponse = await request(app).get('/carts/test_user/items');
    expect(getItemsResponse.status).toEqual(404);
  });

  test('Getting items from an existing cart', async () => {
    inventory.set('cheesecake', 1);
    const addItemResponse = await request(app).post(
      `/carts/test_user/items/cheesecake`
    );
    expect(addItemResponse.status).toEqual(201);
    expect(addItemResponse.body).toEqual(['cheesecake']);
    expect(inventory.get('cheesecake')).toBe(0);

    const getItemsResponse = await request(app).get('/carts/test_user/items');
    expect(getItemsResponse.status).toEqual(200);
    expect(getItemsResponse.body).toEqual(['cheesecake']);
  });

  test('Getting items from an empty inventory', async () => {
    inventory.set('cheesecake', 0);
    const addItemResponse = await request(app).post(
      `/carts/test_user/items/cheesecake`
    );
    expect(addItemResponse.status).toEqual(404);
  });
});

describe('create accounts', () => {
  test('creating a new account', async () => {
    const response = await request(app)
      .put('/users/test_user')
      .send({ email: 'test_user@test.fr', password: 'azerty123' })
      .expect(201);

    expect(response.body).toEqual({ message: 'User created successfully' });
    expect(users.get('test_user')).toEqual({
      email: 'test_user@test.fr',
      passwordHash: hashPassword('azerty123'),
    });
  });

  test('creating an already existing user', async () => {
    users.set('test_user', {
      email: 'test_user@test.fr',
      passwordHash: hashPassword('azerty123')
    })
    const response = await request(app)
    .put('/users/test_user')
    .send({ email: 'test_user@test.fr'})
    .expect(409)

    expect(response.body).toEqual({ message: 'test_user already exists.'});
  });
});

describe('addItems', () => {
  test('adding available items', async () => {
    inventory.set('cheesecake', 3);
    const response = await request(app)
      .post('/carts/test_user/items')
      .send({
        item: 'cheesecake',
        quantity: 3,
      })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(inventory.get('cheesecake')).toBe(0);
    expect(carts.get('test_user')).toEqual([
      'cheesecake',
      'cheesecake',
      'cheesecake',
    ]);
  });

  test('adding unavailable items', async () => {
    inventory.set('cheesecake', 2);
    const response = await request(app).post('/carts/test_user/items').send({
      item: 'cheesecake',
      quantity: 3,
    });
    expect(response.status).toBe(400);
  });
});

describe('addItem', () => {
  test('correct response', async () => {
    const addItemResponse = await request(app).post(
      '/carts/test_user/items/cheesecake'
    );
    expect(addItemResponse.status).toBe(201);
    expect(addItemResponse.body).toEqual(['cheesecake']);
  });
  test('soldout items', async () => {
    inventory.set('cheesecake', 0);
    const failedAddItem = await request(app).post(
      '/carts/test_user/items/cheesecake'
    );
    expect(failedAddItem.status).toBe(404);
  });

  test('inventory update', async () => {
    await request(app).post('/carts/test_user/items/cheesecake');
    expect(inventory.get('cheesecake')).toBe(0);
  });

  test('cart update', async () => {
    await request(app).post('/carts/test_user/items/cheesecake');
    expect(carts.get('test_user')).toEqual(['cheesecake']);
  });
});

describe('deleteItem', () => {
  test('When item is in cart', async () => {
    carts.set('test_user', 'cheesecake');
    const response = await request(app).delete(
      '/carts/test_user/items/cheesecake'
    );
    expect(response.status).toEqual(200);
    expect(carts.get('test_user')).toEqual([]);
  });

  test('When user cart is empty', async () => {
    const response = await request(app).delete(
      '/carts/test_user/items/cheesecake'
    );
    expect(response.status).toEqual(404);
  });
});
