// <--- VARIABLES --->

const SEARCH_INPUT = $('.searchInput');
const SEARCH_BUTTON = $('.searchButton');
const NUTRI_DIV = $('.nutri');
const ITEM_DIV = $('<div>').addClass('ITEM_DIV');
const MEAL_DIV = $('.meal');
const DAILY_DIV = $('.daily');
const WEEKLY_DIV = $('.weekly');
let FOOD_ITEMS = JSON.parse(localStorage.getItem('food')) || [];
let MEAL_FOODS_ARR = [];
let DAILY_FOODS_ARR = [];
let WEEKLY_FOODS_ARR = [];

// <--- FUNCTIONS --->

function getRandomArrIndex(array) {
    let index = Math.floor(Math.random() * array.length);
    return array[index]
}

function copyAppend(cloneItem, targetDiv) {
    targetDiv.append(cloneItem.clone());
}

function renderCurrentNutri(searchItem) {
    ITEM_DIV.empty();
    let CURRENT_FOODS = [];
    CURRENT_FOODS.push(currentFoodObj);
    CURRENT_FOODS.forEach(foodItem => {
        let foodNameDiv = $("<h3>").text(searchItem);
        ITEM_DIV.append(foodNameDiv);
        let caloriesDiv = $("<p>").text(" - Calories (kcal): " + foodItem.calories);
        ITEM_DIV.append(caloriesDiv);
        let proteinDiv = $("<p>").text(" - Protein (g): " + foodItem.protein);
        proteinDiv.attr("ID", "protein");
        ITEM_DIV.append(proteinDiv);
        let fatDiv = $("<p>").text(" - Fat (g): " + foodItem.fat);
        fatDiv.attr("ID", "fats");
        ITEM_DIV.append(fatDiv);
        let carbDiv = $("<p>").text(" - Carbs (g): " + foodItem.carb);
        carbDiv.attr("ID", "carbs");
        ITEM_DIV.append(carbDiv);
        NUTRI_DIV.append(ITEM_DIV);
    })
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
    $.ajax({
        method: 'GET',
        url: 'https://api.calorieninjas.com/v1/nutrition?query=' + searchedFood,
        headers: { 'X-Api-Key': '3qj9IFJLBpOh3lZfWZf3eg==rs8WPl0J1Oz9a9q2' },
        contentType: 'application/json'
    }).
    then(function(a) {
        currentFoodObj = {
            calories: a.items[0].calories,
            protein: a.items[0].protein_g,
            fat: a.items[0].fat_total_g,
            carb: a.items[0].carbohydrates_total_g
        }
        renderCurrentNutri(searchedFood);
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
    MEAL_FOODS_ARR.push(currentFoodObj);
    // console.log(MEAL_FOODS);
})

MEAL_DIV.on('click', function() {
    copyAppend($(this), DAILY_DIV)
        // DAILY_FOODS.push(CURRENT_FOOD_ITEM);
    DAILY_FOODS_ARR.push(MEAL_FOODS_ARR);
    // DAILY FOODS IS A MULTIDIMENSIONAL ARRAY.
    // console.log(DAILY_FOODS);
    // MAKE BELOW INTO A FUNCTION! AS IT IS USED TWICE.
    let calorieSum = 0;
    let proteinSum = 0;
    let fatSum = 0;
    let carbSum = 0;
    MEAL_FOODS_ARR.forEach(foodItem => {
        calorieSum += foodItem.calories;
        proteinSum += foodItem.protein;
        fatSum += foodItem.fat;
        carbSum += foodItem.carb;
    })

    const tempString = `cal: ${calorieSum}, pro: ${proteinSum}, fat: ${fatSum}, carb: ${carbSum}`
    alert(tempString)
})

DAILY_DIV.on('click', function() {
    copyAppend($(this), WEEKLY_DIV)
    let calorieSum = 0;
    let proteinSum = 0;
    let fatSum = 0;
    let carbSum = 0;
    // DAILY FOODS IS A MULTIDIMENSIONAL ARRAY. USE A FLATTEN TOOL HERE BUT CAN ALSO USE A NESTED FORLOOP INSTEAD
    let DAILY_FOODS_FLAT = DAILY_FOODS_ARR.flat();
    DAILY_FOODS_FLAT.forEach(foodItem => {
        // console.log(foodItem);
        calorieSum += foodItem.calories;
        proteinSum += foodItem.protein;
        fatSum += foodItem.fat;
        carbSum += foodItem.carb;
    })
    const tempDailyString = `cal: ${calorieSum}, pro: ${proteinSum}, fat: ${fatSum}, carb: ${carbSum}`
    alert(tempDailyString)
})