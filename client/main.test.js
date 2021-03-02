const fs = require("fs");
const initialHtml = fs.readFileSync("./index.html");
const { screen, getByText, fireEvent } = require("@testing-library/dom");

beforeEach(() => {
    document.body.innerHTML = initialHtml;
    jest.resetModules();
    require("./main");
    localStorage.clear();
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

    fireEvent.input(itemField, {
        target: { value: "cheesecake" },
        bubbles: true
    });

   expect(screen.getByText("cheesecake is a valid item!")).toBeInTheDocument();
});

test('it persists items between sessions in localStorage', () => {

    const itemField = screen.getByPlaceholderText('Item name');
    fireEvent.input(itemField, {
        target: { value: "cheesecake" },
        bubbles: true
    });

    const quantityField = screen.getByPlaceholderText('Quantity');
    fireEvent.input(quantityField, {
        target: { value: 4 },
        bubbles: true
    });

    const submitButton = screen.getByText("Add to inventory");
    fireEvent.click(submitButton);

    const itemsListBefore = document.getElementById("item-list");
    expect(itemsListBefore.childNodes).toHaveLength(1);
    expect(getByText(itemsListBefore, "cheesecake - Quantity: 4")).toBeInTheDocument();

    document.body.innerHTML = initialHtml;
    jest.resetModules();
    require('./main');

    const itemsListAfter = document.getElementById('item-list');
    expect(itemsListAfter.childNodes).toHaveLength(1);
    expect(getByText(itemsListAfter, "cheesecake - Quantity: 4")).toBeInTheDocument();
});
