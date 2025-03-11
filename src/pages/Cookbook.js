import React, { useContext } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import MealsList from "../components/RecipeList";
import { UserSettingsContext } from '../../src/components/UserSettings';
import { useNavigate } from 'react-router-dom';

const Cookbook = () => {
    const { userRecipes, userFavorites } = useContext(UserSettingsContext);
    const navigate = useNavigate();

    const handleAddRecipe = () => {
        navigate('/AddRecipe');
    };
    return (
        <div className="container page">

            {/* Favorite Recipes */}
            <div className="page-content-container">
                <h3>Favorite Recipes</h3>
                <MealsList meals={userFavorites} />
            </div>
            <br></br>

            {/* Custom Recipes */}
            <div className="page-content-container">
                <div className="login-cancel">
                    <h3>Custom Recipes</h3>
                    <button className="add-recipe-btn" onClick={handleAddRecipe}><FaPlusCircle size={24} /></button>
                </div>
                <MealsList meals={userRecipes} />
            </div>
        </div>
    );
};

export default Cookbook;