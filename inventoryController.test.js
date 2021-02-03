const { 
  inventory,
  addToInventory,
  getInventory
} = require('./inventoryController');
const logger = require('./logger');

beforeAll(() => jest.spyOn(logger, "logInfo"));
beforeEach(() => { 
  inventory.clear();
  jest.clearAllMocks()
});

describe('#inventoryController', () => {

  describe('addToInventory', () => {
    test('it throws an error for non valid quantity', () => {
      expect(() => addToInventory('cheesecake', "3")).toThrow();
    })
  
    test('it updates the inventory with a valid number', () => {
      expect(() => addToInventory('cheesecake', 1)).not.toThrow();
      expect(inventory.get('cheesecake')).toBe(1);
    });

    test('it logs the item and quantity added', () => {
      addToInventory('cheesecake', 2);

      expect(logger.logInfo.mock.calls).toHaveLength(1);
      const [firstArg, secondeArg] = logger.logInfo.mock.calls[0];

      expect(firstArg).toEqual({ "item": "cheesecake", "quantity": 2 });
      expect(secondeArg).toEqual("items have been added to the inventory.");
    });
  });

  describe('getInventory', () => {
    test('it returns an object with values from the inventory', () => {
      inventory
        .set("cheesecake", 1)
        .set("macarroon", 3)
        .set("croissant", 3)
        .set("eclaire", 7);
      const result = getInventory();
  
      expect(result).toEqual({
        cheesecake: 1,
        macarroon: 3,
        croissant: 3,
        eclaire: 7,
        generatedAt: expect.any(Date)
      })
    });

    test('the generatedAt date is in the past', () => {
      const result = getInventory();
      const currentTime = Date.now() + 1;
      const isPastTimeStamp = result.generatedAt.getTime() < currentTime;
      expect(isPastTimeStamp).toBeBefore(currentTime);
    });

    test('it logs the items fetched', () => {
        inventory.set('cheesecake', 2);
        getInventory();

        expect(logger.logInfo.mock.calls).toHaveLength(1);
        const [firstArg, secondArg] = logger.logInfo.mock.calls[0];
        expect(firstArg).toEqual({ contents: { cheesecake: 2 } });
        expect(secondArg).toEqual("inventory items fetched.");

    });
  });
});