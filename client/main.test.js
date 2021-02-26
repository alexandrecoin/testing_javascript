const fs = require('fs');
window.document.body.innerHTML = fs.readFileSync('./index.html')
const { incrementCount, data } = require('./main');

describe('incrementCount', () => {
    test('it increments the count', () => {
        // Arrange
        data.count = 0;
        // Act
        incrementCount();
        // Assert
        expect(data.count).toBe(1);
    });
});


