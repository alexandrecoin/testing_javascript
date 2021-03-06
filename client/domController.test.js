const fs = require("fs");
const { updateItemList, handleAddItem, handleItemName, handleUndo } = require('./domController');
const initialHtml = fs.readFileSync("./index.html");
const { screen, getByText } = require('@testing-library/dom')

beforeEach(() => {
    document.body.innerHTML = initialHtml;
    localStorage.clear();
});

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

    test('it renders a button to empty item list', () => {
       expect(screen.getByText('Remove items')).toBeInTheDocument();
    });

    test('button is disabled if items list is empty', () => {
        const inventory = {};
        updateItemList(inventory);
        expect(screen.getByText('Remove items')).toBeDisabled();
    });

    test('updates localStorage with the inventory', () => {
       const inventory = { cheesecake: 2 };

       updateItemList(inventory);

       expect(localStorage.getItem("inventory")).toEqual(JSON.stringify(inventory));
    });
});

// Unreliable test because it only tests the handleAddItem function
describe('handleAddItem', () => {
   test('adding items to the page', () => {
      const event = {
          preventDefault: jest.fn(),
          target: {
              elements: {
                  name: { value: 'cheesecake' },
                  quantity: { value: 4 }
              },
          },
      };

      handleAddItem(event);

      expect(event.preventDefault.mock.calls).toHaveLength(1);

      const itemList = document.getElementById('item-list');
      expect(getByText(itemList, "cheesecake - Quantity 4")).toBeInTheDocument();
   });
});

describe('handleItemName', () => {
    test('check if item is valid', () => {
        const event = {
            preventDefault: jest.fn(),
            target: {
                value: "cheesecake"
            }
        };

        handleItemName(event);

        const result = document.getElementById('error-msg');
        expect(getByText(result, "cheesecake is a valid item")).toBeInTheDocument();
    });
});

describe('tests whith history', () => {

    beforeEach(done => {
        const clearHistory = () => {
            if (history.state === null) {
            window.removeEventListener("popstate", clearHistory);
            return done();
        }
        history.back();
        };
        window.addEventListener("popstate", clearHistory);
        clearHistory();
    });

    beforeEach(() => jest.spyOn(window, "addEventListener"));

    afterEach(() => {
        const popStateEventListeners = window
            .addEventListener
            .mock
            .calls
            .filter(([ eventName ]) => {
                return eventName === "popstate"
            });

        popStateEventListeners.forEach(([ eventName, handlerFn]) => {
            window.removeEventListener(eventName, handlerFn);
        });

        jest.resetAllMocks();
    });


   describe('handleUndo', () => {
      test('going back from a non-initial state', done => {
          window.addEventListener('popstate', () => {
             expect(history.state).toEqual(null);
             done();
          });

          history.pushState({ inventory: { cheesecake: 3 }}, "title");
          handleUndo();
      });
   });
});
