import axios from 'axios';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Validate API key
if (!TMDB_API_KEY) {
  throw new Error('TMDB API key is missing. Please check your .env file and ensure REACT_APP_TMDB_API_KEY is set.');
}

// Create axios instance with default config
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US'
  }
});

// Request interceptor for error handling
tmdbApi.interceptors.response.use(
  (response) => {
    // Validate response structure
    if (!response.data) {
      console.error('TMDB API Error: Empty response received');
      throw new Error('Empty response from TMDB API');
    }
    return response;
  },
  (error) => {
    console.error('TMDB API Error:', error);

    // Handle different error types
    if (error.response?.status === 400) {
      console.error('TMDB API Error: Bad request. Check API parameters.');
      throw new Error('Invalid request parameters');
    } else if (error.response?.status === 401) {
      console.error('TMDB API Error: Invalid API key. Please check your TMDB API key.');
      throw new Error('Invalid API key');
    } else if (error.response?.status === 404) {
      console.error('TMDB API Error: Resource not found.');
      throw new Error('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('TMDB API Error: Server error. Please try again later.');
      throw new Error('Server error');
    } else if (!error.response) {
      console.error('TMDB API Error: Network error. Please check your internet connection.');
      throw new Error('Network error');
    }

    return Promise.reject(error);
  }
);

// Helper function to build image URLs
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '/placeholder-image.jpg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Helper function to format movie/TV data
const formatMediaItem = (item, type) => ({
  id: item.id,
  title: type === 'movie' ? item.title : item.name,
  originalTitle: type === 'movie' ? item.original_title : item.original_name,
  overview: item.overview,
  posterPath: item.poster_path,
  backdropPath: item.backdrop_path,
  releaseDate: type === 'movie' ? item.release_date : item.first_air_date,
  voteAverage: item.vote_average,
  voteCount: item.vote_count,
  genreIds: item.genre_ids,
  genres: item.genres,
  runtime: item.runtime,
  type: type,
  popularity: item.popularity,
  adult: item.adult
});

// Movies API
export const moviesApi = {
  // Get popular movies
  getPopular: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/popular', { params: { page } });

      // Validate response structure
      if (!response.data || !Array.isArray(response.data.results)) {
        console.error('Invalid response structure for popular movies:', response.data);
        throw new Error('Invalid response from TMDB API');
      }

      return {
        ...response.data,
        results: response.data.results.map(movie => formatMediaItem(movie, 'movie'))
      };
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      if (error.message === 'Invalid API key') {
        throw new Error('Unable to load popular movies. Please check your TMDB API key configuration.');
      } else if (error.message === 'Invalid request parameters') {
        throw new Error('Unable to load popular movies. Invalid request parameters.');
      }
      throw new Error('Unable to load popular movies. Please try again later.');
    }
  },

  // Get top rated movies
  getTopRated: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/top_rated', { params: { page } });

      // Validate response structure
      if (!response.data || !Array.isArray(response.data.results)) {
        console.error('Invalid response structure for top rated movies:', response.data);
        throw new Error('Invalid response from TMDB API');
      }

      return {
        ...response.data,
        results: response.data.results.map(movie => formatMediaItem(movie, 'movie'))
      };
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      if (error.message === 'Invalid API key') {
        throw new Error('Unable to load top rated movies. Please check your TMDB API key configuration.');
      } else if (error.message === 'Invalid request parameters') {
        throw new Error('Unable to load top rated movies. Invalid request parameters.');
      }
      throw new Error('Unable to load top rated movies. Please try again later.');
    }
  },

  // Get now playing movies
  getNowPlaying: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/movie/now_playing', { params: { page } });
      return {
        ...response.data,
        results: response.data.results.map(movie => formatMediaItem(movie, 'movie'))
      };
    } catch (error) {
      throw new Error('Failed to fetch now playing movies');
    }
  },

  // Get movie details
  getDetails: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}`);
      return formatMediaItem(response.data, 'movie');
    } catch (error) {
      throw new Error('Failed to fetch movie details');
    }
  },

  // Get movie credits
  getCredits: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/credits`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch movie credits');
    }
  },

  // Get similar movies
  getSimilar: async (movieId, page = 1) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/similar`, { params: { page } });
      return {
        ...response.data,
        results: response.data.results.map(movie => formatMediaItem(movie, 'movie'))
      };
    } catch (error) {
      throw new Error('Failed to fetch similar movies');
    }
  },

  // Get external IDs for movie (for IMDb ID fallback on embeds)
  getExternalIds: async (movieId) => {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}/external_ids`);
      return response.data; // contains imdb_id
    } catch (error) {
      throw new Error('Failed to fetch movie external IDs');
    }
  }
};

