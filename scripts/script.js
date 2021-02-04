$(document).ready(function() {

    // <--- VARIABLES --->

    // INPUT
    const SEARCH_INPUT = $('.searchInput');
    // DIVS
    const ITEM_DIV = $('<div>').addClass("itemDiv card blue-grey darken-1 card-content white-text text-flow col s4 m2");
    const NUTRI_DIV = $('.nutri');
    const BREAKFAST_DIV = $('.breakfast');
    const LUNCH_DIV = $('.lunch');
    const DINNER_DIV = $('.dinner');
    // BUTTONS
    const SEARCH_BUTTON = $('.searchButton');
    const REMOVE_BUTTON = $('<button>').text("Remove Item").addClass("remove waves-effect waves-light btn m50 y14");
    const BREAKFAST_ADD_BUTTON = $('.breakfastAdd');
    const LUNCH_ADD_BUTTON = $('.lunchAdd');
    const DINNER_ADD_BUTTON = $('.dinnerAdd');
    const DAY_TOTAL_BUTTON = $('.dayTotalBtn');
    const DAY_TOTAL_DIV = $('.dayTotal');
    // ARRAYS
    let DAILY_TOTALS_ARR = [];

    // <--- FUNCTIONS --->

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
        const String = `Calories: ${calorieSum.toFixed(2)} (kcal), Protein: ${proteinSum.toFixed(2)} (g), Fat: ${fatSum.toFixed(2)} (g), Carbs: ${carbSum.toFixed(2)} (g)`
        DIV.html(String);
    }

    // Present searched item to page
    function renderCurrentNutri() {
        ITEM_DIV.empty();
        let CURRENT_FOODS = [];
        CURRENT_FOODS.push(currentFoodObj);
        CURRENT_FOODS.forEach(foodItem => {
            let foodNameDiv = $("<h6>").text(foodItem.food);
            ITEM_DIV.append(foodNameDiv);
            let caloriesDiv = $("<p>").text(" - Calories: " + foodItem.calories + " (kcal)");
            ITEM_DIV.append(caloriesDiv);
            let proteinDiv = $("<p>").text(" - Protein: " + foodItem.protein + " (g)");
            ITEM_DIV.append(proteinDiv);
            let fatDiv = $("<p>").text(" - Fat: " + foodItem.fat + " (g)");
            ITEM_DIV.append(fatDiv);
            let carbDiv = $("<p>").text(" - Carbs: " + foodItem.carb + " (g)");
            ITEM_DIV.attr("data-food", currentFoodObj.food);
            ITEM_DIV.append(carbDiv);
            NUTRI_DIV.append(ITEM_DIV);
        });
        ITEM_DIV.append(REMOVE_BUTTON);
    }

    // Add Food Item buttons for breakfast, Lunch & Dinner
    function copyAppend(cloneItem, targetDiv) {
        targetDiv.append(cloneItem.clone(true, true));
    }

    function getRandomArrIndex(array) {
        let index = Math.floor(Math.random() * array.length);
        return array[index];
    }

    // <--- MAIN --->

    // Navbar mobile collapse
    $('.sidenav').sidenav();

    // Inspiration Modal load
    $('.modal').modal();

    // Food Modal .onclick close
    $('.food-modal-button').on('click', function() {
        $('.food-modal').css('display', 'none');
    })

    // <--- MAIN --->
    // Modal inspiration quote functions
    getInspiration();

    function getInspiration() {
        $.ajax({
            method: 'GET',
            url: 'https://type.fit/api/quotes',
        }).then(function(a1) {
            const data = JSON.parse(a1);
            let randomQuote = getRandomArrIndex(data).text;
            $("#modal-motd").html('"' + randomQuote + '"');
        });
    }

    // Food item API
    function getNutrition(searchedFood) {
        $.ajax({
            method: 'GET',
            url: 'https://api.calorieninjas.com/v1/nutrition?query=' + searchedFood,
            headers: { 'X-Api-Key': '3qj9IFJLBpOh3lZfWZf3eg==rs8WPl0J1Oz9a9q2' },
            contentType: 'application/json'
        }).
        then(function(a) {
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

    // <--- EVENTLISTENERS --->

    // Food item search button
    SEARCH_BUTTON.on('click', function(event) {
        event.preventDefault();

        const searchItem = SEARCH_INPUT.val();
        if (searchItem === "") {
            $('.food-modal').css('display', 'flex');
            return;
        }
        SEARCH_INPUT.val("");
        getNutrition(searchItem);
    })

    BREAKFAST_ADD_BUTTON.on('click', function() {
        copyAppend(ITEM_DIV, BREAKFAST_DIV);
        DAILY_TOTALS_ARR.push(currentFoodObj);
    });

    LUNCH_ADD_BUTTON.on('click', function() {
        copyAppend(ITEM_DIV, LUNCH_DIV);
        DAILY_TOTALS_ARR.push(currentFoodObj);
    });

    DINNER_ADD_BUTTON.on('click', function() {
        copyAppend(ITEM_DIV, DINNER_DIV);
        DAILY_TOTALS_ARR.push(currentFoodObj);
    });

    DAY_TOTAL_BUTTON.on('click', function() {
        getTotal(DAILY_TOTALS_ARR, DAY_TOTAL_DIV);
    })

    $("div").on('click', ".remove", function(event) {
        event.preventDefault();

        var foodID = $(this).parent().attr("data-food");
        $.each(DAILY_TOTALS_ARR, function(key, value) {
            if (value.food == foodID) {
                foodIDKey = key;
            }
        });
        DAILY_TOTALS_ARR.splice(foodIDKey, 1);
        $(this).parent().remove();
    });
});