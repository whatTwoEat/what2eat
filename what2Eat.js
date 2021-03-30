//app object
const what2EatApp = {};

//API properties
// create what2EatApp.apiUrl,what2EatApp.apiId,what2EatApp.apiKey
what2EatApp.apiUrl = "https://api.edamam.com/search";
what2EatApp.apiId = "c6c0de41";
what2EatApp.apiKey = "fc1ff96c50152ca79e4079032ce2955d";

//form element
what2EatApp.formElement = document.querySelector("form");
//ul element
what2EatApp.ulElement = document.querySelector("ul.recipeCards");
// create what2EatApp init method
what2EatApp.init = () => {
  what2EatApp.listenToSearchForm();
};

// function to listen for submission
what2EatApp.listenToSearchForm = () => {
  what2EatApp.formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    // user submission is stored in variable(s)
    what2EatApp.ingredientElement = document.querySelector("input");
    what2EatApp.ingredientValue = what2EatApp.ingredientElement.value;
    what2EatApp.cuisineElement = document.getElementById("cuisineType");
    what2EatApp.cuisineValue = what2EatApp.cuisineElement.value;

    what2EatApp.diet = document.getElementById("dietRes");
    what2EatApp.dietValue = what2EatApp.diet.value;

    // pass new search
    what2EatApp.getRecipes(
      what2EatApp.ingredientValue,
      what2EatApp.cuisineValue,
      what2EatApp.dietValue
    );
  });
};

//method to fetch a response from the API with new search params from user

what2EatApp.getRecipes = (ingredients, cuisine, diet) => {
  const url = new URL(what2EatApp.apiUrl);
  if (cuisine === "any") {
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
      cuisineType: cuisine,
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
      const recipeOptionsArray = jsonResponse.hits;
      if (diet === "none") {
        //append recipes
        what2EatApp.showRecipeCard(recipeOptionsArray);
      } else if (diet === "vegan") {
        //filter vegan recipes
        const veganArray = what2EatApp.filterResults(recipeOptionsArray, "Vegan");
        what2EatApp.showRecipeCard(veganArray);
      } else if (diet === "nutFree") {
        //filter nut free recipes
        const nutFreeArray = what2EatApp.filterResults(
          what2EatApp.filterResults(recipeOptionsArray, "Peanut-Free"),
          "Tree-Nut-Free"
        );
        what2EatApp.showRecipeCard(nutFreeArray);
      } else if (diet === "glutenFree") {
        //filtered gluten-free recipes
        const glutenFreeArray = what2EatApp.filterResults(recipeOptionsArray, "Gluten-Free");
        what2EatApp.showRecipeCard(glutenFreeArray);
      } else if (diet === "dairyFree") {
        //filtered dairy-free recipes
        const dairyFreeArray = what2EatApp.filterResults(recipeOptionsArray, "Dairy-Free");
        what2EatApp.showRecipeCard(dairyFreeArray);
      }
    })
    .catch(() => {
      //clear previous search
      what2EatApp.ulElement.innerHTML = "<p>not found</p>";
      console.log("not getting recipe");
    });
};

//helping function to filter result base on label
what2EatApp.filterResults = (array, label) => {
  return array.filter((arrayObject) => arrayObject.recipe.healthLabels.includes(label));
};

//function to append results
what2EatApp.showRecipeCard = (array) => {
  const ulElement = document.querySelector("ul");
  //clear previous search
  ulElement.innerHTML = "";
  // create loop for each recipe
  array.forEach((recipeObject) => {
    // create elements for responses
    const recipeCard = document.createElement("li");
    const recipeImageDiv = document.createElement("div");

    const recipeAnchor = document.createElement("a");
    recipeAnchor.href = recipeObject.recipe.url;
    recipeAnchor.target = "_blank";

    const recipeImage = document.createElement("img");
    recipeImage.src = recipeObject.recipe.image;
    recipeImage.alt = recipeObject.recipe.label;

    const recipeTitle = document.createElement("h3");
    recipeTitle.textContent = recipeObject.recipe.label;

    // round the calories down
    let calories = recipeObject.recipe.calories;
    const roundedCalories = Math.floor(calories);
    const recipeCalories = document.createElement("p");
    recipeCalories.textContent = `${roundedCalories} calories`;

    const recipeIngredientNum = document.createElement("p");
    recipeIngredientNum.textContent = `${recipeObject.recipe.ingredientLines.length} Ingredients`;

    const recipeYield = document.createElement("p");
    recipeYield.textContent = `Serves: ${recipeObject.recipe.yield}`;

    // put the anchor and image in the div container
    recipeImageDiv.appendChild(recipeAnchor);
    recipeAnchor.appendChild(recipeImage);

    // put the div and other info in the li
    recipeCard.appendChild(recipeImageDiv);
    recipeCard.appendChild(recipeTitle);
    recipeCard.appendChild(recipeCalories);
    recipeCard.appendChild(recipeIngredientNum);
    recipeCard.appendChild(recipeYield);

    // put the li into the ul & display on page
    ulElement.appendChild(recipeCard);
  });
};

// call what2EatApp.init
what2EatApp.init();
