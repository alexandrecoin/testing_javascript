const { updateItemList, handleUndo, handlePopState } = require('./domController');
const  { data } = require('inventoryController');

const storedInventory = JSON.parse(localStorage.getItem('inventory'));

const undoButton = document.getElementById('undo-button');
undoButton.addEventListener("click", handleUndo);

window.addEventListener('popstate', handlePopState)

if (storedInventory) {
    data.inventory = storedInventory;
    updateItemList(data.inventory);
}
