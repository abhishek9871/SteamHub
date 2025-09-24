import { useState, useEffect, useCallback } from 'react';
import { watchlistStorage } from '../services/storage';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load watchlist from storage on mount
  useEffect(() => {
    const loadWatchlist = () => {
      setLoading(true);
      try {
        const storedWatchlist = watchlistStorage.get();
        setWatchlist(storedWatchlist);
      } catch (error) {
        console.error('Error loading watchlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWatchlist();
  }, []);

  const addToWatchlist = useCallback((item) => {
    try {
      const updatedWatchlist = watchlistStorage.add(item);
      setWatchlist(updatedWatchlist);
      return true;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      return false;
    }
  }, []);

  const removeFromWatchlist = useCallback((itemId, itemType) => {
    try {
      const updatedWatchlist = watchlistStorage.remove(itemId, itemType);
      setWatchlist(updatedWatchlist);
      return true;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return false;
    }
  }, []);

  const isInWatchlist = useCallback((itemId, itemType) => {
    return watchlistStorage.isInWatchlist(itemId, itemType);
  }, [watchlist]);

  const toggleWatchlist = useCallback((item) => {
    const isCurrentlyInWatchlist = isInWatchlist(item.id, item.type);

    if (isCurrentlyInWatchlist) {
      return removeFromWatchlist(item.id, item.type);
    } else {
      return addToWatchlist(item);
    }
  }, [addToWatchlist, removeFromWatchlist, isInWatchlist]);

  const clearWatchlist = useCallback(() => {
    try {
      // Clear from storage
      const emptyWatchlist = [];
      watchlistStorage.set(emptyWatchlist);
      setWatchlist(emptyWatchlist);
      return true;
    } catch (error) {
      console.error('Error clearing watchlist:', error);
      return false;
    }
  }, []);

  const getWatchlistStats = useCallback(() => {
    const movies = watchlist.filter(item => item.type === 'movie').length;
    const tvShows = watchlist.filter(item => item.type === 'tv').length;

    return {
      total: watchlist.length,
      movies,
      tvShows
    };
  }, [watchlist]);

  return {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    clearWatchlist,
    getWatchlistStats
  };
};

export default useWatchlist;