// TV Shows API
export const tvApi = {
  // Get popular TV shows
  getPopular: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/tv/popular', { params: { page } });

      // Validate response structure
      if (!response.data || !Array.isArray(response.data.results)) {
        console.error('Invalid response structure for popular TV shows:', response.data);
        throw new Error('Invalid response from TMDB API');
      }

      return {
        ...response.data,
        results: response.data.results.map(tv => formatMediaItem(tv, 'tv'))
      };
    } catch (error) {
      console.error('Error fetching popular TV shows:', error);
      if (error.message === 'Invalid API key') {
        throw new Error('Unable to load popular TV shows. Please check your TMDB API key configuration.');
      } else if (error.message === 'Invalid request parameters') {
        throw new Error('Unable to load popular TV shows. Invalid request parameters.');
      }
      throw new Error('Unable to load popular TV shows. Please try again later.');
    }
  },

  // Get top rated TV shows
  getTopRated: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/tv/top_rated', { params: { page } });

      // Validate response structure
      if (!response.data || !Array.isArray(response.data.results)) {
        console.error('Invalid response structure for top rated TV shows:', response.data);
        throw new Error('Invalid response from TMDB API');
      }

      return {
        ...response.data,
        results: response.data.results.map(tv => formatMediaItem(tv, 'tv'))
      };
    } catch (error) {
      console.error('Error fetching top rated TV shows:', error);
      if (error.message === 'Invalid API key') {
        throw new Error('Unable to load top rated TV shows. Please check your TMDB API key configuration.');
      } else if (error.message === 'Invalid request parameters') {
        throw new Error('Unable to load top rated TV shows. Invalid request parameters.');
      }
      throw new Error('Unable to load top rated TV shows. Please try again later.');
    }
  },

  // Get airing today TV shows
  getAiringToday: async (page = 1) => {
    try {
      const response = await tmdbApi.get('/tv/airing_today', { params: { page } });
      return {
        ...response.data,
        results: response.data.results.map(tv => formatMediaItem(tv, 'tv'))
      };
    } catch (error) {
      throw new Error('Failed to fetch airing today TV shows');
    }
  },

  // Get TV show details
  getDetails: async (tvId) => {
    try {
      const response = await tmdbApi.get(`/tv/${tvId}`);
      return formatMediaItem(response.data, 'tv');
    } catch (error) {
      throw new Error('Failed to fetch TV show details');
    }
  },

  // Get external IDs for TV show (for IMDb ID fallback on embeds)
  getExternalIds: async (tvId) => {
    try {
      const response = await tmdbApi.get(`/tv/${tvId}/external_ids`);
      return response.data; // contains imdb_id
    } catch (error) {
      throw new Error('Failed to fetch TV external IDs');
    }
  },

  // Get TV show credits
  getCredits: async (tvId) => {
    try {
      const response = await tmdbApi.get(`/tv/${tvId}/credits`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch TV show credits');
    }
  },

  // Get similar TV shows
  getSimilar: async (tvId, page = 1) => {
    try {
      const response = await tmdbApi.get(`/tv/${tvId}/similar`, { params: { page } });
      return {
        ...response.data,
        results: response.data.results.map(tv => formatMediaItem(tv, 'tv'))
      };
    } catch (error) {
      throw new Error('Failed to fetch similar TV shows');
    }
  },

  // Get TV show seasons
  getSeasons: async (tvId) => {
    try {
      const response = await tmdbApi.get(`/tv/${tvId}`);
      return response.data.seasons;
    } catch (error) {
      throw new Error('Failed to fetch TV show seasons');
    }
  },

  // Get season details
  getSeasonDetails: async (tvId, seasonNumber) => {
    try {
      const response = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch season details');
    }
  }
};

