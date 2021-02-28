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

        expect(getByText(itemList, "cheesecake - Quantity: 5", { selector: "li" })).toBeTruthy();
        expect(getByText(itemList, "apple pie - Quantity: 3")).toBeTruthy();
    });


    test("adding a paragraph indicating what was the update", () => {
        const inventory = {
            cheesecake: 5,
            "apple pie": 2
        };

        updateItemList(inventory);

        expect( screen.getByText(
            `The inventory has been updated - ${JSON.stringify(inventory)}` )
        ).toBeTruthy(); });
});
