import React, { createContext, useContext, useReducer, useEffect } from 'react';

const SettingsContext = createContext();

const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      const newSettings = { ...state, ...action.payload };
      localStorage.setItem('appSettings', JSON.stringify(newSettings));
      return newSettings;
    case 'LOAD_SETTINGS':
      return action.payload;
    default:
      return state;
  }
};

const defaultSettings = {
  theme: 'dark',
  region: 'IN',
  contentRating: 'all',
  autoplay: false,
  subtitles: true
};

export const SettingsProvider = ({ children }) => {
  const [settings, dispatch] = useReducer(settingsReducer, defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      dispatch({ type: 'LOAD_SETTINGS', payload: JSON.parse(savedSettings) });
    }
  }, []);

  const updateSettings = (newSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};