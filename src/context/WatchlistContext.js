import React, { createContext, useContext, useReducer, useEffect } from 'react';

const WatchlistContext = createContext();

const watchlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WATCHLIST':
      const newState = [...state, action.payload];
      localStorage.setItem('watchlist', JSON.stringify(newState));
      return newState;
    case 'REMOVE_FROM_WATCHLIST':
      const filteredState = state.filter(item => item.id !== action.payload.id);
      localStorage.setItem('watchlist', JSON.stringify(filteredState));
      return filteredState;
    case 'LOAD_WATCHLIST':
      return action.payload;
    default:
      return state;
  }
};

export const WatchlistProvider = ({ children }) => {
  const [watchlist, dispatch] = useReducer(watchlistReducer, []);

  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      dispatch({ type: 'LOAD_WATCHLIST', payload: JSON.parse(savedWatchlist) });
    }
  }, []);

  const addToWatchlist = (item) => {
    if (!watchlist.find(watchlistItem => watchlistItem.id === item.id)) {
      dispatch({ type: 'ADD_TO_WATCHLIST', payload: item });
    }
  };

  const removeFromWatchlist = (item) => {
    dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: item });
  };

  const isInWatchlist = (id) => {
    return watchlist.some(item => item.id === id);
  };

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};