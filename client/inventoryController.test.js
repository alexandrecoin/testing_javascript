const { data, addItem } = require('./inventoryController');

describe('Unit | inventoryController', () => {
   describe('addItem', () => {

       beforeEach(() => data.inventory = {});

       test('it adds given quantity to an existing item in the inventory', () => {
          data.inventory.cheesecake = 1;
          addItem('cheesecake', 1);
          expect(data.inventory.cheesecake).toBe(2);
       });

       test('it adds new item to the inventory', () => {
           addItem('cheesecake', 1);
           expect(data.inventory.cheesecake).toBe(1);
       });
   });
});
