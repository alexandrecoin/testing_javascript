const assert = require('assert');
const Cart =  require('./Cart');

const cart = new Cart();
cart.addToCart('cheesecake');

assert.deepStrictEqual(cart.items, ['cheesecake']);

console.log('The addToCart function added an item to the cart');

