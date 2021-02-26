let data = { count: 0 };

const incrementCount = () => {
    console.log(data.count)
    data.count++;
    window.document.getElementById("count").innerHTML = data.count;
};

const incrementButton = window.document.getElementById("increment-button");
incrementButton.addEventListener("click", incrementCount);
