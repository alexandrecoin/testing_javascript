const updateItemList = inventory =>  {
    const inventoryList = window.document.getElementById('item-list');
    inventoryList.innerHTML = '';

    Object.entries(inventory).forEach(([itemName, quantity]) => {
        const listItem = window.document.createElement('li');
        listItem.innerHTML = `${itemName} - Quantity: ${quantity}`;

        quantity < 5 ? listItem.className = "almost-soldout" : null

        inventoryList.appendChild(listItem);
    });

    const inventoryContents = JSON.stringify(inventory);
    const paragraph = window.document.createElement('p');
    paragraph.innerHTML = `The inventory has been updated - ${inventoryContents}`;
    window.document.body.appendChild(paragraph);
}

module.exports = { updateItemList };
