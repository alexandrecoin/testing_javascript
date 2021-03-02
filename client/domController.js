const { addItem, data } = require('./inventoryController');

const validItems = ['cheesecake', 'apple pie', 'carrot cake'];

const checkFormValues = () => {
    const itemName = document.querySelector(`input[name="name"]`).value;
    const quantity = document.querySelector(`input[name="quantity"]`).value;

    const itemNameIsEmpty = itemName === "";
    const itemNameIsInvalid = !validItems.includes(itemName); const quantityIsEmpty = quantity === "";
    const errorMsg = window.document.getElementById("error-msg");

    if (itemNameIsEmpty) {
        errorMsg.innerHTML = "";
    } else if (itemNameIsInvalid) {
        errorMsg.innerHTML = `${itemName} is not a valid item.`; }
    else {
        errorMsg.innerHTML = `${itemName} is valid!`;
    }

    const submitButton = document.querySelector(`button[type="submit"]`);
    submitButton.disabled = itemNameIsEmpty || itemNameIsInvalid || quantityIsEmpty;
}

const updateItemList = inventory =>  {
    const inventoryList = window.document.getElementById('item-list');
    const removeItemsButton = window.document.getElementById('remove-button')
    inventoryList.innerHTML = '';

    const isEmpty = isInventoryEmpty(inventory);
    isEmpty ? removeItemsButton.disabled = true : null

    localStorage.setItem('inventory', JSON.stringify(inventory));

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

    history.pushState({ inventory: { ...data.inventory } }, document.title);

    updateItemList(data.inventory);
};

const handleUndo = () => {
    if (history.state === null) return;
    // Asynchronous operation
    history.back();
}

const handlePopState = () => {
    data.inventory = history.state ? history.state.inventory : {};
    updateItemList(data.inventory);
}

module.exports = {
    updateItemList,
    handleAddItem,
    checkFormValues,
    handleUndo,
    handlePopState
};
