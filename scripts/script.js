$(document).ready(function() {
    // Practices used for the comments in this file: 
    // (i) The code will be seperated into a) "major headings" declared in caps with arrows b) "sub headings" declared in caps c) "explanations" in lower case
    // (ii) If a variable is in capital letters within the code you will be able to find that variable declared at the top of the page.


    // <--- VARIABLES --->

    // INPUT
    const SEARCH_INPUT = $('.searchInput');
    // DIVS
    // The add class to this div just gives it card aesthetics taken from materialize CSS
    const ITEM_DIV = $('<div>').addClass('itemDiv card blue-grey darken-1 card-content white-text text-flow col s5.5 m2.5');
    const NUTRI_DIV = $('.nutri');
    const BREAKFAST_DIV = $('.breakfast');
    const LUNCH_DIV = $('.lunch');
    const DINNER_DIV = $('.dinner');
    // BUTTONS
    const SEARCH_BUTTON = $('.searchButton');
    // The add class to this button just gives it card aesthetics taken from materialize CSS
    const REMOVE_BUTTON = $('<button>').text('Remove Item').addClass('remove waves-effect waves-light btn m50 y14');
    const BREAKFAST_ADD_BUTTON = $('.breakfastAdd');
    const LUNCH_ADD_BUTTON = $('.lunchAdd');
    const DINNER_ADD_BUTTON = $('.dinnerAdd');
    const DAY_TOTAL_BUTTON = $('.dayTotalBtn');
    // The add class to this div just gives it card aesthetics taken from materialize CSS. We also use the hide function so it isn't intially seen (see line 68 for the paired .show() function)
    const DAY_TOTAL_DIV = $('.dayTotal').addClass('card blue-grey darken-1 card-content white-text').hide();

    // ARRAYS
    // This is the array that the value of each nutritional item is pushed to and where the total for the daily nutrition values will be summed from.
    let DAILY_TOTALS_ARR = [];

    // <--- FUNCTIONS --->

    // This function sums the total for various nutritional values entered over the course of the day. 
    // It takes two arguments, an array to sum the totals from (in this case "DAILY_TOTALS_ARR") and a DIV to append those summed values to.
    // It also dynamically creates the content for these totals to be displayed. (this arguably could be a different function and if we were to develop this project further we would do this).
    function getTotal(ARRAY, DIV) {
        // The function first intialises 4 variables with the value 0 to sum 
        let calorieSum = 0;
        let proteinSum = 0;
        let fatSum = 0;
        let carbSum = 0;
        // It then initialises the forEach function to increment each of those 0 values with all the calories/proteins/fats/carbs found in the specified array ("DAILY_TOTALS_ARR").
        ARRAY.forEach(foodItem => {
            calorieSum += foodItem.calories;
            proteinSum += foodItem.protein;
            fatSum += foodItem.fat;
            carbSum += foodItem.carb;
        })

        // This is the part that dynamically creates the content for those values to be displayed in.
        // We create a string for the calories information, then a div for that information to be displayed in and replace the inner html of that Div with that string...
        let calorieSumString = `Calories: ${calorieSum.toFixed(2)} (kcal)`
        let calorieSumDiv = $('<div>').html(calorieSumString);
        // We create a string for the protein information, then a div for that information to be displayed in and replace the inner html of that Div with that string...
        let proteinSumString = `Protein: ${proteinSum.toFixed(2)} (g)`;
        let proteinSumDiv = $('<div>').html(proteinSumString);
        // We create a string for the fats information, then a div for that information to be displayed in and replace the inner html of that Div with that string...
        let fatSumString = `Fat: ${fatSum.toFixed(2)} (g)`
        let fatSumDiv = $('<div>').html(fatSumString);
        // We create a string for the carbs information, then a div for that information to be displayed in and replace the inner html of that Div with that string...
        let carbSumString = `Carbs: ${carbSum.toFixed(2)} (g)`
        let carbSumDiv = $('<div>').html(carbSumString);
        // We then append the dynamically created divs to the static div (".dayTotalDiv"/"DAY_TOTAL_DIV") contained in the HTML
        DIV.append(calorieSumDiv, proteinSumDiv, carbSumDiv, fatSumDiv);
        // The show method is used because the static div will initialially display on the screen. We hide it so it only shows when we calculate the totals.
        DIV.show();
    }

    // This function dynamically creates the content for the nutritional information.
    function renderCurrentNutri() {
        // First we empty the DIV so if there is any information in the DIV already it will clear this before adding the new information.
        ITEM_DIV.empty();
        // This initialises a local array for "currentFoodObj" to be pushed to. This array is where the content will be dynamically created from.
        // It is initialised as an empty array so that each time this function is called it will only contain the current food being searched.
        let CURRENT_FOODS = [];
        CURRENT_FOODS.push(currentFoodObj);
        // This initialises a forEach loop to dynamically create the content within the CURRENT_FOODS array.
        CURRENT_FOODS.forEach(foodItem => {
            // This creates a div for the food name to be displayed in, replaces the text of that div with the foodname, then appends it to the div all this information will be displayed in.
            let foodNameDiv = $('<h6>').text(foodItem.food);
            ITEM_DIV.append(foodNameDiv);
            // This creates a div for the calories information to be displayed in, replaces the text of that div with the foodname, then appends it to the div all this information will be displayed in.
            let caloriesDiv = $('<p>').text(' - Calories: ' + foodItem.calories + ' (kcal)');
            ITEM_DIV.append(caloriesDiv);
            // This creates a div for the protein information to be displayed in, replaces the text of that div with the foodname, then appends it to the div all this information will be displayed in.
            let proteinDiv = $('<p>').text(' - Protein: ' + foodItem.protein + ' (g)');
            ITEM_DIV.append(proteinDiv);
            // This creates a div for the fat information to be displayed in, replaces the text of that div with the foodname, then appends it to the div all this information will be displayed in.
            let fatDiv = $('<p>').text(' - Fat: ' + foodItem.fat + ' (g)');
            ITEM_DIV.append(fatDiv);
            // This creates a div for the carbs information to be displayed in, replaces the text of that div with the foodname, then appends it to the div all this information will be displayed in.
            let carbDiv = $('<p>').text(' - Carbs: ' + foodItem.carb + ' (g)');
            ITEM_DIV.append(carbDiv);
            // This gives the ITEM_DIV a data-id so that later on it can be spliced from the DAY_TOTALS_ARRAY using that id.
            ITEM_DIV.attr('data-food', currentFoodObj.food);
            // This appends the div with all these dynamically created elements to the static div (".nutri"/"NUTRI_DIV") in the HTML
            NUTRI_DIV.append(ITEM_DIV);
        });
        ITEM_DIV.append(REMOVE_BUTTON);
    }

    // This function clones the specified div (cloneItem) and appends the clone to the specified div (targetDiv), it uses true values in the parameters so it not only clones the element in question but also
    // the event listeners and other javascript elements connected to that element.
    function copyAppend(cloneItem, targetDiv) {
        targetDiv.append(cloneItem.clone(true, true));
    }
    // This function will grab a random item from a specified array.
    function getRandomArrIndex(array) {
        let index = Math.floor(Math.random() * array.length);
        return array[index];
    }

    // <--- MAIN --->

    // Navbar mobile collapse
    $('.sidenav').sidenav();

    // Materialize image respone
    $('.materialboxed').materialbox();

    // Inspiration Modal load
    $('.modal').modal();

    // Modal inspiration quote functions
    getInspiration();

    // This is the API call that gets the random quote for us to use. In the same function we replace the html of the '#modal-motd' div to contain this quote.
    function getInspiration() {
        $.ajax({
            method: 'GET',
            url: 'https://type.fit/api/quotes',
        }).then(function(response) {
            const data = JSON.parse(response);
            let randomQuote = getRandomArrIndex(data).text;
            $('#modal-motd').html('"' + randomQuote + '"');
        });
    }

    // This is the API call that gets us the nutritional information for our food items.
    function getNutrition(searchedFood) {
        $.ajax({
            method: 'GET',
            url: 'https://api.calorieninjas.com/v1/nutrition?query=' + searchedFood,
            headers: { 'X-Api-Key': '3qj9IFJLBpOh3lZfWZf3eg==rs8WPl0J1Oz9a9q2' },
            contentType: 'application/json'
        }).
        then(function(response) {
            // We initiliase an object to hold all of our nutritional information.
            currentFoodObj = {
                food: response.items[0].name,
                calories: response.items[0].calories,
                protein: response.items[0].protein_g,
                fat: response.items[0].fat_total_g,
                carb: response.items[0].carbohydrates_total_g
            }
            renderCurrentNutri();
        });
    }

    // <--- EVENTLISTENERS --->

    // Food Modal .onclick close
    $('.food-modal-button').on('click', function() {
        $('.food-modal').css('display', 'none');
    })

    // This is the search button that allows us to search specific items and display their information on the screen.
    SEARCH_BUTTON.on('click', function(event) {
        event.preventDefault();

        const searchItem = SEARCH_INPUT.val();
        // This initialises an if statement that will present a modal prompting the user to enter a food item if they search with nothing in the input field...
        if (searchItem === '') {
            $('.food-modal').css('display', 'flex');
            return;
        }
        // ...else... if they do search something it will render the nutrition of the specific item.
        SEARCH_INPUT.val('');
        getNutrition(searchItem);
    })

    // This is the breakfast add button. It allows you to add whatever is current displayed in the search area to the breakfast section. It also pushes it to the DAILY_TOTALS_ARR for the calculate total function to use.
    BREAKFAST_ADD_BUTTON.on('click', function() {
        if (ITEM_DIV.text() == '') {
            $('.food-modal').css('display', 'flex');
            return;
        }
        copyAppend(ITEM_DIV, BREAKFAST_DIV);
        DAILY_TOTALS_ARR.push(currentFoodObj);
    });
    // This is the lunch add button. It allows you to add whatever is current displayed in the search area to the lunch section. It also pushes it to the DAILY_TOTALS_ARR for the calculate total function to use.
    LUNCH_ADD_BUTTON.on('click', function() {
        if (ITEM_DIV.text() == '') {
            $('.food-modal').css('display', 'flex');
            return;
        }
        copyAppend(ITEM_DIV, LUNCH_DIV);
        DAILY_TOTALS_ARR.push(currentFoodObj);
    });
    // This is the dinner add button. It allows you to add whatever is current displayed in the search area to the dinner section. It also pushes it to the DAILY_TOTALS_ARR for the calculate total function to use.
    DINNER_ADD_BUTTON.on('click', function() {
        if (ITEM_DIV.text() == '') {
            $('.food-modal').css('display', 'flex');
            return;
        }
        copyAppend(ITEM_DIV, DINNER_DIV);
        DAILY_TOTALS_ARR.push(currentFoodObj);
    });
    // This is the button that calculates the day total. When clicked it calls the getTotal function which has been explained previously in the comments.
    DAY_TOTAL_BUTTON.on('click', function() {
        getTotal(DAILY_TOTALS_ARR, DAY_TOTAL_DIV);
    })

    // This is the remove button. It listens to all the divs on the page with the class remove and when clicked...
    $('div').on('click', '.remove', function(event) {
        event.preventDefault();
        // ... it retrieves the data ID of the div you have clicked remove on.
        var foodID = $(this).parent().attr('data-food');
        // ... it uses the (jQuery $.each) forEach method to check the DAILY_TOTALS_ARR for an object with that data ID.
        $.each(DAILY_TOTALS_ARR, function(key, value) {
            if (value.food == foodID) {
                foodIDKey = key;
            }
        });
        // ... it then splices the specified object from the array
        DAILY_TOTALS_ARR.splice(foodIDKey, 1);
        // ... and finally it removes the div from the page so you can no longer see it.
        $(this).parent().remove();
    });
});