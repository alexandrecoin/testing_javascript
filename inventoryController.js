const logger = require('./logger');
const inventory = new Map();

const addToInventory = (item, quantity) => {
  if (typeof quantity !== "number") {
    throw new Error('You must enter a valid number');
  }
  const currentItemNumber = inventory.get(item) || 0;
  const newItemNumber = currentItemNumber + quantity;
  inventory.set(item, newItemNumber);
  logger.logInfo({ item, quantity }, "items have been added to the inventory.");
  return newItemNumber;
}


const getInventory = () => {
  const contentArray = Array.from(inventory.entries());
  const contents = contentArray.reduce((contents, [name, quantity]) => {
    return { ...contents, [name]: quantity }; 
  }, {}
  );
  logger.logInfo({ contents }, "inventory items fetched.");
  return { ...contents, generatedAt: new Date() };
 };

module.exports = {
  inventory,
  addToInventory,
  getInventory
}