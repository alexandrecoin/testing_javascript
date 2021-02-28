const fs = require("fs");
const { updateItemList } = require('./domController');
const initialHtml = fs.readFileSync("./index.html");
const { screen, getByText } = require('@testing-library/dom')

beforeEach(() => document.body.innerHTML = initialHtml);

describe('updateItemList', () => {
    test('it renders a list of items', () => {
       const inventory = {
           cheesecake: 5,
           "apple pie": 3,
        };
        updateItemList(inventory);
        const itemList = document.getElementById('item-list');
        expect(itemList.childNodes).toHaveLength(2);

        expect(getByText(itemList, "cheesecake - Quantity: 5", { selector: "li" })).toBeInTheDocument();
        expect(getByText(itemList, "apple pie - Quantity: 3")).toBeInTheDocument();
    });


    test("adding a paragraph indicating what was the update", () => {
        const inventory = {
            cheesecake: 5,
            "apple pie": 2
        };

        updateItemList(inventory);

        expect( screen.getByText(
            `The inventory has been updated - ${JSON.stringify(inventory)}` )
        ).toBeTruthy();
    });

    test('it highlights in red items whose quantity is less than 5', () => {
        const inventory = {
            cheesecake: 5,
            "apple pie": 2
        };

        updateItemList(inventory);

        expect(screen.getByText("apple pie - Quantity: 2")).toHaveStyle({color: 'red'})
    });

    test('it hides items whose stock is equal to 0', () => {
        const inventory = {
            cheesecake: 5,
            "apple pie": 0
        };

        updateItemList(inventory);

        expect(screen.getByText("apple pie - Quantity: 0")).toBeInTheDocument();
        expect(screen.getByText("apple pie - Quantity: 0")).toHaveStyle({
            visibility: 'hidden'
        });
    });
});
