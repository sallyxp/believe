// <--- VARIABLES --->

const SEARCH_INPUT = $('.searchInput');
const SEARCH_BUTTON = $('.searchButton');
const NUTRI_DIV = $('.nutri');
const ITEM_DIV = $('<div>').addClass('ITEM_DIV');
const MEAL_DIV = $('.meal');
const DAILY_DIV = $('.daily');
const WEEKLY_DIV = $('.weekly');
let FOOD_ITEMS = JSON.parse(localStorage.getItem('food')) || [];

let CURRENT_FOOD_ITEM = {};
const MEAL_FOODS = [];
const DAILY_FOODS = [];
const WEEKLY_FOODS = [];

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
            const {
                calories,
                protein_g,
                fat_total_g,
                carbohydrates_total_g
            } = a.items[i];
            CURRENT_FOOD_ITEM = {
                calories,
                protein_g,
                fat_total_g,
                carbohydrates_total_g
            }
            let caloriesDiv = $("<p>").text(" - Calories (kcal): " + calories);
            ITEM_DIV.append(caloriesDiv);
            let proteinDiv = $("<p>").text(" - Protein (g): " + protein_g);
            proteinDiv.attr("ID", "protein");
            ITEM_DIV.append(proteinDiv);
            let fatDiv = $("<p>").text(" - Fat (g): " + fat_total_g);
            fatDiv.attr("ID", "fats");
            ITEM_DIV.append(fatDiv);
            let carbDiv = $("<p>").text(" - Carbs (g): " + carbohydrates_total_g);
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

    MEAL_FOODS.push(CURRENT_FOOD_ITEM);
    let calorieSum = 0;
    let proteinSum = 0;
    let fatSum = 0;
    let carbSum = 0;
    MEAL_FOODS.forEach(foodItem => {
        calorieSum += foodItem.calories;
        proteinSum += foodItem.protein_g;
        fatSum += foodItem.fat_total_g;
        carbSum += foodItem.carbohydrates_total_g;
    })

    const tempString = `cal: ${calorieSum}, pro: ${proteinSum}, fat: ${fatSum}, carb: ${carbSum}`
    alert(tempString)
})

MEAL_DIV.on('click', function() {
    copyAppend($(this), DAILY_DIV)
})

DAILY_DIV.on('click', function() {
    copyAppend($(this), WEEKLY_DIV)
})

// NEXT NEED TO FIND A WAY TO TALLY UP CALORIES AND TOTAL THEM FOR EACH CATEGORY