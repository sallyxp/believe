var goalInput = $("#my_goal");
var addBtn = $("#add-btn");
var goalList = $("#goal-list");

var goals = [];

renderGoals();

function renderGoals() {
    for (var i = 0; i < goals.length; i++) {
        var goal = goals[i];
    }

    var li = $("<li>");
    li.textContent = goal;
    li.attr("data-index", i);
    var achieveBtn = $("<button>");
    achieveBtn.textContent = "Achieved";
    li.append(achieveBtn);
    goalList.append(li);
}

addBtn.on("click", function (event) {
    event.preventDefault();

    var goalText = goalInput.value.trim();

    if (goalText === "") {
        return;
    }

    goals.push(goalText);
    goalInput.value = "";

    renderGoals();
})

goalList.on("click", function (event) {
    var element = event.target;

    if (element.matches("button") === true) {
        var index = element.parentElement.attr("data-index");
        goals.splice(index, 1);


        renderGoals();
    }
})