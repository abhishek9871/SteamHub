import { useState, useEffect, useCallback } from 'react';
import { tmdbApi } from '../services/tmdbApi';

export const useMovies = (fetchParams = {}) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true);
    setError(null);

    try {
      let response;

      // Handle different types of fetch parameters
      if (fetchParams.type === 'trending') {
        response = await tmdbApi.getTrending(fetchParams.timeWindow || 'day');
      } else if (fetchParams.type === 'popular') {
        response = await tmdbApi.getPopularMovies();
      } else if (fetchParams.type === 'top_rated') {
        response = await tmdbApi.getTopRatedMovies();
      } else if (fetchParams.type === 'now_playing') {
        response = await tmdbApi.getNowPlayingMovies();
      } else if (fetchParams.type === 'upcoming') {
        response = await tmdbApi.getUpcomingMovies();
      } else if (fetchParams.type === 'search' && fetchParams.query) {
        response = await tmdbApi.searchMovies(fetchParams.query, pageNum);
      } else if (fetchParams.type === 'similar' && fetchParams.movieId) {
        response = await tmdbApi.getSimilarMovies(fetchParams.movieId, pageNum);
      } else {
        // Default to popular movies
        response = await tmdbApi.getPopularMovies();
      }

      if (response && response.results) {
        if (append) {
          setMovies(prev => [...prev, ...response.results]);
        } else {
          setMovies(response.results);
        }

        setHasMore(pageNum < response.total_pages);
        setPage(pageNum);
      } else {
        setMovies([]);
        setHasMore(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch movies');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchParams]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchMovies(page + 1, true);
    }
  }, [fetchMovies, loading, hasMore, page]);

  const refresh = useCallback(() => {
    setPage(1);
    setHasMore(true);
    fetchMovies(1, false);
  }, [fetchMovies]);

  // Fetch movies when fetchParams change
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    movies,
    loading,
    error,
    hasMore,
    page,
    loadMore,
    refresh,
    fetchMovies
  };
};

export default useMovies;