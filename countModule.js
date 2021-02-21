const fs = require('fs');

const filePath = './state.txt';

const getState = () => parseInt(fs.readFileSync(filePath), 10);
const setState = n => fs.writeFileSync(filepath, n);
const increment = () => fs.writeFileSync(filepath, getState() + 1);
const decrement = () => fs.writeFileSync(filepath, getState() - 1);

module.exports = { getState, setState, increment, decrement };
