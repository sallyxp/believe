var goalInput = document.querySelector("#my_goal");
var addBtn = document.querySelector("#add-btn");
var goalList = document.querySelector("#goal-list");

var goals = [];
localStorage.setItem("goals", JSON.stringify(goals));
var storedGoals = JSON.parse(localStorage.getItem("goals"));

renderGoals();

function renderGoals() {
    for (var i = 0; i < goals.length; i++) {
        var goal = goals[i];

        var li = $("<li>");
        console.log(li);
        li.innerText = goal;
        li.attr("data-index", i);
        var achieveBtn = $("<button>");
        achieveBtn.textContent = "Achieved";
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

    goals.push(goalText);
    goalInput.value;

    renderGoals();
})

goalList.addEventListener("click", function (event) {
    var element = event.target;

    if (element.matches("button") === true) {
        var index = element.parentElement.getAttribute("data-index");
        goals.splice(index, 1);


        renderGoals();
    }
})