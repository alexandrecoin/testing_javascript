const { handleAddItem, handleItemName } = require("./domController");

const itemInput = document.querySelector(`input[name="name"]`);
itemInput.addEventListener("input", handleItemName);

const form = document.getElementById("add-item-form");
form.addEventListener("submit", handleAddItem);
