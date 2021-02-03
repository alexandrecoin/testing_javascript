const { inventory, addToInventory } = require('./inventoryController');

beforeEach(() => inventory.set("cheesecake", 0));

describe('#inventoryController', () => {
  test('it throws an error for non valid quantity', () => {
    expect(() => addToInventory('cheesecake', "3")).toThrow();
    expect(inventory.get('cheesecake')).toBe(0)
  })

  test('it updates the inventory with a valid number', () => {
    expect(() => addToInventory('cheesecake', 1)).not.toThrow();
    expect(inventory.get('cheesecake')).toBe(1);
  });
});