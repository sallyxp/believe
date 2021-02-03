$(document).ready(function () {

    // Variables
    const SEARCH_INPUT = $('.searchInput');
    const SEARCH_BUTTON = $('.searchButton');
    const ITEM_DIV = $('<div>');
    const NUTRI_DIV = $('.nutri');

    // Meal Variables
    const BREAKFAST_DIV = $('.breakfast');
    const LUNCH_DIV = $('.lunch');
    const DINNER_DIV = $('.dinner');
    const BREAKFAST_ADD_BUTTON = $('.breakfastAdd');
    const LUNCH_ADD_BUTTON = $('.lunchAdd');
    const DINNER_ADD_BUTTON = $('.dinnerAdd');
    
    const BREAKFAST_TOTAL_DIV = $('.breakfastTotal');
    const LUNCH_TOTAL_DIV = $('.lunchTotal');
    const DINNER_TOTAL_DIV = $('.dinnerTotal');
    const BREAKFAST_TOTAL_BUTTON = $('.breakfastTotalBtn');
    const LUNCH_TOTAL_BUTTON = $('.lunchTotalBtn');
    const DINNER_TOTAL_BUTTON = $('.dinnerTotalBtn');
    
    let BREAKFAST_FOODS_ARR = [];
    let LUNCH_FOODS_ARR = [];
    let DINNER_FOODS_ARR = [];
    let DAILY_FOODS_ARR = [];

    const REMOVE_BUTTON = $('<button>').text("Remove").addClass("remove waves-effect waves-light btn");
    let FOOD_ITEMS = JSON.parse(localStorage.getItem('food')) || [];

    // Navbar mobile collapse
    $('.sidenav').sidenav();

    // Modal load
    $('.bg-modal').css('display', 'flex');

    // Modal .onclick close
    $('.continue').on('click', function () {
        $('.bg-modal').css('display', 'none');
    })

    // Modal inspiration quote functions
    getInspiration();

    function getInspiration() {
        $.ajax({
            method: 'GET',
            url: 'https://type.fit/api/quotes',
        }).then(function (a1) {
            const data = JSON.parse(a1);
            let randomQuote = getRandomArrIndex(data).text;
            $("#modal-motd").html('"' + randomQuote + '"');
        });
    }

    function getRandomArrIndex(array) {
        let index = Math.floor(Math.random() * array.length);
        return array[index];
    }

    // Food item search button
    SEARCH_BUTTON.on('click', function (event) {
        event.preventDefault();

        const searchItem = SEARCH_INPUT.val();
        if (searchItem === "") {
            alert("You must enter a food item");
            return;
        }
        $("input[type=text], searchInput").val("");
        getNutrition(searchItem);
    })

    // Food item API
    function getNutrition(searchedFood) {
        $.ajax({
            method: 'GET',
            url: 'https://api.calorieninjas.com/v1/nutrition?query=' + searchedFood,
            headers: { 'X-Api-Key': '3qj9IFJLBpOh3lZfWZf3eg==rs8WPl0J1Oz9a9q2' },
            contentType: 'application/json'
        }).
            then(function (a) {
                currentFoodObj = {
                    food: a.items[0].name,
                    calories: a.items[0].calories,
                    protein: a.items[0].protein_g,
                    fat: a.items[0].fat_total_g,
                    carb: a.items[0].carbohydrates_total_g
                }
                renderCurrentNutri(searchedFood);
            });
    }

    // Present searched item to page
    function renderCurrentNutri(searchItem) {
        ITEM_DIV.empty();
        let CURRENT_FOODS = [];
        CURRENT_FOODS.push(currentFoodObj);
        CURRENT_FOODS.forEach(foodItem => {
            let foodNameDiv = $("<p>").text(searchItem);
            ITEM_DIV.append(foodNameDiv);
            let caloriesDiv = $("<p>").text(" - Calories (kcal): " + foodItem.calories);
            caloriesDiv.attr("ID", "calories");
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
        });
    }

    // Add Food Item buttons for breakfast, Lunch & Dinner
    function copyAppend(cloneItem, targetDiv) {
        targetDiv.append(cloneItem.clone(true, true));
    }

    BREAKFAST_ADD_BUTTON.on('click', function() {
        copyAppend(ITEM_DIV, BREAKFAST_DIV);
        
    });

    LUNCH_ADD_BUTTON.on('click', function() {
        copyAppend(ITEM_DIV, LUNCH_DIV);
       
    });

    DINNER_ADD_BUTTON.on('click', function() {
        copyAppend(ITEM_DIV, DINNER_DIV);
        
    });


});
