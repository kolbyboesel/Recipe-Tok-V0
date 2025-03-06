import React, { useState, useEffect } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

const RecipeFiltering = ({ searchTerm, setSearchTerm, filters, setFilters, sortBy, setSortBy, recipes }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [allTags, setAllTags] = useState([]);

  // Extract unique tags from all recipes
  useEffect(() => {
    const tagSet = new Set();
    recipes.forEach((recipe) => {
      if (recipe.tags) {
        const parsedTags = JSON.parse(recipe.tags.replace(/'/g, '"'));
        parsedTags.forEach((tag) => tagSet.add(tag));
      }
    });

    setAllTags(Array.from(tagSet));
  }, [recipes]);

  // Handle numeric filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value ? parseInt(value, 10) : "",
    }));
  };

  // Handle tag selection
  const handleTagToggle = (tag) => {
    setFilters((prevFilters) => {
      const isSelected = prevFilters.tags.includes(tag);
      return {
        ...prevFilters,
        tags: isSelected
          ? prevFilters.tags.filter((t) => t !== tag) // Remove tag if selected
          : [...prevFilters.tags, tag], // Add tag if not selected
      };
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      minutes: "",
      numberOfSteps: "",
      numberOfIngredients: "",
      tags: [],
    });
    setSortBy("name");
    setSearchTerm("");
  };

  return (
    <>
      {/* Search Bar & Filter Icon */}
      <div className="filter-container-row">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <FaFilter className="filter-icon" onClick={() => setShowFilters(!showFilters)} />
      </div>

      {/* Filters Section (Hidden by Default, Toggled by Click) */}
      {showFilters && (
        <div className="filter-container-column">
          <div className="filters-section">
            <div className="filter-group">
              <label>Max Time (min):</label>
              <input
                type="number"
                name="minutes"
                value={filters.minutes || ""}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Max Steps:</label>
              <input
                type="number"
                name="numberOfSteps"
                value={filters.numberOfSteps || ""}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Max Ingredients:</label>
              <input
                type="number"
                name="numberOfIngredients"
                value={filters.numberOfIngredients || ""}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            {/* Sorting Options */}
            <div className="filter-group">
              <label>Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-input"
              >
                <option value="name">Name (A-Z)</option>
                <option value="minutes">Time (Ascending)</option>
                <option value="numberOfSteps">Steps (Ascending)</option>
                <option value="numberOfIngredients">Ingredients (Ascending)</option>
              </select>
            </div>
          </div>

          {/* Dynamic Multi-Select Tag Filter */}
          <div className="tag-filter">
            <p className="filter-title">Filter by Tags:</p>
            <div className="tag-list">
              {allTags.map((tag) => (
                <label key={tag} className="tag-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.tags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          {/* Selected Tags Display */}
          {filters.tags.length > 0 && (
            <div className="selected-tags">
              <p className="filter-title">Selected Tags:</p>
              {filters.tags.map((tag) => (
                <span key={tag} className="selected-tag" onClick={() => handleTagToggle(tag)}>
                  {tag} ✖
                </span>
              ))}
            </div>
          )}

          {/* Reset All Button */}
          <button className="reset-button" onClick={resetFilters}>
            Reset All <FaTimes />
          </button>
        </div>
      )}
    </>
  );
};

export default RecipeFiltering;