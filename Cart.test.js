const Cart =  require('./Cart');

test('The addToCart function can add an item to the cart', () => {
    const cart = new Cart();
    cart.addToCart('cheesecake');
    expect(cart.items).toEqual(['cheesecake']);
});

test('The removeFromCart function can remove an item to the cart', () => {
    const cart = new Cart();
    cart.addToCart('cheesecake');
    cart.removeFromCart('cheesecake');
    expect(cart.items).toEqual([]);
});

test('The increaseItemQuantity adds an already existing item to the cart', () => {
   const cart = new Cart();
   cart.addToCart('cheesecake');
   cart.addToCart('banana');
   cart.increaseItemQuantity('cheesecake');
   expect(cart.items).toEqual(['cheesecake', 'banana', "cheesecake"]);
});
