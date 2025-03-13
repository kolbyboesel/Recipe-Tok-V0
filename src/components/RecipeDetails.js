import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "./LoadingSpinner";
import { FaClock, FaUtensils, FaListAlt, FaInfoCircle } from "react-icons/fa";

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

  if (error) return (
    <div className="container page">
      <div className="page-content-container empty-state">
        <FaInfoCircle className="empty-state-icon empty-state-icon-primary" />
        <h2 className="empty-state-title">{error}</h2>
        <p className="empty-state-text">Please try again or navigate back to the recipe list.</p>
      </div>
    </div>
  );

  if (!recipe) return (
    <div className="container page">
      <div className="page-content-container empty-state">
        <FaInfoCircle className="empty-state-icon empty-state-icon-primary" />
        <h2 className="empty-state-title">No recipe found</h2>
        <p className="empty-state-text">We couldn't find the recipe you're looking for.</p>
      </div>
    </div>
  );

  // Function to safely parse JSON
  const safeParseJSON = (data, fallback) => {
    try {
      return data ? JSON.parse(data.replace(/'/g, '"')) : fallback;
    } catch (error) {
      // Try to parse as pipe-separated values if JSON fails
      try {
        return data ? data.split('|').filter(item => item.trim() !== '') : fallback;
      } catch (e) {
        console.error("Parse error:", e);
        return fallback; // Return fallback if all parsing fails
      }
    }
  };

  // Convert stringified arrays safely
  const ingredients = safeParseJSON(recipe.ingredients, []);
  const steps = safeParseJSON(recipe.steps, []);
  const tags = safeParseJSON(recipe.tags, []);

  return (
    <div className="container page">
      <div className="page-content-container">
        <header className="recipe-header">
          <h1 className="recipe-title">{recipe.name || "No Name"}</h1>

          <div className="recipe-meta">
            <span>
              <FaClock /> {recipe.minutes || "N/A"} minutes
            </span>
            <span>
              <FaUtensils /> {recipe.numberOfIngredients || "N/A"} ingredients
            </span>
            <span>
              <FaListAlt /> {recipe.numberOfSteps || "N/A"} steps
            </span>
          </div>

          {tags.length > 0 && (
            <div className="meal-tags" style={{ justifyContent: 'center', marginTop: '1rem' }}>
              {tags.map((tag, index) => (
                <span key={index} className="recipe-tag">{tag}</span>
              ))}
            </div>
          )}
        </header>

        {recipe.description && (
          <section className="recipe-details">
            <h2>
              <FaInfoCircle style={{ marginRight: '0.5rem' }} />
              Description
            </h2>
            <p className="recipe-description">{recipe.description}</p>
          </section>
        )}

        <section className="recipe-details">
          <h2>
            <FaUtensils style={{ marginRight: '0.5rem' }} />
            Ingredients
          </h2>
          <ul className="ingredients-list">
            {ingredients.length > 0 ? (
              ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))
            ) : (
              <li>No ingredients available.</li>
            )}
          </ul>
        </section>

        <section className="recipe-details">
          <h2>
            <FaListAlt style={{ marginRight: '0.5rem' }} />
            Instructions
          </h2>
          {steps.length > 0 ? (
            <div className="instructions">
              {steps.map((step, index) => (
                <div key={index} className="instruction-step">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-text">{step}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No instructions available.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default RecipeDetails;