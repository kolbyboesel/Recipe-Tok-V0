import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const UserSettingsContext = createContext();

export const UserSettingsProvider = ({ children }) => {
  const [userSettings, setUserSettings] = useState(null);

  const defaultSettings = useMemo(() => ({
    loginID: 'defaultUser@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    isLoggedIn: false,
  }), []);

  const fetchUserSettings = useCallback(() => {
    // Try to get the settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      // If settings are found, use them
      setUserSettings(JSON.parse(savedSettings));
      console.log('Using stored user settings.');
    } else {
      // If no settings are found, set default settings
      console.log('No saved settings, using default settings.');
      setUserSettings(defaultSettings);
    }
  }, [defaultSettings]);

  useEffect(() => {
    fetchUserSettings();
  }, [fetchUserSettings]);

  const updateUserSettings = (settings) => {
    try {
      setUserSettings(settings);
      settings.isLoggedIn = true;

      localStorage.setItem('userSettings', JSON.stringify(settings));

      console.log('User settings updated locally');
    } catch (error) {
      console.error('Error occurred while updating user settings locally:', error);
    }
  };

  const settingsToProvide = userSettings || defaultSettings;

  return (
    <UserSettingsContext.Provider value={{ userSettings: settingsToProvide, updateUserSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
};