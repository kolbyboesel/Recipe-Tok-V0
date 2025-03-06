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

    // Fetch recipes
    const fetchRecipes = async () => {
        try {
            const response = await axios.get(
                `https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/recipes/get-all`
            );
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

    // Filtering & Sorting Logic
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

        // Sorting Logic
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
    }, [searchTerm, filters, sortBy, recipes]);

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
                    recipes={recipes}  // Passes full dataset to extract unique tags
                />
            </div>
            <br />
            <div className='page-content-container'>
                <MealsList meals={filteredRecipes} />
            </div>
        </div>
    );
};

export default Home;