import React from "react";
import { useNavigate } from "react-router-dom";

const RecipeList = ({ meals }) => {
    const navigate = useNavigate();

    const handleCardClick = (id) => {
        navigate(`/recipe/${id}`);
    };

    return (
        <div className="meals-container">
            {meals && meals.length > 0 ? (
                meals.map((meal) => {
                    // Convert stringified arrays to actual arrays
                    const tags = meal.tags ? JSON.parse(meal.tags.replace(/'/g, '"')) : [];

                    return (
                        <div
                            key={meal.id}
                            className="meal-card"
                            onClick={() => handleCardClick(meal.id)}
                            style={{ cursor: "pointer" }}
                        >
                            {/* Recipe Name */}
                            <h3 className="meal-name">{meal.name || "Unnamed Recipe"}</h3>

                            <div className="filter-container justify-center">
                                {/* Cook Time */}
                                <p className="meal-info"><strong>Cook Time:</strong> {meal.minutes || "N/A"} min</p>

                                {/* Number of Ingredients */}
                                <p className="meal-info"><strong>Ingredients:</strong> {meal.numberOfIngredients || "N/A"}</p>

                                {/* Number of Steps */}
                                <p className="meal-info"><strong>Steps:</strong> {meal.numberOfSteps || "N/A"}</p>
                            </div>
                            {/* Tags Section */}
                            <div className="meal-tags">
                                {tags.length > 0 ? (
                                    tags.map((tag, index) => (
                                        <span key={index} className="recipe-tag">{tag}</span>
                                    ))
                                ) : (
                                    <span className="recipe-tag no-tags">No Tags</span>
                                )}
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="no-recipes">No meals found.</p>
            )}
        </div>
    );
};

export default RecipeList;