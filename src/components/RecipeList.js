import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserSettingsContext } from "./UserSettings";
import axios from "axios";
import { FaTrash } from 'react-icons/fa';

const RecipeList = ({ meals, setMeals }) => {
    const navigate = useNavigate();
    const { userSettings, updateUserSettings, userFavorites, setUserFavorites } = useContext(UserSettingsContext);

    const [favoriteLoading, setFavoriteLoading] = useState(null);

    const handleCardClick = (id) => {
        navigate(`/recipe/${id}`);
    };

    const isFavorited = (recipeId) => {
        return userFavorites?.some((fav) => String(fav.recipeId) === String(recipeId));
    };

    const toggleFavorite = async (e, recipeId) => {
        e.stopPropagation();
        if (!userSettings?.loginID) return;

        setFavoriteLoading(recipeId);
        const alreadyFavorited = isFavorited(recipeId);

        try {
            if (alreadyFavorited) {
                await axios.delete("https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/recipeFavorites/remove", {
                    data: { userId: userSettings.loginID, recipeId }
                });
                setUserFavorites(userFavorites.filter((r) => String(r.recipeId) !== String(recipeId)));
            } else {
                await axios.post("https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/recipeFavorites/add", {
                    UserId: userSettings.loginID,
                    RecipeId: recipeId
                });
                const addedRecipe = meals.find((m) => m.recipeId === recipeId);
                if (addedRecipe) {
                    setUserFavorites([...userFavorites, addedRecipe]);
                }
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
        } finally {
            setFavoriteLoading(null);
        }
    };

    const handleDeleteClick = async (e, recipeId) => {
        e.stopPropagation();
        const confirmed = window.confirm("Are you sure you want to delete this custom recipe?");
        if (!confirmed) return;

        try {
            await axios.delete(`https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/recipes/delete/${recipeId}`);
            await updateUserSettings(userSettings); // refresh userRecipes and userFavorites
        } catch (error) {
            console.error("Error deleting recipe:", error);
            alert("Failed to delete recipe.");
        }
    };

    return (
        <div className="meals-container">
            {meals && meals.length > 0 ? (
                meals.map((meal) => {
                    const tags = meal.tags ? JSON.parse(meal.tags.replace(/'/g, '"')) : [];

                    return (
                        <div
                            key={meal.recipeId}
                            className="meal-card"
                            onClick={() => handleCardClick(meal.id)}
                            style={{ cursor: "pointer", position: "relative" }}
                        >
                            {/* Star Favorite */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: meal.createdBy === userSettings.loginID ? "40px" : "15px",
                                    fontSize: "24px",
                                    color: isFavorited(meal.recipeId) ? "gold" : "lightgray",
                                    cursor: "pointer",
                                    zIndex: 2,
                                }}
                                onClick={(e) => toggleFavorite(e, meal.recipeId)}
                                title={isFavorited(meal.recipeId) ? "Remove from favorites" : "Add to favorites"}
                            >
                                {favoriteLoading === meal.recipeId ? "..." : isFavorited(meal.recipeId) ? "★" : "☆"}
                            </div>

                            {/* Trash Icon for Custom Recipes */}
                            {meal.createdBy === userSettings.loginID && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        fontSize: "20px",
                                        color: "crimson",
                                        cursor: "pointer",
                                        zIndex: 3,
                                    }}
                                    title="Delete custom recipe"
                                    onClick={(e) => handleDeleteClick(e, meal.id)}
                                >
                                    <FaTrash size={24} />
                                </div>
                            )}

                            {/* Recipe Name */}
                            <h3 className="meal-name">{meal.name || "Unnamed Recipe"}</h3>

                            <div className="filter-container justify-center">
                                <p className="meal-info"><strong>Cook Time:</strong> {meal.minutes || "N/A"} min</p>
                                <p className="meal-info"><strong>Ingredients:</strong> {meal.numberOfIngredients || "N/A"}</p>
                                <p className="meal-info"><strong>Steps:</strong> {meal.numberOfSteps || "N/A"}</p>
                            </div>

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