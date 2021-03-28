//app object
const what2EatApp = {};

//API properties
// create what2EatApp.apiUrl,what2EatApp.apiId,what2EatApp.apiKey
what2EatApp.apiUrl = "https://api.edamam.com/search";
what2EatApp.apiId = "c6c0de41";
what2EatApp.apiKey = "fc1ff96c50152ca79e4079032ce2955d";

//form element
what2EatApp.formElement = document.querySelector('form');
//ul element
what2EatApp.ulElement = document.querySelector('ul.recipeCards');
// create what2EatApp init method
what2EatApp.init = () => {
    // function to listen for submission
    what2EatApp.formElement.addEventListener('submit', (e) => {
        e.preventDefault();
        // user submission is stored in variable(s)
        what2EatApp.ingredientElement = document.querySelector('input');
        what2EatApp.ingredientValue = what2EatApp.ingredientElement.value;
        what2EatApp.cuisineElement = document.querySelector('select');
        what2EatApp.cuisineValue = what2EatApp.cuisineElement.value;
    
        // pass new search 
        what2EatApp.getRecipes(what2EatApp.ingredientValue);
    });
}

//method to fetch a response from the API with new search params from user
what2EatApp.getRecipes = (ingredients) => {
    const url = new URL(what2EatApp.apiUrl);
    url.search = new URLSearchParams({
        q: ingredients,
        // cuisineType : cuisine,
        app_id: what2EatApp.apiId,
        app_key: what2EatApp.apiKey,
    });
    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (jsonResponse) {
        //array of objects containing recipes data
        const recipeOptionsArray = jsonResponse.hits;
        console.log(recipeOptionsArray);

        //filtered array of vegan recipes
        const veganArray = what2EatApp.filterResults(recipeOptionsArray,"Vegan");
        console.log(veganArray);
        //filtered array of nut-free recipes
        const nutFreeArray = what2EatApp.filterResults(what2EatApp.filterResults(recipeOptionsArray,"Peanut-Free"),"Tree-Nut-Free");
        console.log(nutFreeArray);
        //filtered array of gluten-free recipes
        const glutenFreeArray = what2EatApp.filterResults(recipeOptionsArray,"Gluten-Free");
        console.log(glutenFreeArray);
        //filtered array of dairy-free recipes
        const dairyFreeArray = what2EatApp.filterResults(recipeOptionsArray,"Dairy-Free");
        console.log(dairyFreeArray);
        
        //append recipes
        what2EatApp.showRecipeCard(recipeOptionsArray);
    });
}

//helping function to filter result base on label
what2EatApp.filterResults = (array,label) => {
    return array.filter(arrayObject => arrayObject.recipe.healthLabels.includes(label)); 
}    



//function to append results
what2EatApp.showRecipeCard = (array) => {
    //clear previous search
    what2EatApp.ulElement.innerHTML = "";
    array.forEach((recipeObject) => {
        const recipeCard = document.createElement('li');
        recipeCard.innerHTML = `
            <div>
                <a href=${recipeObject.recipe.url} target="_blank">
                <img src=${recipeObject.recipe.image} alt=${recipeObject.recipe.label}/>
                </a>
            </div>
            <h3>${recipeObject.recipe.label}</h3>
            <p>calories : ${Math.floor(recipeObject.recipe.calories)}</p>
            <p>${recipeObject.recipe.ingredientLines.length} ingredients</p>
            <p>serves: ${recipeObject.recipe.yield}</p>
        `;
        //append li to ul
        what2EatApp.ulElement.append(recipeCard);
    }); 
}
// populate Query (q) section and cuisine type with user submission variable(s)
// fetch a response from the API with new search params from user
// create loop for each response
// filter by health label and put in each array ie. vegan, nut-free, gluten-free, dairy-free
// create elements for responses
// append elements to display on page




// call what2EatApp.init
what2EatApp.init();