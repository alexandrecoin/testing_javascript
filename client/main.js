const { updateItemList } = require('./domController');
const  { data } = require('inventoryController');

const storedInventory = JSON.parse(localStorage.getItem('inventory'));

if (storedInventory) {
    data.inventory = storedInventory;
    updateItemList(data.inventory);
}
