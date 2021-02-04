var goalInput = document.querySelector("#my_goal");
var addBtn = document.querySelector("#add-btn");
var goalList = document.querySelector("#goal-list");

var storedGoals = JSON.parse(localStorage.getItem("goals")) || [];

renderGoals();

function renderGoals() {
    goalList.innerHTML = "";

    for (var i = 0; i < storedGoals.length; i++) {
        var goal = storedGoals[i];

        var li = document.createElement("li");
        li.innerText = goal;
        console.log(li);
        li.setAttribute("data-index", i);
        var achieveBtn = document.createElement("button");
        achieveBtn.textContent = "Achieved";
        achieveBtn.className = "remove waves-effect waves-light btn m50 y14";
        li.append(achieveBtn);
        goalList.append(li);
    }
}

addBtn.addEventListener("click", function (event) {
    event.preventDefault();

    console.log(goalInput.value);
    var goalText = goalInput.value.trim();

    if (goalText === "") {
        return;
    }

    storedGoals.push(goalText);
    localStorage.setItem("goals", JSON.stringify(storedGoals));
    goalInput.value;

    renderGoals();
    goalInput.value = "";
})

goalList.addEventListener("click", function (event) {
    var element = event.target;

    if (element.matches("button") === true) {
        var index = element.parentElement.getAttribute("data-index");
        storedGoals.splice(index, 1);
        localStorage.setItem("goals", JSON.stringify(storedGoals));

        renderGoals();
    }
})