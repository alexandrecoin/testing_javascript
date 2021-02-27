const fs = require("fs");
const { updateItemList } = require('./domController');
const initialHtml = fs.readFileSync("./index.html");

beforeEach(() => document.body.innerHTML = initialHtml);

describe('updateItemList', () => {
    test('it renders a list of items', () => {
       const inventory = {
           "cheesecake": 5,
           "apple pie": 3,
        };
        updateItemList(inventory);
        const itemList = document.getElementById('item-list');
        expect(itemList.childNodes).toHaveLength(2);

        // The `childNodes` property has a `length`, but it's NOT an Array
        const nodesText = Array.from(itemList.childNodes).map(node => node.innerHTML );

        expect(nodesText).toContain("cheesecake - Quantity: 5");
        expect(nodesText).toContain("apple pie - Quantity: 3");
    });

    // test('it renders a paragraph indicating what was the last inventory update', () => {
    //     const inventory = {
    //        "cheesecake": 5,
    //        "apple pie": 3,
    //     };
    //     updateItemList(inventory);
    //     const paragraphs = Array.from(document.querySelector('p'));
    //     const updateParagraphs = paragraphs.filter(paragraph => {
    //         return paragraph.includes('The inventory has been updated');
    //     });
    //
    //     expect(updateParagraphs).toHaveLength(1);
    //     expect(updateParagraphs[0].innerHTML).toBe(`The inventory has been updated - ${JSON.stringify(inventory)}`);
    // });
});
