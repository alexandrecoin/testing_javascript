const assert = require('assert');
const Cart =  require('./Cart');

const cart = new Cart();
cart.addToCart('cheesecake');
cart.removeFromCart('cheesecake');

assert.deepStrictEqual(cart.items, []);

console.log('The addToCart function added an item to the cart');
console.log('The removeFromCart function removed an item to the cart');

