// UserSettings.js
import React, { createContext, useState, useEffect, useMemo } from 'react';

export const UserSettingsContext = createContext();

export const UserSettingsProvider = ({ children }) => {
  const [userSettings, setUserSettings] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);

  const defaultSettings = useMemo(() => ({
    loginID: 'defaultUser@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    isLoggedIn: false,
    profilePictureUrl: '',
    profilePictureBase64: ''
  }), []);

  const updateUserSettings = async (settings) => {
    try {
      const updated = {
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

  useEffect(() => {
    const fetchSettings = async () => {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);

          // Ensure isLoggedIn is explicitly set
          const settingsWithDefaults = {
            ...defaultSettings, // Start with defaults
            ...parsed, // Override with saved values
            isLoggedIn: Boolean(parsed.isLoggedIn) // Ensure boolean type
          };

          setUserSettings(settingsWithDefaults);

          // Only fetch recipes if user is logged in
          if (settingsWithDefaults.isLoggedIn && settingsWithDefaults.loginID) {
            try {
              // Load custom recipes
              const recipesRes = await fetch(`https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/recipes/get-custom/${settingsWithDefaults.loginID}`);
              const recipesData = await recipesRes.json();
              setUserRecipes(recipesData);

              // Load favorite recipe IDs
              const favoritesRes = await fetch(`https://soapscores-dvbnchand2byhvhc.centralus-01.azurewebsites.net/api/recipes/favorites-full/${settingsWithDefaults.loginID}`);
              const favoritesData = await favoritesRes.json();
              setUserFavorites(favoritesData);

              console.log('Restored user recipes and favorites after page reload');
            } catch (fetchError) {
              console.error('Error fetching user recipes/favorites:', fetchError);
            }
          }

          console.log('User settings loaded from localStorage', settingsWithDefaults);
        } catch (error) {
          console.error('Error parsing user settings from localStorage', error);
          setUserSettings(defaultSettings);
        }
      } else {
        setUserSettings(defaultSettings);
      }
    };

    fetchSettings();
  }, [defaultSettings]);

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