import React, { useState, useEffect } from 'react';
import RecipeFiltering from "../components/RecipeFiltering";
import MealsList from "../components/RecipeList";
import Spinner from '../components/LoadingSpinner';
import axios from 'axios';

const Home = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        minutes: "",
        numberOfSteps: "",
        numberOfIngredients: "",
        tags: [],
    });
    const [sortBy, setSortBy] = useState("name");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [recipesPerPage, setRecipesPerPage] = useState(12); // adjustable by user

    const fetchRecipes = async () => {
        try {
            const response = await axios.get(`https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/recipes/get-all`);
            if (response.status === 200) {
                setRecipes(response.data);
                setFilteredRecipes(response.data);
            } else {
                console.log("No recipes found.");
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    useEffect(() => {
        let filtered = recipes.filter(recipe => {
            const nameMatches = recipe.name && recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
            const timeMatches = filters.minutes ? recipe.minutes <= filters.minutes : true;
            const stepsMatch = filters.numberOfSteps ? recipe.numberOfSteps <= filters.numberOfSteps : true;
            const ingredientsMatch = filters.numberOfIngredients ? recipe.numberOfIngredients <= filters.numberOfIngredients : true;
            const tagsMatch =
                filters.tags.length === 0 ||
                (recipe.tags &&
                    JSON.parse(recipe.tags.replace(/'/g, '"')).some(tag => filters.tags.includes(tag)));
            return nameMatches && timeMatches && stepsMatch && ingredientsMatch && tagsMatch;
        });

        filtered = filtered.sort((a, b) => {
            switch (sortBy) {
                case "minutes":
                    return a.minutes - b.minutes;
                case "numberOfSteps":
                    return a.numberOfSteps - b.numberOfSteps;
                case "numberOfIngredients":
                    return a.numberOfIngredients - b.numberOfIngredients;
                case "name":
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        setFilteredRecipes(filtered);
        setCurrentPage(1);
    }, [searchTerm, filters, sortBy, recipes]);

    // Pagination Logic
    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

    const handlePageChange = (pageNum) => setCurrentPage(pageNum);
    const handleRecipesPerPageChange = (e) => {
        setRecipesPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    if (isLoading) return <Spinner />;

    return (
        <div className='container page'>
            <div className='page-content-container'>
                <RecipeFiltering
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filters={filters}
                    setFilters={setFilters}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    recipes={recipes}
                />
            </div>

            <div className='page-content-container'>
                <MealsList meals={currentRecipes} />

                {filteredRecipes.length > 0 && currentRecipes.length === 0 && (
                    <div className="text-center" style={{ padding: '2rem' }}>
                        <p>No recipes match your current filters.</p>
                    </div>
                )}

                {filteredRecipes.length === 0 && (
                    <div className="text-center" style={{ padding: '2rem' }}>
                        <p>No recipes found. Try adding some recipes or adjusting your filters.</p>
                    </div>
                )}
            </div>

            {filteredRecipes.length > 0 && (
                <div className="page-settings">
                    <div className="recipes-per-page">
                        <label>
                            Recipes per page:{" "}
                            <select value={recipesPerPage} onChange={handleRecipesPerPageChange}>
                                <option value={6}>6</option>
                                <option value={12}>12</option>
                                <option value={24}>24</option>
                                <option value={48}>48</option>
                            </select>
                        </label>
                    </div>

                    <div className="pagination-controls">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </button>

                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={currentPage === pageNum ? "active-page" : ""}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;