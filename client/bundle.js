(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const updateItemList = inventory =>  {
    const inventoryList = window.document.getElementById('item-list');
    const removeItemsButton = window.document.getElementById('remove-button')
    inventoryList.innerHTML = '';

    const isEmpty = isInventoryEmpty(inventory);
    isEmpty ? removeItemsButton.disabled = true : null

    Object.entries(inventory).forEach(([itemName, quantity]) => {
        const listItem = window.document.createElement('li');
        listItem.innerHTML = `${itemName} - Quantity: ${quantity}`;

        quantity === 0 ? listItem.style.visibility = 'hidden' : null
        quantity < 5 ? listItem.className = "almost-soldout" : null

        inventoryList.appendChild(listItem);
    });

    const inventoryContents = JSON.stringify(inventory);
    const paragraph = window.document.createElement('p');
    paragraph.innerHTML = `The inventory has been updated - ${inventoryContents}`;
    window.document.body.appendChild(paragraph);
}

const isInventoryEmpty = inventory => {
    if (Object.keys(inventory).length === 0 && inventory.constructor === Object) return true;
};
const emptyList = () => {
    const inventoryList = window.document.getElementById('item-list');
    inventoryList.innerHTML = '';
    updateItemList({});
}

module.exports = {
    updateItemList,
    emptyList
};

},{}],2:[function(require,module,exports){
const data = { inventory : {} };

const addItem = (itemName, quantity) => {
    const currentQuantity = data.inventory[itemName] || 0;
    data.inventory[itemName] = currentQuantity + quantity;
}

module.exports = { data, addItem };

},{}],3:[function(require,module,exports){
const { addItem, data } = require('./inventoryController');
const { updateItemList } = require('./domController');

addItem('cheesecake', 3);
addItem('apple pie', 8);
addItem('carrot cake', 7);

updateItemList(data.inventory);

},{"./domController":1,"./inventoryController":2}]},{},[3]);
