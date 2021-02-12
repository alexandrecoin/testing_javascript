const { logInfo, logError } = require('./logger');
const inventory = new Map();

const addToInventory = (item, quantity) => {
  if (typeof quantity !== 'number') {
    logError(`${item} could not be added.`);
    throw new Error('You must enter a valid number');
  }
  const currentItemNumber = inventory.get(item) || 0;
  const newItemNumber = currentItemNumber + quantity;
  inventory.set(item, newItemNumber);
  logInfo({ item, quantity }, 'items have been added to the inventory.');
  return newItemNumber;
};

const removeFromInventory = (item) => {
  if (!inventory.has(item) || !inventory.get(item) > 0) {
    const err = new Error(`${item} is unavailable.`);
    err.code = 404;
    throw err;
  }
  inventory.set(item, inventory.get(item) - 1);
};

const getInventory = () => {
  const contentArray = Array.from(inventory.entries());
  const contents = contentArray.reduce((contents, [name, quantity]) => {
    return { ...contents, [name]: quantity };
  }, {});
  logInfo({ contents }, 'inventory items fetched.');
  return { ...contents, generatedAt: new Date() };
};

module.exports = {
  inventory,
  addToInventory,
  removeFromInventory,
  getInventory,
};
