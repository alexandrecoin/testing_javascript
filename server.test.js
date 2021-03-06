const { db } = require("./dbConnection");
const request = require("supertest");
const { app } = require("./server.js");
const { hashPassword } = require("./authenticationController.js");
const { user } = require('./userTestUtils');
const nock = require('nock');

beforeEach(() => nock.cleanAll());

afterEach(() => {
  if (!nock.isDone()) {
    nock.cleanAll();
    throw new Error("Not all mocked endpoints received requests."); }
});

describe('fetch inventory item', () => {
  const eggs = { itemName: 'eggs', quantity: 3};
  const applePie = { itemName: 'apple pie', quantity: 1};

  beforeEach(async() => {
    await db("inventory").insert([eggs, applePie]);
    const { id: eggsId } = await db
        .select()
        .from("inventory")
        .where({ itemName: "eggs" }) .first();
    eggs.id = eggsId;
  });

  test('can fetch an item from the inventory', async () => {
    const fakeApiResponse = {
      title: "FakeAPI",
      href: "example.org",
      results: [{ name: "Omelette du Fromage" }]
    };

    nock("http://recipepuppy.com")
        .get("/api")
        .query({ i: "eggs" })
        .reply(200, fakeApiResponse);

    const result = await request(app)
        .get('/inventory/eggs')
        .expect(200)
        .expect("Content-Type", /json/);

    expect(result.body).toEqual({
      ...eggs,
      info: `Data obtained from ${fakeApiResponse.title} - ${fakeApiResponse.href}`,
      recipes: fakeApiResponse.results
    });
  });
});

describe("add items to a cart", () => {

  test("adding available items", async () => {
    await db("inventory").insert({ itemName: "cheesecake", quantity: 3 });
    const response = await request(app)
        .post("/carts/test_user/items")
        .set("authorization", user.authHeader)
        .send({ item: "cheesecake", quantity: 3 })
        .expect(200)
        .expect("Content-Type", /json/);

    const newItems = [{ itemName: "cheesecake", quantity: 3 }];

    const { quantity: inventoryCheesecakes } = await db
        .select()
        .from("inventory")
        .where({ itemName: "cheesecake" })
        .first();
    expect(inventoryCheesecakes).toEqual(0);

    const finalCartContent = await db
        .select("carts_items.itemName", "carts_items.quantity")
        .from("carts_items")
        .join("users", "users.id", "carts_items.userId")
        .where("users.username", user.username);

    expect(finalCartContent).toEqual(newItems);
  });

  test("adding unavailable items", async () => {
    const response = await request(app)
        .post("/carts/test_user/items")
        .set("authorization", user.authHeader)
        .send({ item: "cheesecake", quantity: 1 })
        .expect(400)
        .expect("Content-Type", /json/);

    expect(response.body).toEqual({
      message: "cheesecake is unavailable"
    });

    const finalCartContent = await db
        .select("carts_items.itemName", "carts_items.quantity")
        .from("carts_items")
        .join("users", "users.id", "carts_items.userId")
        .where("users.username", user.username);
    expect(finalCartContent).toEqual([]);
  });
});

describe("removing items from a cart", () => {

  test("removing existing items", async () => {
    await db("carts_items").insert({
      userId: user.id,
      itemName: "cheesecake",
      quantity: 1
    });

    const response = await request(app)
        .del("/carts/test_user/items/cheesecake")
        .set("authorization", user.authHeader)
        .expect(200)
        .expect("Content-Type", /json/);

    const expectedFinalContent = [{ itemName: "cheesecake", quantity: 0 }];

    expect(response.body).toEqual(expectedFinalContent);

    const finalCartContent = await db
        .select("carts_items.itemName", "carts_items.quantity")
        .from("carts_items")
        .join("users", "users.id", "carts_items.userId")
        .where("users.username", user.username);
    expect(finalCartContent).toEqual(expectedFinalContent);

    const { quantity: inventoryCheesecakes } = await db
        .select()
        .from("inventory")
        .where({ itemName: "cheesecake" })
        .first();
    expect(inventoryCheesecakes).toEqual(1);
  });

  test("removing non-existing items", async () => {
    await db("inventory").insert({
      itemName: "cheesecake",
      quantity: 0
    });

    const response = await request(app)
        .del("/carts/test_user/items/cheesecake")
        .set("authorization", user.authHeader)
        .expect(400)
        .expect("Content-Type", /json/);

    expect(response.body).toEqual({
      message: "cheesecake is not in the cart"
    });

    const { quantity: inventoryCheesecakes } = await db
        .select()
        .from("inventory")
        .where({ itemName: "cheesecake" })
        .first();
    expect(inventoryCheesecakes).toEqual(0);
  });
});

describe("create accounts", () => {
  test("creating a new account", async () => {
    const response = await request(app)
        .put("/users/test_user_second")
        .send({ email: "test_user@test.fr", password: "a_password" })
        .expect(201)
        .expect("Content-Type", /json/);

    expect(response.body).toEqual({
      message: "test_user_second created successfully"
    });

    const savedUser = await db
        .select("email", "passwordHash")
        .from("users")
        .where({ username: "test_user_second" })
        .first();

    expect(savedUser).toEqual({
      email: "test_user@test.fr",
      passwordHash: hashPassword("a_password")
    });
  });

  test("creating a duplicate account", async () => {

    const response = await request(app)
        .put("/users/test_user")
        .send({ email: "test_user@example.org", password: "a_password" })
        .expect(409)
        .expect("Content-Type", /json/);

    expect(response.body).toEqual({
      message: "test_user already exists."
    });
  });
});
