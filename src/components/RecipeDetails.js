import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "./LoadingSpinner";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/recipes/get/${id}`
        );
        if (response.status === 200 && response.data) {
          setRecipe(response.data);
        } else {
          setError("Recipe not found.");
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError("Error loading recipe.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (isLoading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!recipe) return <div className="error-message">No recipe found.</div>;

  // ✅ Function to safely parse JSON
  const safeParseJSON = (data, fallback) => {
    try {
      return data ? JSON.parse(data.replace(/'/g, '"')) : fallback;
    } catch (error) {
      console.error("JSON Parse error:", error);
      return fallback; // Return empty array if parsing fails
    }
  };

  // ✅ Convert stringified arrays safely
  const ingredients = safeParseJSON(recipe.ingredients, []);
  const steps = safeParseJSON(recipe.steps, []);
  const tags = safeParseJSON(recipe.tags, []);

  return (
    <div className="container page">
      <div className="page-content-container">
        <header className="recipe-header">
          <h1 className="recipe-title">{recipe.name || "No Name"}</h1>
          <p><strong>Cook Time:</strong> {recipe.minutes || "N/A"} min</p>
          <div className="recipe-meta">
            <strong>Tags:</strong>{" "}
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <span key={index} className="recipe-tag">{tag}</span>
              ))
            ) : (
              <span>No tags available.</span>
            )}
          </div>
        </header>

        <section className="recipe-details">
          <h2>Description</h2>
          <p>{recipe.description || "No description available."}</p>

          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {ingredients.length > 0 ? (
              ingredients.map((ingredient, index) => <li key={index}>{ingredient}</li>)
            ) : (
              <li>No ingredients available.</li>
            )}
          </ul>

          <h2>Instructions</h2>
          <ol className="instructions-list">
            {steps.length > 0 ? (
              steps.map((step, index) => <li key={index}>{step}</li>)
            ) : (
              <li>No steps available.</li>
            )}
          </ol>
        </section>
      </div>
    </div>
  );
};

export default RecipeDetails;