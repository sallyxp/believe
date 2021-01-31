// <--- VARIABLES --->

const SEARCH_INPUT = $('.searchInput');
const SEARCH_BUTTON = $('.searchButton');
const NUTRI_DIV = $('.nutri');
const ITEM_DIV = $('<div>').addClass('ITEM_DIV');
const MEAL_DIV = $('.meal');
const DAILY_DIV = $('.daily');
const WEEKLY_DIV = $('.weekly');
let FOOD_ITEMS = JSON.parse(localStorage.getItem('food')) || [];

// <--- FUNCTIONS --->

function getRandomArrIndex(array) {
    let index = Math.floor(Math.random() * array.length);
    return array[index]
}

function copyAppend(cloneItem, targetDiv) {
    targetDiv.append(cloneItem.clone());
}

// <--- MAIN --->

function getInspiration() {
    $.ajax({
        method: 'GET',
        url: 'https://type.fit/api/quotes',
    }).then(function(a1) {
        const data = JSON.parse(a1);
        let randomQuote = getRandomArrIndex(data).text;
        $(".quote").html("<h2>" + '"' + randomQuote + '"' + "</h2>");
    })
}

function getNutrition(searchedFood) {
    ITEM_DIV.empty()
    $.ajax({
        method: 'GET',
        url: 'https://api.calorieninjas.com/v1/nutrition?query=' + searchedFood,
        headers: { 'X-Api-Key': '3qj9IFJLBpOh3lZfWZf3eg==rs8WPl0J1Oz9a9q2' },
        contentType: 'application/json'
    }).
    then(function(a) {
        for (var i = 0; i < a.items.length; i++) {
            let foodNameDiv = $("<h3>").text(searchedFood);
            ITEM_DIV.append(foodNameDiv);
            let caloriesDiv = $("<p>").text(" - Calories (kcal): " + a.items[i].calories);
            ITEM_DIV.append(caloriesDiv);
            let proteinDiv = $("<p>").text(" - Protein (g): " + a.items[i].protein_g);
            proteinDiv.attr("ID", "protein");
            ITEM_DIV.append(proteinDiv);
            let fatDiv = $("<p>").text(" - Fat (g): " + a.items[i].fat_total_g);
            fatDiv.attr("ID", "fats");
            ITEM_DIV.append(fatDiv);
            let carbDiv = $("<p>").text(" - Carbs (g): " + a.items[i].carbohydrates_total_g);
            carbDiv.attr("ID", "carbs");
            ITEM_DIV.append(carbDiv);
            NUTRI_DIV.append(ITEM_DIV);
        }
    })
}

// <--- EVENTLISTENERS --->

SEARCH_BUTTON.on('click', function(event) {
    event.preventDefault();
    const searchItem = SEARCH_INPUT.val();
    if (searchItem === "") {
        alert("You must enter a food item");
        return
    }
    FOOD_ITEMS.push(searchItem);
    localStorage.setItem('food', JSON.stringify(FOOD_ITEMS));
    getNutrition(searchItem);
    getInspiration();
})

ITEM_DIV.on('click', function() {
    copyAppend($(this), MEAL_DIV)
})

MEAL_DIV.on('click', function() {
    copyAppend($(this), DAILY_DIV)
})

DAILY_DIV.on('click', function() {
    copyAppend($(this), WEEKLY_DIV)
})

// NEXT NEED TO FIND A WAY TO TALLY UP CALORIES AND TOTAL THEM FOR EACH CATEGORY