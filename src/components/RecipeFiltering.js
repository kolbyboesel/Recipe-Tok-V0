import React, { useState, useEffect } from "react";
import { FaFilter, FaTimes, FaSearch, FaSortAmountDown } from "react-icons/fa";

const RecipeFiltering = ({ searchTerm, setSearchTerm, filters, setFilters, sortBy, setSortBy, recipes }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const tagSet = new Set();
    recipes.forEach((recipe) => {
      if (recipe.tags) {
        const parsedTags = JSON.parse(recipe.tags.replace(/'/g, '"'));
        parsedTags.forEach((tag) => tagSet.add(tag));
      }
    });

    setAllTags(Array.from(tagSet).sort());
  }, [recipes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value ? parseInt(value, 10) : "",
    }));
  };

  const handleTagToggle = (tag) => {
    setFilters((prevFilters) => {
      const isSelected = prevFilters.tags.includes(tag);
      return {
        ...prevFilters,
        tags: isSelected
          ? prevFilters.tags.filter((t) => t !== tag)
          : [...prevFilters.tags, tag],
      };
    });
  };

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

  const hasActiveFilters = () => {
    return filters.minutes !== "" ||
      filters.numberOfSteps !== "" ||
      filters.numberOfIngredients !== "" ||
      filters.tags.length > 0 ||
      searchTerm !== "";
  };

  return (
    <div>
      <div className="filter-container-row">
        <div style={{ position: 'relative', flex: 1 }}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search recipes by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ paddingLeft: '40px' }}
          />
          {searchTerm && (
            <FaTimes
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
              onClick={() => setSearchTerm("")}
            />
          )}
        </div>

        <button
          className="filter-icon"
          style={{
            backgroundColor: showFilters
              ? 'var(--primary-light)'
              : hasActiveFilters()
                ? 'var(--accent-color)'
                : 'var(--primary-color)'
          }}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter />
          {hasActiveFilters() && (
            <div className="badge">
              {(filters.minutes !== "" ? 1 : 0) +
                (filters.numberOfSteps !== "" ? 1 : 0) +
                (filters.numberOfIngredients !== "" ? 1 : 0) +
                filters.tags.length}
            </div>
          )}
          <span>{showFilters ? "Hide Filters" : "Filters"}</span>
        </button>
      </div>

      {showFilters && (
        <div className="filter-container-column">
          <div className="filters-section">
            <div className="filter-group">
              <label>Max Cooking Time</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  name="minutes"
                  value={filters.minutes || ""}
                  onChange={handleFilterChange}
                  className="filter-input"
                  placeholder="Any time"
                />
                <span style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem'
                }}>min</span>
              </div>
            </div>

            <div className="filter-group">
              <label>Max Number of Steps</label>
              <input
                type="number"
                name="numberOfSteps"
                value={filters.numberOfSteps || ""}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="Any steps"
              />
            </div>

            <div className="filter-group">
              <label>Max Ingredients</label>
              <input
                type="number"
                name="numberOfIngredients"
                value={filters.numberOfIngredients || ""}
                onChange={handleFilterChange}
                className="filter-input"
                placeholder="Any ingredients"
              />
            </div>

            <div className="filter-group">
              <label>Sort Recipes By</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-input"
                  style={{
                    paddingRight: '30px',
                    appearance: 'none'
                  }}
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="minutes">Cooking Time (Fastest first)</option>
                  <option value="numberOfSteps">Number of Steps (Fewest first)</option>
                  <option value="numberOfIngredients">Number of Ingredients (Fewest first)</option>
                </select>
                <FaSortAmountDown style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)',
                  pointerEvents: 'none'
                }} />
              </div>
            </div>
          </div>

          <div className="tag-filter">
            <p className="filter-title">Recipe Tags</p>
            <div className="tag-list">
              {allTags.length > 0 ? (
                allTags.map((tag) => (
                  <label
                    key={tag}
                    className="tag-checkbox"
                    style={{
                      backgroundColor: filters.tags.includes(tag) ? 'var(--primary-color)' : 'var(--background-light)',
                      color: filters.tags.includes(tag) ? 'white' : 'var(--text-primary)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      style={{ display: 'none' }}
                    />
                    {tag}
                  </label>
                ))
              ) : (
                <p style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>No tags available</p>
              )}
            </div>
          </div>

          {filters.tags.length > 0 && (
            <div className="selected-tags">
              <p className="filter-title">Selected Tags:</p>
              {filters.tags.map((tag) => (
                <span key={tag} className="selected-tag" onClick={() => handleTagToggle(tag)}>
                  {tag} <FaTimes style={{ marginLeft: '5px', fontSize: '0.7rem' }} />
                </span>
              ))}
            </div>
          )}

          {hasActiveFilters() && (
            <button className="reset-button" onClick={resetFilters}>
              Reset All Filters <FaTimes />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeFiltering;