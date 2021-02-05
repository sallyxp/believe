//Define the variables
var goalInput = document.querySelector("#my_goal");
var addBtn = document.querySelector("#add-btn");
var goalList = document.querySelector("#goal-list");


// Get stored items (goals) from local storage
// OR define new goal
var storedGoals = JSON.parse(localStorage.getItem("goals")) || [];


// Call the function "renderGoals()"; to append goals to list, along with an "Achieved" button
renderGoals(); // List will return empty if local storage contains no values


// Declare the function
function renderGoals() {
    goalList.innerHTML = "";


    // Loop through the list of goals to render a new li for each goal
    for (var i = 0; i < storedGoals.length; i++) {
        var goal = storedGoals[i];

        var li = document.createElement("li");
        li.innerText = goal;
        li.setAttribute("data-index", i);
        li.className = "li-card card blue-grey darken-1 card-content white-text";
        var achieveBtn = document.createElement("button");
        achieveBtn.textContent = "Achieved";
        achieveBtn.className = "achv-btn remove waves-effect waves-light btn m50 y14";
        li.append(achieveBtn);
        goalList.append(li);
    }
}


// Add event listener to "Add Goal" button; to add goal to list
addBtn.addEventListener("click", function (event) {
    event.preventDefault();

    var goalText = goalInput.value.trim();

    if (goalText === "") {
        $('.goal-modal').css('display', 'flex');
        return;
    }

    storedGoals.push(goalText);
    localStorage.setItem("goals", JSON.stringify(storedGoals));
    goalInput.value;

    renderGoals(); // Call function here again because it is a result of the click event
    goalInput.value = "";
})


// Add event listener to "Achieved" button; to remove goal from list
goalList.addEventListener("click", function (event) {
    var element = event.target;

    if (element.matches("button") === true) {
        var index = element.parentElement.getAttribute("data-index");
        storedGoals.splice(index, 1);
        localStorage.setItem("goals", JSON.stringify(storedGoals));

        renderGoals(); // Call function here again because the list item needs to disappear on clicking the button
    }
})

// Goal Modal; event listener
$('.goal-modal-button').on('click', function () {
    $('.goal-modal').css('display', 'none');
})

