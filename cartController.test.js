const { carts, addItemToCart, deleteItemFromCart } = require('./cartController');
const { inventory } = require('./inventoryController');

afterEach(() => {
    carts.clear();
    inventory.clear();
})

describe('Integration | addItemToCart', () => {
    describe('addItemToCart', () => {
        test('adding unavailable items to the cart', () => {
            inventory.set('cheesecake', 0);
            carts.set('test_user', []);

            try {
                addItemToCart('test_user', 'cheesecake');
            } catch(err) {
                const expectedError = new Error('cheesecake is unavailable.');
                expectedError.code = 404;

                expect(expectedError).toEqual(err);
            }

            expect(carts.get('test_user')).toEqual([]);
            expect.assertions(2);
        });

        test('adding available items to the cart', () => {
            inventory.set('cheesecake', 1);
            carts.set('test_user', []);

            addItemToCart('test_user', 'cheesecake');
            expect(carts.get('test_user')).toEqual(['cheesecake']);
            expect(inventory.get('cheesecake')).toEqual(0);
        });
    });

    describe('deleteItemFromCart', () => {
        test('removing item from cart when no item', () => {
            carts.set('test_user', []);
            try {
                deleteItemFromCart('test_user', 'cheesecake');
            } catch(err) {
                const expectedError = new Error({ message: 'An error has occured' });
                expectedError.status = 404;

                expect(expectedError).toEqual(err);
            }

            expect(carts.get('test_user')).toEqual([]);
        });

        test('removing item from cart when item is available', () => {
            carts.set('test_user', 'cheesecake');
            inventory.set('cheesecake', 0);
            deleteItemFromCart('test_user', 'cheesecake');
            expect(carts.get('test_user')).toEqual([]);
        });
    });
});
