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

const getInventory = () => {
  const contentArray = Array.from(inventory.entries());
  const contents = contentArray.reduce(
    (contents, [name, quantity]) => {
      return { ...contents, [name]: quantity };
      },
    {} 
  );
  return { ...contents, generatedAt: new Date() };
}

module.exports = {
  inventory,
  addToInventory,
  getInventory
}