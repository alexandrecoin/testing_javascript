const page = require('./page');

console.log("Initial page body");
console.log(page.window.document.body.innerHTML);

const paragraph = page.window.document.createElement("p");
paragraph.innerHTML = "Look, I'm a new paragraph !";
page.window.document.body.appendChild(paragraph);

console.log("Final page body");
console.log(page.window.document.body.innerHTML);
