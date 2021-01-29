class Cart {
    constructor() {
        this.items = [];
    }

    addToCart(item) {
        this.items.push(item);
    }

    removeFromCart(item) {
        for (let i = 0; i < this.items.length; i++) {
            const currentItem = this.items[i];
            if (currentItem === item) {
                this.items.splice(i, 1);
            }
        }
    }

    increaseItemQuantity(item) {
        const indexOfExistingItem = this.items.indexOf(item);
        if (indexOfExistingItem >= 0) {
            this.items.push(item);
        }
    }
}

module.exports = Cart;
