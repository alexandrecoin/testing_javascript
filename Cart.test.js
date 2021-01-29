const Cart =  require('./Cart');

const cart = new Cart();
cart.addToCart('cheesecake');

const hasOneItem = cart.items.length === 1;
const hasCheesecake = cart.items[0] === 'cheesecake';

if (hasOneItem && hasCheesecake) {
    console.log('The addToCart function added an item to the cart');
} else {
    const actualCartContent = cart.items.join(', ');

    console.error("The addToCart function didn't do what we expect!");
    console.error(`Here is the actual content of the cart: ${actualCartContent}`);

    throw new Error("Test failed!");
}
