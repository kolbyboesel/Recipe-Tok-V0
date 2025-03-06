import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from '../components/LoadingSpinner';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await response.json();
        setRecipe(data.meals ? data.meals[0] : null);
      } catch (err) {
        setError("Error fetching recipe details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (isLoading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!recipe) return <div className="error-message">No recipe found.</div>;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`]?.trim();
    const measure = recipe[`strMeasure${i}`]?.trim();
    if (ingredient) {
      ingredients.push({ ingredient, measure: measure || "to taste" });
    }
  }

  return (
    <div className="container page">
      <div className="page-content-container">
        <header className="recipe-header">
          <img
            src={recipe.strMealThumb || "https://via.placeholder.com/800"}
            alt={recipe.strMeal || "No Name"}
            className="recipe-header-image"
          />
          <h1 className="recipe-title">{recipe.strMeal || "No Name"}</h1>
          <div className="recipe-meta">
            <span className="recipe-category">{recipe.strCategory || "Unknown"}</span>
            <span className="recipe-area">{recipe.strArea || "Unknown Origin"}</span>
          </div>
        </header>
        <section className="recipe-details">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {ingredients.length > 0 ? (
              ingredients.map((item, index) => (
                <li key={index}>
                  {item.ingredient} - {item.measure}
                </li>
              ))
            ) : (
              <li>No ingredients available.</li>
            )}
          </ul>
          <h2>Instructions</h2>
          <p className="instructions">{recipe.strInstructions || "No instructions provided."}</p>
          {recipe.strYoutube && (
            <div className="recipe-video">
              <h2>Video Tutorial</h2>
              <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer">
                Watch on YouTube
              </a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default RecipeDetails;