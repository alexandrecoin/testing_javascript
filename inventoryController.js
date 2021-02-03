const inventory = new Map();

const addToInventory = (item, n) => {
  if (typeof n !== "number") {
    throw new Error('You must enter a valid number');
  }
  const currentItemNumber = inventory.get(item) || 0;
  const newItemNumber = currentItemNumber + n;
  inventory.set(item, newItemNumber);
  return newItemNumber;
}

module.exports = {
  inventory,
  addToInventory
}