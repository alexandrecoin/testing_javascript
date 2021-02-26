let data = { count: 0 };

const incrementCount = () => {
    data.count++;
    window.document.getElementById("count").innerHTML = data.count;
};

const incrementButton = window.document.getElementById("increment-button");
incrementButton.addEventListener("click", incrementCount);

module.exports = { incrementCount, data };
