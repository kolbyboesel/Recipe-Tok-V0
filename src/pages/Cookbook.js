import React, { useContext, useState } from 'react';
import { FaPlusCircle, FaBookOpen, FaStar, FaUtensils, FaSearch } from 'react-icons/fa';
import MealsList from "../components/RecipeList";
import { UserSettingsContext } from '../../src/components/UserSettings';
import { useNavigate } from 'react-router-dom';

const Cookbook = () => {
    const { userRecipes, userFavorites, userSettings } = useContext(UserSettingsContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('favorites');
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddRecipe = () => {
        navigate('/AddRecipe');
    };

    // Filter recipes based on search term
    const filteredFavorites = userFavorites?.filter(recipe =>
        recipe?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const filteredCustomRecipes = userRecipes?.filter(recipe =>
        recipe?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="container page">
            <div className="page-content-container">
                <div className="cookbook-header">
                    <h2 className="cookbook-title">
                        <FaBookOpen /> My Cookbook
                    </h2>

                    <div className="cookbook-controls">
                        <div className="search-wrapper">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search your recipes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input search-input-padded"
                            />
                        </div>

                        <button
                            className="add-button"
                            onClick={handleAddRecipe}
                        >
                            <FaPlusCircle /> Add Recipe
                        </button>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="tabs-navigation">
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`tab-button ${activeTab === 'favorites' ? 'tab-active' : 'tab-inactive'}`}
                    >
                        <FaStar /> Favorites
                        <span className={`tab-badge ${activeTab === 'favorites' ? 'tab-badge-active' : 'tab-badge-inactive'}`}>
                            {filteredFavorites.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('custom')}
                        className={`tab-button ${activeTab === 'custom' ? 'tab-active' : 'tab-inactive'}`}
                    >
                        <FaUtensils /> My Recipes
                        <span className={`tab-badge ${activeTab === 'custom' ? 'tab-badge-active' : 'tab-badge-inactive'}`}>
                            {filteredCustomRecipes.length}
                        </span>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'favorites' ? (
                        <div className="fade-in">
                            {!userSettings.isLoggedIn ? (
                                <div className="empty-state">
                                    <h3 className="empty-state-title">
                                        Please log in to save your favorite recipes
                                    </h3>
                                    <button
                                        onClick={() => navigate('/Login')}
                                        className="action-button"
                                    >
                                        Log In
                                    </button>
                                </div>
                            ) : filteredFavorites.length === 0 ? (
                                <div className="empty-state">
                                    <FaStar className="empty-state-icon empty-state-icon-accent" />
                                    <h3 className="empty-state-title">
                                        No Favorite Recipes Yet
                                    </h3>
                                    <p className="empty-state-text">
                                        Browse recipes and click the star icon to add them to your favorites.
                                    </p>
                                </div>
                            ) : (
                                <MealsList meals={filteredFavorites} />
                            )}
                        </div>
                    ) : (
                        <div className="fade-in">
                            {!userSettings.isLoggedIn ? (
                                <div className="empty-state">
                                    <h3 className="empty-state-title">
                                        Please log in to create your own recipes
                                    </h3>
                                    <button
                                        onClick={() => navigate('/Login')}
                                        className="action-button"
                                    >
                                        Log In
                                    </button>
                                </div>
                            ) : filteredCustomRecipes.length === 0 ? (
                                <div className="empty-state">
                                    <FaUtensils className="empty-state-icon empty-state-icon-primary" />
                                    <h3 className="empty-state-title">
                                        No Custom Recipes Yet
                                    </h3>
                                    <p className="empty-state-text mb-3">
                                        Create your own recipes to keep track of your culinary creations.
                                    </p>
                                    <button
                                        onClick={handleAddRecipe}
                                        className="add-button empty-state-button"
                                    >
                                        <FaPlusCircle /> Add First Recipe
                                    </button>
                                </div>
                            ) : (
                                <MealsList meals={filteredCustomRecipes} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cookbook;