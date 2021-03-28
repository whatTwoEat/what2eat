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
        console.log(what2EatApp.cuisineValue);
    
        // pass new search
        
        what2EatApp.getRecipes(what2EatApp.ingredientValue,what2EatApp.cuisineValue);
    });
}

//method to fetch a response from the API with new search params from user

what2EatApp.getRecipes = (ingredients,cuisine) => {
    const url = new URL(what2EatApp.apiUrl);
    if ( cuisine === "any"){
        url.search = new URLSearchParams({
            // populate Query (q) without cuisine type (any cuisine type)
            q: ingredients,
            app_id: what2EatApp.apiId,
            app_key: what2EatApp.apiKey,
        });
    } else {
        url.search = new URLSearchParams({
            // populate Query (q) and cuisine type from user submission
            q: ingredients,
            cuisineType : cuisine,
            app_id: what2EatApp.apiId,
            app_key: what2EatApp.apiKey,
        });
    }
    
    // fetch a response from the API with search params from user
    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (jsonResponse) {
        //array of objects containing recipes data
        const recipeOptionsArray = jsonResponse.hits;
        console.log(recipeOptionsArray);

        // filter by health label and put in each array ie.vegan, nut-free, gluten-free, dairy-free
        //filtered array of vegan recipes
        const veganArray = what2EatApp.filterResults(recipeOptionsArray,"Vegan");
        //filtered array of nut-free recipes
        const nutFreeArray = what2EatApp.filterResults(what2EatApp.filterResults(recipeOptionsArray,"Peanut-Free"),"Tree-Nut-Free");
        //filtered array of gluten-free recipes
        const glutenFreeArray = what2EatApp.filterResults(recipeOptionsArray,"Gluten-Free");
        //filtered array of dairy-free recipes
        const dairyFreeArray = what2EatApp.filterResults(recipeOptionsArray,"Dairy-Free");
        
        //append recipes
        what2EatApp.showRecipeCard(recipeOptionsArray);
    }).catch(()=>{
        //clear previous search
        what2EatApp.ulElement.innerHTML = "<p>not found</p>";
        console.log('not getting recipe')
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
    // create loop for each recipe
    array.forEach((recipeObject) => {
        // create elements for responses
        const recipeCard = document.createElement('li');
        const {url,image,label,calories,ingredientLines,yield} = recipeObject.recipe;
        recipeCard.innerHTML = `
            <div>
                <a href=${url} target="_blank">
                <img src=${image} alt=${label}/>
                </a>
            </div>
            <h3>${label}</h3>
            <p>${Math.floor(calories)} calories</p>
            <p>${ingredientLines.length} ingredients</p>
            <p>serves: ${yield}</p>
        `;
        // append elements to display on page
        what2EatApp.ulElement.append(recipeCard);
    }); 
}

// call what2EatApp.init
what2EatApp.init();