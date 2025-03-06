import React from "react";
import { useGlobalContext } from "../GlobalContext";

const categories = [
  "Beef",
  "Chicken",
  "Dessert",
  "Lamb",
  "Miscellaneous",
  "Pasta",
  "Pork",
  "Seafood",
  "Side",
  "Starter",
  "Vegan",
  "Vegetarian",
  "Breakfast",
  "Goat"
];

const CategoryDropdown = () => {
  const { searchTerm, setSearchTerm } = useGlobalContext();

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="category-dropdown">
      <label htmlFor="category-select">Category:</label>
      <select
        id="category-select"
        value={searchTerm}
        onChange={handleChange}
        className="dropdown-select"
      >
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryDropdown;