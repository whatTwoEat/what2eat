//app object
const what2EatApp = {};

//API properties
// create what2EatApp.apiUrl,what2EatApp.apiId,what2EatApp.apiKey
what2EatApp.apiUrl = "https://api.edamam.com/search";
what2EatApp.apiId = "c6c0de41"
what2EatApp.apiKey = "fc1ff96c50152ca79e4079032ce2955d";

// create what2EatApp init method
what2EatApp.init = () => {
    what2EatApp.getRecipes("tomato mango chicken","Mexican");
}

//method to fetch a response from the API with new search params from user
what2EatApp.getRecipes = (ingredients,cuisine) => {
    const url = new URL(what2EatApp.apiUrl);
    url.search = new URLSearchParams({
        q: ingredients,
        cuisineType : cuisine,
        app_id: what2EatApp.apiId,
        app_key: what2EatApp.apiKey,
    });
    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (jsonResponse) {
        const recipeOptionsArray = jsonResponse.hits;
        console.log(recipeOptionsArray);
        return recipeOptionsArray; //recipes data array
    });
}

// function to listen for submission
// user submission is stored in variable(s)
// pass new search params



// populate Query (q) section and cuisine type with user submission variable(s)
// fetch a response from the API with new search params from user
// create loop for each response
// create elements for responses
// append elements to display on page



// create event listener to each recipe card
// upon click take user to full recipe breakdown through url provided in response

// call what2EatApp.init
what2EatApp.init();