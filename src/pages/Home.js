import React from 'react';
import CategoryDropdown from "../components/CategoryDropdown";
import MealsList from "../components/RecipeList";

const Home = () => {
    return (
        <div className='container page'>
            <div className='page-content-container'>
                <CategoryDropdown />
            </div>
            <br></br>
            <div className='page-content-container'>
                <MealsList />
            </div>
        </div>
    );
};

export default Home;