import { useState, useEffect, useCallback } from 'react';
import { tmdbApi } from '../services/tmdbApi';
import { searchStorage } from '../services/storage';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches on mount
  useEffect(() => {
    const loadRecentSearches = () => {
      try {
        const searches = searchStorage.get();
        setRecentSearches(searches);
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    };

    loadRecentSearches();
  }, []);

  const search = useCallback(async (searchQuery, searchType = 'multi') => {
    if (!searchQuery || !searchQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;

      if (searchType === 'movie') {
        response = await tmdbApi.searchMovies(searchQuery);
      } else if (searchType === 'tv') {
        response = await tmdbApi.searchTVShows(searchQuery);
      } else {
        // Multi-search (movies and TV shows)
        response = await tmdbApi.searchMulti(searchQuery);
      }

      if (response && response.results) {
        setResults(response.results);

        // Add to recent searches
        const updatedSearches = searchStorage.add(searchQuery);
        setRecentSearches(updatedSearches);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError(err.message || 'Search failed');
      setResults([]);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchMovies = useCallback((searchQuery) => {
    return search(searchQuery, 'movie');
  }, [search]);

  const searchTVShows = useCallback((searchQuery) => {
    return search(searchQuery, 'tv');
  }, [search]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  const clearRecentSearches = useCallback(() => {
    try {
      searchStorage.clear();
      setRecentSearches([]);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }, []);

  const removeRecentSearch = useCallback((searchTerm) => {
    try {
      const updatedSearches = recentSearches.filter(term => term !== searchTerm);
      setRecentSearches(updatedSearches);
      // Note: In a real implementation, you'd want to update storage here too
    } catch (error) {
      console.error('Error removing recent search:', error);
    }
  }, [recentSearches]);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      clearSearch();
      return;
    }

    const timeoutId = setTimeout(() => {
      search(query);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query, search, clearSearch]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    recentSearches,
    search,
    searchMovies,
    searchTVShows,
    clearSearch,
    clearRecentSearches,
    removeRecentSearch
  };
};

export default useSearch;