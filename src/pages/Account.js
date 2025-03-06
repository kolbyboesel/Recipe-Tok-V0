import React, { useContext, useEffect, useState } from 'react';
import { UserSettingsContext } from '../../src/components/UserSettings';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlusCircle } from 'react-icons/fa';
import MealsList from "../components/RecipeList";

const Account = () => {
  const { updateUserSettings, userSettings } = useContext(UserSettingsContext);
  const navigate = useNavigate();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [customRecipes, setCustomRecipes] = useState([]);

  const [settings, setSettings] = useState({
    loginID: '',
    firstName: '',
    lastName: '',
    isLoggedIn: false
  });

  useEffect(() => {
    if (userSettings) {
      setSettings(userSettings);
      setFavoriteRecipes(userSettings.favoriteRecipes);
      setCustomRecipes(userSettings.customRecipes);
    }
  }, [userSettings]);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (confirmDelete) {
      try {
        const response = await axios.delete(`https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/RecipeTokUserSettings/delete/${settings.loginID}`);
        if (response.status === 200) {
          alert('Your account has been successfully deleted.');
          updateUserSettings({
            loginID: 'defaultUser',
            firstName: 'John',
            lastName: 'Doe',
            isLoggedIn: false
          });
          localStorage.removeItem('userSettings');
          navigate('/');
          window.location.reload();
        } else {
          alert('Error deleting account: ' + response.data);
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('An error occurred. Please try again later.');
      }
    }
  };

  const handleChangePassword = () => {
    navigate('/ChangePassword');
  };

  const handleAddRecipe = () => {
    navigate('/AddRecipe');
  };

  return (
    <div className="container page">
      {/* Profile Section */}
      <div className="page-content-container">
        <h2>Welcome, {settings.firstName || 'N/A'}!</h2>
        <div className="container text-center">
          <button className='m-3' onClick={handleChangePassword}>Change Password</button>
          <button className="bg-red m-3" onClick={handleDeleteAccount}>Delete Account</button>
        </div>
      </div>
      <br></br>

      {/* Favorite Recipes */}
      <div className="page-content-container">
        <h3>Favorite Recipes</h3>
        <MealsList meals={favoriteRecipes} />
      </div>
      <br></br>

      {/* Custom Recipes */}
      <div className="page-content-container">
        <div className="login-cancel">
          <h3>Custom Recipes</h3>
          <button className="add-recipe-btn" onClick={handleAddRecipe}><FaPlusCircle size={24} /></button>
        </div>
        <MealsList meals={customRecipes} />
      </div>
    </div>
  );
};

export default Account;