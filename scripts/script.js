// <--- VARIABLES --->

const SEARCH_INPUT = $('.searchInput');
const SEARCH_BUTTON = $('.searchButton');
const NUTRI_ADD_BUTTON = $('.nutriAdd');
const MEAL_ADD_BUTTON = $('.mealAdd');
const DAY_ADD_BUTTON = $('.dayAdd');
const REMOVE_BUTTON = $('<button>').text("Remove").addClass("remove waves-effect waves-light btn");
const MEAL_TOTAL_BUTTON = $('.mealTotalBtn');
const DAY_TOTAL_BUTTON = $('.dayTotalBtn');
const WEEK_TOTAL_BUTTON = $('.weekTotalBtn');
const NUTRI_DIV = $('.nutri');
const ITEM_DIV = $('<div>');
const MEAL_DIV = $('.meal');
const DAILY_DIV = $('.daily');
const WEEKLY_DIV = $('.weekly');
const MEAL_TOTAL_DIV = $('.mealTotal');
const DAILY_TOTAL_DIV = $('.dailyTotal');
const WEEKLY_TOTAL_DIV = $('.weeklyTotal');
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
    targetDiv.append(cloneItem.clone(true, true));
}

function getTotal(ARRAY, DIV) {
    let calorieSum = 0;
    let proteinSum = 0;
    let fatSum = 0;
    let carbSum = 0;
    ARRAY.forEach(foodItem => {
        calorieSum += foodItem.calories;
        proteinSum += foodItem.protein;
        fatSum += foodItem.fat;
        carbSum += foodItem.carb;
    })
    const String = `Cal: ${calorieSum}, Pro: ${proteinSum}, Fat: ${fatSum}, Carb: ${carbSum}`
    DIV.text(String);
}

function renderCurrentNutri(searchItem) {
    ITEM_DIV.empty();
    let CURRENT_FOODS = [];
    CURRENT_FOODS.push(currentFoodObj);
    ITEM_DIV.append(REMOVE_BUTTON);
    CURRENT_FOODS.forEach(foodItem => {
        let foodNameDiv = $("<p>").text(searchItem);
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
    renderDrop(searchItem);
}

// THIS IS A BETA FUNCTION. Currently when the information displays it always displays the entirety of the nutritional information. With this we could display the nutrition for the nutritional section
// and for the rest of the code we could have it as a drop down so it just looks a little nicer. 

// function renderDrop(searchItem) {
//     let collapsible = $("<ul>").addClass("collapsible");
//     let listItem = $("<li>");
//     let header = $("<div>").addClass("collapsible-header");
//     let expandIcon = $("<i>").addClass("material-icons");
//     expandIcon.text("expand_more");
//     header.html(expandIcon).append(searchItem);
//     let body = $("<div>").addClass("collapsible-body");
//     let span = $("<span>").text("testing");
//     body.append(span);
//     listItem.append(header);
//     listItem.append(body);
//     collapsible.append(listItem);
//     NUTRI_DIV.append(collapsible);
//     $('.collapsible').collapsible();
// }

// <--- MAIN --->

// Modal load
$('.bg-modal').css('display', 'flex');

// Navbar mobile collapse
$('.sidenav').sidenav();

// Modal .onclick close
$('.continue').on('click', function() {
    $('.bg-modal').css('display', 'none');
})

getInspiration();

function getInspiration() {
    $.ajax({
        method: 'GET',
        url: 'https://type.fit/api/quotes',
    }).then(function(a1) {
        const data = JSON.parse(a1);
        let randomQuote = getRandomArrIndex(data).text;
        $("#modal-motd").html('"' + randomQuote + '"');
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
        console.log(a);
        currentFoodObj = {
            food: a.items[0].name,
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

NUTRI_ADD_BUTTON.on('click', function() {
    copyAppend(ITEM_DIV, MEAL_DIV)
    MEAL_FOODS_ARR.push(currentFoodObj);
    console.log(MEAL_FOODS_ARR);
})

MEAL_ADD_BUTTON.on('click', function() {
    copyAppend(MEAL_DIV, DAILY_DIV)
    DAILY_FOODS_ARR.push(MEAL_FOODS_ARR);
})

DAY_ADD_BUTTON.on('click', function() {
    copyAppend(DAILY_DIV, WEEKLY_DIV)
    WEEKLY_FOODS_ARR.push(DAILY_FOODS_ARR);
})

MEAL_TOTAL_BUTTON.on('click', function() {
    getTotal(MEAL_FOODS_ARR, MEAL_TOTAL_DIV);
})

DAY_TOTAL_BUTTON.on('click', function() {
    let DAILY_FOODS_ARR_FLAT = DAILY_FOODS_ARR.flat();
    getTotal(DAILY_FOODS_ARR_FLAT, DAILY_TOTAL_DIV);
})

WEEK_TOTAL_BUTTON.on('click', function() {
    getTotal(WEEKLY_TOTAL_DIV);
})

$("div").on('click', ".remove", function() {
    $(this).parent().remove();
})

// let index = MEAL_FOODS_ARR.indexOf($(this));
// console.log(index);
// spliceItem(MEAL_FOODS_ARR, $(this).parent());

// MEAL_FOODS_ARR.splice(MEAL_FOODS_ARR.indexOf($(this)), 1);
// let test = $(this).parent().index();
// console.log(test);

// MEAL_FOODS_ARR.splice($.inArray(removeItem, MEAL_FOODS_ARR), $(this));