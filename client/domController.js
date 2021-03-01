const { addItem, data } = require('./inventoryController');

const validItems = ['cheesecake', 'apple pie', 'carrot cake'];
const handleItemName = event => {
    const itemName = event.target.value;

    const errorMsg = window.document.getElementById('error-msg');

    if (itemName === '') {
        errorMsg.innerHTML = '';
    }
    else if (!validItems.includes(itemName)) {
        errorMsg.innerHTML = `${itemName} is not a valid item.`;
    }
    else {
        errorMsg.innerHTML =  `${itemName} is a valid item.`
    }
}

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

const handleAddItem = event => {
    event.preventDefault();

    const { name, quantity } = event.target.elements;
    addItem(name.value, parseInt(quantity.value, 10));

    updateItemList(data.inventory);
};

module.exports = {
    updateItemList,
    handleAddItem,
    handleItemName
};
