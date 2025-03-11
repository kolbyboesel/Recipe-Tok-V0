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
    profilePictureUrl: '',
    profilePictureBase64: ''
  }), []);

  const fetchUserSettings = useCallback(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);

      // Ensure profile picture fields exist even if missing in old data
      const settingsWithDefaults = {
        ...defaultSettings,
        ...parsed,
        profilePic: parsed.profilePic || ''
      };

      setUserSettings(settingsWithDefaults);
    } else {
      setUserSettings(defaultSettings);
    }
  }, [defaultSettings]);

  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  const updateUserSettings = async (settings) => {
    try {
      const updated = {
        ...defaultSettings,
        ...settings,
        isLoggedIn: true,
        profilePic: settings.profilePic || ''
      };

      setUserSettings(updated);
      localStorage.setItem('userSettings', JSON.stringify(updated));

      // Load custom recipes
      const recipesRes = await fetch(`https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/recipes/get-custom/${updated.loginID}`);
      const recipesData = await recipesRes.json();
      setUserRecipes(recipesData);

      // Load favorite recipe IDs
      const favoritesRes = await fetch(`https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/recipes/favorites-full/${updated.loginID}`);
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