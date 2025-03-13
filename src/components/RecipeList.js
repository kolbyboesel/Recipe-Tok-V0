import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserSettingsContext } from "./UserSettings";
import axios from "axios";
import { FaTrash, FaStar, FaRegStar, FaClock, FaListUl, FaCarrot } from 'react-icons/fa';

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

    if (!meals || meals.length === 0) {
        return (
            <div className="text-center" style={{ padding: "3rem 1rem" }}>
                <p>No recipes found.</p>
            </div>
        );
    }

    return (
        <div className="meals-container">
            {meals.map((meal) => {
                const tags = meal.tags ? JSON.parse(meal.tags.replace(/'/g, '"')) : [];
                const isFavorite = isFavorited(meal.recipeId);

                return (
                    <div
                        key={meal.recipeId || meal.id}
                        className="meal-card"
                        onClick={() => handleCardClick(meal.id)}
                    >
                        {/* Favorite Button */}
                        {userSettings.isLoggedIn && (
                            <button
                                className="favorite-btn"
                                onClick={(e) => toggleFavorite(e, meal.recipeId)}
                                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                {favoriteLoading === meal.recipeId ?
                                    "..." :
                                    (isFavorite ? <FaStar /> : <FaRegStar />)
                                }
                            </button>
                        )}

                        {/* Delete Button for Custom Recipes */}
                        {meal.createdBy === userSettings.loginID && (
                            <button
                                className="delete-btn"
                                onClick={(e) => handleDeleteClick(e, meal.id)}
                                title="Delete custom recipe"
                            >
                                <FaTrash />
                            </button>
                        )}

                        <div className="meal-card-content">
                            <h3 className="meal-name">{meal.name || "Unnamed Recipe"}</h3>

                            <div className="meal-info-grid">
                                <div className="meal-info">
                                    <span className="meal-info-label">Time</span>
                                    <span className="meal-info-value">
                                        <FaClock style={{ marginRight: '4px' }} />
                                        {meal.minutes || "N/A"}
                                    </span>
                                </div>

                                <div className="meal-info">
                                    <span className="meal-info-label">Ingredients</span>
                                    <span className="meal-info-value">
                                        <FaCarrot style={{ marginRight: '4px' }} />
                                        {meal.numberOfIngredients || "N/A"}
                                    </span>
                                </div>

                                <div className="meal-info">
                                    <span className="meal-info-label">Steps</span>
                                    <span className="meal-info-value">
                                        <FaListUl style={{ marginRight: '4px' }} />
                                        {meal.numberOfSteps || "N/A"}
                                    </span>
                                </div>
                            </div>

                            <div className="meal-tags">
                                {tags.length > 0 ? (
                                    tags.slice(0, 3).map((tag, index) => (
                                        <span key={index} className="recipe-tag">{tag}</span>
                                    ))
                                ) : (
                                    <span className="recipe-tag no-tags">No Tags</span>
                                )}
                                {tags.length > 3 && (
                                    <span className="recipe-tag" style={{ backgroundColor: 'var(--background-medium)', color: 'var(--text-secondary)' }}>+{tags.length - 3} more</span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RecipeList;