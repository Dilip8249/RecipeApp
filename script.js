const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeDiv = document.querySelector(".recipe-div");
const messageElm = document.getElementById("message");
const closeBtn = document.querySelector(".close-btn");
const viewRecipeContainer = document.querySelector(".viewRecipe-container");

const fetchRecipes = async (query) => {
  messageElm.innerHTML = "Loading...";
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const data = await response.json();
    messageElm.innerHTML = "";
    // console.log(data);
    let element = "";

    data.meals.forEach((meal) => {
      element += `
        <div class="card">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h3>${meal.strMeal}</h3>
          <p>${meal.strArea}</p>
          <p>${meal.strCategory}</p>
          <div>
            <button id=${meal.idMeal} class="viewRecipe-btn">View Recipe</button>
          </div>
        </div>`;

      //   console.log(meal);
    });
    recipeDiv.innerHTML = element;

    // Select all buttons with the class "viewRecipe-btn"
    const buttons = document.querySelectorAll(".viewRecipe-btn");

    // Add click event listener to each button
    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        const buttonId = button.id;
        // console.log(buttonId);
        showRecipePopup(buttonId);
      });
    });
  } catch (error) {
    messageElm.innerHTML = "Error fetching recipes";
    console.error(error);
  }
};

//search button
searchBtn.addEventListener("click", () => {
  const searchInput = searchBox.value.trim();
  fetchRecipes(searchInput);
  //   fetchData(searchInput);
});
//recipe popup

const showRecipePopup = async (buttonId) => {
  const recipeViewContainer = document.querySelector(".recipeView-popup");
  recipeViewContainer.style.display = "block";
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${buttonId}`
  );
  let data = await res.json();
  let elm = "";
  data.meals.forEach((meal) => {
    elm = `<h2 class="recipeName">${meal.strMeal}</h2>
    <h3 class="recipeIngredients-heading">Ingredients:</h3>
    <ul class="recipeIngredients">${fetchIngredients(meal)}</ul>
    <div>
      <h3 class="recipeInstructions-heading">Instructions:</h3>
      <p class="recipeInstructions">${meal.strInstructions}</p>
    </div>
    `;

    console.log(meal);
  });
  viewRecipeContainer.innerHTML = elm;

  closeBtn.addEventListener("click", () => {
    document.querySelector(".recipeView-popup").style.display = "none";
  });
};
// function to fetch Ingredient
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const mearure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${mearure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};
