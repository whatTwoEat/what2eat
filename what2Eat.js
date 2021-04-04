//app object
const what2EatApp = {};

//API properties
// create what2EatApp.apiUrl,what2EatApp.apiId,what2EatApp.apiKey
what2EatApp.apiUrl = "https://api.edamam.com/search";
what2EatApp.apiId = "c6c0de41";
what2EatApp.apiKey = "fc1ff96c50152ca79e4079032ce2955d";

//ul element
what2EatApp.ulElement = document.querySelector("ul.recipeCards");

// create what2EatApp init method
what2EatApp.init = () => {
  what2EatApp.listenToSearchForm();
};

// function to listen for submission
what2EatApp.listenToSearchForm = () => {
  //form element
  const formElement = document.querySelector("form");
  formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    // user submission is stored in variable(s)
    const ingredientElement = document.querySelector("input");
    const ingredientValue = ingredientElement.value;
    const cuisineElement = document.getElementById("cuisineType");
    const cuisineValue = cuisineElement.value;
    const diet = document.getElementById("dietRes");
    const dietValue = diet.value;

    // pass search params and search
    what2EatApp.getRecipes(ingredientValue, cuisineValue, dietValue);

    //empty search input field
    ingredientElement.value = "";
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
      // //if no results found
      // if (jsonResponse.hits.length === 0) {
      //   console.log('recipes not found');
      // }
      //display results base on diet options
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

//function to filter result base on label
what2EatApp.filterResults = (array, label) => {
  return array.filter((arrayObject) => arrayObject.recipe.healthLabels.includes(label));
};

//function to append results
what2EatApp.showRecipeCard = (array) => {
  //clear previous search
  what2EatApp.ulElement.innerHTML = "";
  // create loop for each recipe
  array.forEach((recipeObject) => {
    const { url, image, label, calories, ingredientLines, yield } = recipeObject.recipe;
    // create elements for responses
    const recipeCard = document.createElement("li");
    const recipeImageDiv = document.createElement("div");

    const recipeAnchor = document.createElement("a");
    recipeAnchor.href = url;
    recipeAnchor.target = "_blank";

    const recipeImage = document.createElement("img");
    recipeImage.src = image;
    recipeImage.alt = label;

    const recipeTitle = document.createElement("h3");
    recipeTitle.textContent = label;

    // round the calories down to no decimal point
    const roundedCalories = Math.floor(calories);
    const recipeCalories = document.createElement("p");
    recipeCalories.textContent = `${roundedCalories} calories`;

    const recipeIngredientNum = document.createElement("p");
    recipeIngredientNum.textContent = `${ingredientLines.length} Ingredients`;

    const recipeYield = document.createElement("p");
    recipeYield.textContent = `Serves: ${yield}`;

    // put the image in the div container
    recipeImageDiv.appendChild(recipeImage);

    // put the anchor in the li
    recipeCard.appendChild(recipeAnchor);

    // put the div and other info in the anchor
    recipeAnchor.appendChild(recipeImageDiv);
    recipeAnchor.appendChild(recipeTitle);
    recipeAnchor.appendChild(recipeCalories);
    recipeAnchor.appendChild(recipeIngredientNum);
    recipeAnchor.appendChild(recipeYield);

    // put the li into the ul & display on page
    what2EatApp.ulElement.appendChild(recipeCard);
  });
};

// call what2EatApp.init
what2EatApp.init();
