const { 
  inventory,
  addToInventory,
  getInventory
} = require('./inventoryController');

beforeEach(() => inventory.set("cheesecake", 0));

describe('#inventoryController', () => {

  describe('addToInventory', () => {
    test('it throws an error for non valid quantity', () => {
      expect(() => addToInventory('cheesecake', "3")).toThrow();
      expect(inventory.get('cheesecake')).toBe(0)
    })
  
    test('it updates the inventory with a valid number', () => {
      expect(() => addToInventory('cheesecake', 1)).not.toThrow();
      expect(inventory.get('cheesecake')).toBe(1);
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
  });
});