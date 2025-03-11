// UserSettings.js
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const UserSettingsContext = createContext();

export const UserSettingsProvider = ({ children }) => {
  const [userSettings, setUserSettings] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userSettings?.loginID) {
        try {
          const recipesRes = await fetch(`https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/recipes/get-custom/${userSettings.loginID}`);
          const recipesData = await recipesRes.json();
          setUserRecipes(recipesData);

          const favoritesRes = await fetch(`https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/recipes/favorites-full/${userSettings.loginID}`);
          const favoritesData = await favoritesRes.json();
          setUserFavorites(favoritesData);

          console.log('Reloaded user recipes and favorites after refresh');
        } catch (err) {
          console.error('Error reloading user data:', err);
        }
      }
    };

    fetchUserData();
  }, [userSettings?.loginID]);

  const defaultSettings = useMemo(() => ({
    loginID: 'defaultUser@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    isLoggedIn: false,
  }), []);

  const fetchUserSettings = useCallback(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setUserSettings(JSON.parse(savedSettings));
    } else {
      setUserSettings(defaultSettings);
    }
  }, [defaultSettings]);

  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  const updateUserSettings = async (settings) => {
    try {
      settings.isLoggedIn = true;
      setUserSettings(settings);
      localStorage.setItem('userSettings', JSON.stringify(settings));

      // Load custom recipes
      const recipesRes = await fetch(`https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/recipes/get-custom/${settings.loginID}`);
      const recipesData = await recipesRes.json();
      setUserRecipes(recipesData);

      // Load favorite recipe IDs
      const favoritesRes = await fetch(`https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/recipes/favorites-full/${settings.loginID}`);
      const favoritesData = await favoritesRes.json();
      setUserFavorites(favoritesData);

      console.log('Loaded user recipes and favorites into context');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const settingsToProvide = userSettings || defaultSettings;

  return (
    <UserSettingsContext.Provider value={{
      userSettings: settingsToProvide,
      updateUserSettings,
      userRecipes,
      setUserRecipes,
      userFavorites,
      setUserFavorites
    }}>
      {children}
    </UserSettingsContext.Provider>
  );
};