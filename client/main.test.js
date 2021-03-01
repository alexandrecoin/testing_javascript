const fs = require("fs");
const initialHtml = fs.readFileSync("./index.html");
const { screen, getByText } = require("@testing-library/dom");

beforeEach(() => {
    document.body.innerHTML = initialHtml;
    jest.resetModules();
    require("./main");
});

/*
Describes more accurately than the test in domController.test
what happens when submitting an item
because it focuses on the whole process and not
just the function. (Integration VS unit test)
 */
test('adding items through the form', () => {
    screen.getByPlaceholderText("Item name").value = 'cheesecake';
    screen.getByPlaceholderText("Quantity").value = 4;

    const event = new Event('submit');
    const form = document.getElementById("add-item-form");

    const itemList = document.getElementById("item-list");
    expect(getByText(itemList, "cheesecake - Quantity: 6")).toBeInTheDocument()
});

test('item name validation', () => {
   const itemField = screen.getByPlaceholderText("Item name");
   itemField..value = 'cheesecake';

   const inputEvent = new Event('input', { bubbles: true });

   itemField.dispatchEvent(inputEvent);

   expect(screen.getByText("cheesecake is a valid item!")).toBeInTheDocument();
});
