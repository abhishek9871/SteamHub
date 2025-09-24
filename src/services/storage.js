// localStorage utility service for watchlist and preferences

const STORAGE_KEYS = {
  WATCHLIST: 'vidsrc_watchlist',
  SETTINGS: 'vidsrc_settings',
  RECENT_SEARCHES: 'vidsrc_recent_searches'
};

// Watchlist storage functions
export const watchlistStorage = {
  get: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading watchlist from storage:', error);
      return [];
    }
  },

  set: (watchlist) => {
    try {
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
    } catch (error) {
      console.error('Error saving watchlist to storage:', error);
    }
  },

  add: (item) => {
    try {
      const current = watchlistStorage.get();
      const exists = current.find(watch => watch.id === item.id && watch.type === item.type);

      if (!exists) {
        const updated = [item, ...current];
        watchlistStorage.set(updated);
        return updated;
      }

      return current;
    } catch (error) {
      console.error('Error adding item to watchlist:', error);
      return watchlistStorage.get();
    }
  },

  remove: (itemId, itemType) => {
    try {
      const current = watchlistStorage.get();
      const updated = current.filter(item => !(item.id === itemId && item.type === itemType));
      watchlistStorage.set(updated);
      return updated;
    } catch (error) {
      console.error('Error removing item from watchlist:', error);
      return watchlistStorage.get();
    }
  },

  isInWatchlist: (itemId, itemType) => {
    try {
      const current = watchlistStorage.get();
      return current.some(item => item.id === itemId && item.type === itemType);
    } catch (error) {
      console.error('Error checking watchlist status:', error);
      return false;
    }
  }
};

// Settings storage functions
export const settingsStorage = {
  get: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : {
        theme: 'dark',
        region: 'IN',
        contentRating: 'all'
      };
    } catch (error) {
      console.error('Error reading settings from storage:', error);
      return {
        theme: 'dark',
        region: 'IN',
        contentRating: 'all'
      };
    }
  },

  set: (settings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to storage:', error);
    }
  },

  update: (key, value) => {
    try {
      const current = settingsStorage.get();
      const updated = { ...current, [key]: value };
      settingsStorage.set(updated);
      return updated;
    } catch (error) {
      console.error('Error updating settings:', error);
      return settingsStorage.get();
    }
  }
};

// Recent searches storage functions
export const searchStorage = {
  get: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading recent searches from storage:', error);
      return [];
    }
  },

  add: (searchTerm) => {
    try {
      const current = searchStorage.get();
      const trimmedTerm = searchTerm.trim();

      if (!trimmedTerm) return current;

      const filtered = current.filter(term => term !== trimmedTerm);
      const updated = [trimmedTerm, ...filtered].slice(0, 10); // Keep only 10 recent searches

      localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error adding search term to storage:', error);
      return searchStorage.get();
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }
};

// Clear all storage (for debugging/reset)
export const clearAllStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

export default {
  watchlistStorage,
  settingsStorage,
  searchStorage,
  clearAllStorage
};