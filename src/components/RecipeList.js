import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../GlobalContext";
import { useNavigate } from "react-router-dom";
import Spinner from './LoadingSpinner';

const RecipeList = () => {
    const { searchTerm } = useGlobalContext();
    const [meals, setMeals] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMeals = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(
                    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchTerm}`
                );
                const data = await response.json();
                setMeals(data.meals || []);
            } catch (error) {
                console.error("Error fetching meals:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMeals();
    }, [searchTerm]);

    const handleCardClick = (idMeal) => {
        navigate(`/recipe/${idMeal}`);
    };

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="meals-container">
                    {meals.length > 0 ? (
                        meals.map((meal) => (
                            <div
                                key={meal.idMeal}
                                className="meal-card"
                                onClick={() => handleCardClick(meal.idMeal)}
                                style={{ cursor: "pointer" }}
                            >
                                <img
                                    src={meal.strMealThumb}
                                    alt={meal.strMeal}
                                    className="meal-image"
                                />
                                <p className="meal-name">{meal.strMeal}</p>
                            </div>
                        ))
                    ) : (
                        <p>No meals found for "{searchTerm}"</p>
                    )}
                </div>
            )}
        </>
    );
};

export default RecipeList;