# 🍽️ RecipeTok

RecipeTok is a dynamic recipe discovery platform where users can explore, filter, and search for recipes based on cooking time, ingredients, steps, and tags. The site allows users to find and organize their favorite recipes with a clean, intuitive interface.

## 📖 Table of Contents
- [Features](#features)
- [How to Use](#how-to-use)
- [Dataset Source](#dataset-source)

---

## 🎯 Features
✅ **Search Recipes** – Search recipes by name in real-time.  
✅ **Advanced Filtering** – Filter recipes based on:
   - Cooking time (minutes)
   - Number of ingredients
   - Number of steps
   - Recipe tags (e.g., `Vegetarian`, `Holiday Event`, `Mexican`)  
✅ **Sorting Options** – Sort recipes by:
   - Name (A-Z)
   - Cooking time
   - Number of ingredients
   - Number of steps  
✅ **Detailed Recipe View** – View full recipe details including:
   - Ingredients
   - Cooking instructions
   - Tags
   - Description  
✅ **User-Friendly Interface** – Built with **React.js**, featuring a clean UI and interactive filtering options.  

---

## 🛠️ How to Use
1. **Search & Filter Recipes**  
   - Use the search bar to find recipes by name.  
   - Click the filter icon (🔍) to open advanced filters.  
   - Select filters for cooking time, ingredients, steps, or tags.  
   - Click a recipe to view full details.  

2. **View Recipe Details**  
   - Click on a recipe card to open the full recipe.  
   - View cooking time, ingredients, steps, and tags.  

3. **Reset Filters**  
   - Click **"Reset All"** to clear search and filters.  

---

## 📊 Dataset Source
The initial recipe dataset was sourced from **Kaggle**, specifically:  
📌 **[Food.com Recipes and User Interactions](https://www.kaggle.com/datasets/shuyangli94/food-com-recipes-and-user-interactions)**  

- This dataset contains **over 230,000 recipes** total with attributes such as:
  - Recipe name
  - Ingredients list
  - Cooking steps
  - User interactions and reviews
  - Cooking time
  - Tags and metadata  

🔹 The dataset is stored in **MongoDB** to power RecipeTok’s search and filtering functionalities.