// Search API
export const searchApi = {
  // Search for movies and TV shows
  search: async (query, page = 1) => {
    try {
      const response = await tmdbApi.get('/search/multi', {
        params: { query, page, include_adult: false }
      });

      // Separate movies and TV shows
      const movies = response.data.results
        .filter(item => item.media_type === 'movie')
        .map(movie => formatMediaItem(movie, 'movie'));

      const tvShows = response.data.results
        .filter(item => item.media_type === 'tv')
        .map(tv => formatMediaItem(tv, 'tv'));

      return {
        ...response.data,
        results: [...movies, ...tvShows]
      };
    } catch (error) {
      throw new Error('Failed to search content');
    }
  },

  // Search movies only
  searchMovies: async (query, page = 1) => {
    try {
      const response = await tmdbApi.get('/search/movie', {
        params: { query, page, include_adult: false }
      });
      return {
        ...response.data,
        results: response.data.results.map(movie => formatMediaItem(movie, 'movie'))
      };
    } catch (error) {
      throw new Error('Failed to search movies');
    }
  },

  // Search TV shows only
  searchTV: async (query, page = 1) => {
    try {
      const response = await tmdbApi.get('/search/tv', {
        params: { query, page, include_adult: false }
      });
      return {
        ...response.data,
        results: response.data.results.map(tv => formatMediaItem(tv, 'tv'))
      };
    } catch (error) {
      throw new Error('Failed to search TV shows');
    }
  }
};

// Genres API
export const genresApi = {
  // Get movie genres
  getMovieGenres: async () => {
    try {
      const response = await tmdbApi.get('/genre/movie/list');
      return response.data.genres;
    } catch (error) {
      throw new Error('Failed to fetch movie genres');
    }
  },

  // Get TV genres
  getTVGenres: async () => {
    try {
      const response = await tmdbApi.get('/genre/tv/list');
      return response.data.genres;
    } catch (error) {
      throw new Error('Failed to fetch TV genres');
    }
  }
};

// Trending API
export const trendingApi = {
  // Get trending movies and TV shows
  getAll: async (timeWindow = 'week', page = 1) => {
    try {
      const response = await tmdbApi.get(`/trending/all/${timeWindow}`, { params: { page } });

      // Validate response structure
      if (!response.data || !Array.isArray(response.data.results)) {
        console.error('Invalid response structure for trending content:', response.data);
        throw new Error('Invalid response from TMDB API');
      }

      // Separate movies and TV shows
      const movies = response.data.results
        .filter(item => item.media_type === 'movie')
        .map(movie => formatMediaItem(movie, 'movie'));

      const tvShows = response.data.results
        .filter(item => item.media_type === 'tv')
        .map(tv => formatMediaItem(tv, 'tv'));

      return {
        ...response.data,
        results: [...movies, ...tvShows]
      };
    } catch (error) {
      console.error('Error fetching trending content:', error);
      if (error.message === 'Invalid API key') {
        throw new Error('Unable to load trending content. Please check your TMDB API key configuration.');
      } else if (error.message === 'Invalid request parameters') {
        throw new Error('Unable to load trending content. Invalid request parameters.');
      }
      throw new Error('Failed to fetch trending content. Please try again later.');
    }
  },

  // Get trending movies
  getMovies: async (timeWindow = 'week', page = 1) => {
    try {
      const response = await tmdbApi.get(`/trending/movie/${timeWindow}`, { params: { page } });
      return {
        ...response.data,
        results: response.data.results.map(movie => formatMediaItem(movie, 'movie'))
      };
    } catch (error) {
      throw new Error('Failed to fetch trending movies');
    }
  },

  // Get trending TV shows
  getTV: async (timeWindow = 'week', page = 1) => {
    try {
      const response = await tmdbApi.get(`/trending/tv/${timeWindow}`, { params: { page } });
      return {
        ...response.data,
        results: response.data.results.map(tv => formatMediaItem(tv, 'tv'))
      };
    } catch (error) {
      throw new Error('Failed to fetch trending TV shows');
    }
  }
};

export default tmdbApi;