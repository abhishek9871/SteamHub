# Sprint 1-5: Foundation & Core Infrastructure

---

## SPRINT 1: Foundation & Core Setup

**Goal:** Set up project structure, design system, and core utilities

### Task 1.1: Project Initialization

**Description:** Create React app with all required dependencies

**Steps:**
1. Create new React app: `npx create-react-app steamhub`
2. Install dependencies:
```bash
npm install react-router-dom@6 axios react-toastify react-icons
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. Create folder structure exactly as specified in PRD_OVERVIEW.md

4. Configure Tailwind (`tailwind.config.js`):
```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E50914',
          hover: '#B20710',
        },
        accent: '#00A8E8',
        dark: {
          100: '#0A0E14',
          200: '#141821',
          300: '#1A1F2E',
          400: '#242938',
        },
      },
    },
  },
  plugins: [],
};
```

5. Create `.env.example`:
```env
REACT_APP_TMDB_API_KEY=your_api_key_here
```

**Deliverables:**
- ✅ Clean project structure
- ✅ All dependencies installed
- ✅ Tailwind configured
- ✅ Environment variables template

---

### Task 1.2: Design System Implementation

**Description:** Create global styles with design tokens

**Create `src/styles/globals.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap');

:root {
  /* Colors */
  --bg-primary: #0A0E14;
  --bg-secondary: #141821;
  --surface: #1A1F2E;
  --surface-hover: #242938;
  --accent-primary: #E50914;
  --accent-secondary: #00A8E8;
  --text-primary: #FFFFFF;
  --text-secondary: #A0AEC0;
  --text-muted: #718096;
  --success: #10B981;
  --error: #EF4444;
  --warning: #F59E0B;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.2);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.3);
  --shadow-glow: 0 0 20px rgba(229, 9, 20, 0.4);
  
  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  line-height: 1.2;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--surface-hover);
  border-radius: var(--radius-sm);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Focus Styles */
*:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

/* Utility Classes */
.gradient-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-overlay {
  background: linear-gradient(to top, rgba(10, 14, 20, 1) 0%, transparent 100%);
}

.backdrop-blur {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Loading Skeleton */
.skeleton {
  background: linear-gradient(90deg, var(--surface) 25%, var(--surface-hover) 50%, var(--surface) 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

/* Responsive */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}
```

**Deliverables:**
- ✅ Complete design system in globals.css
- ✅ Typography loaded from Google Fonts
- ✅ Utility classes defined

---

### Task 1.3: Core Utilities & Constants

**Create `src/utils/constants.js`:**
```javascript
// API Configuration
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Image Sizes
export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
  },
};

// VidSrc Configuration
export const VIDSRC_BASE_URL = 'https://vidsrc.cc/v2/embed';
export const VIDSRC_PARAMS = {
  autoplay: '1',
  autonext: '1',
};

// App Configuration
export const APP_NAME = 'SteamHub';
export const APP_VERSION = '2.0.0';
export const ITEMS_PER_PAGE = 20;
export const DEBOUNCE_DELAY = 300;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  API_ERROR: 'Failed to fetch data. Please try again later.',
  NOT_FOUND: 'Content not found.',
  STREAM_ERROR: 'Unable to load video stream. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};
```

**Create `src/utils/helpers.js`:**
```javascript
import { TMDB_IMAGE_BASE, IMAGE_SIZES } from './constants';

// Format runtime (minutes to hours and minutes)
export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Format date (YYYY-MM-DD to readable format)
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Get year from date string
export const getYear = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).getFullYear();
};

// Format rating (10-point scale to 1 decimal)
export const formatRating = (rating) => {
  if (!rating) return 'N/A';
  return rating.toFixed(1);
};

// Get TMDB image URL
export const getImageUrl = (path, type = 'poster', size = 'medium') => {
  if (!path) return '/placeholder.jpg'; // You'll need to add a placeholder image
  const imageSize = IMAGE_SIZES[type][size];
  return `${TMDB_IMAGE_BASE}/${imageSize}${path}`;
};

// Truncate text
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Format number (1000 to 1K, 1000000 to 1M)
export const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};
```

**Create `src/utils/validators.js`:**
```javascript
// Validate API key exists
export const validateApiKey = () => {
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  if (!apiKey) {
    console.error('TMDB API key is missing. Please check your .env file.');
    return false;
  }
  return true;
};

// Validate TMDB ID
export const isValidTmdbId = (id) => {
  return !isNaN(id) && parseInt(id) > 0;
};

// Validate search query
export const isValidSearchQuery = (query) => {
  return query && query.trim().length >= 2;
};

// Validate season/episode numbers
export const isValidEpisode = (season, episode) => {
  return (
    !isNaN(season) && parseInt(season) > 0 &&
    !isNaN(episode) && parseInt(episode) > 0
  );
};
```

**Deliverables:**
- ✅ Constants file with all config
- ✅ Helpers with utility functions
- ✅ Validators for data integrity

---

## SPRINT 2: API Services & Data Layer

**Goal:** Implement all TMDB API and vidsrc.cc integrations

### Task 2.1: TMDB Service Implementation

**Create `src/services/tmdb.service.js`:**
```javascript
import axios from 'axios';
import { TMDB_BASE_URL, TMDB_API_KEY, ERROR_MESSAGES } from '../utils/constants';

// Create axios instance
const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
});

// Response interceptor for error handling
tmdbClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('TMDB API Error:', error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Invalid API key');
        case 404:
          throw new Error(ERROR_MESSAGES.NOT_FOUND);
        default:
          throw new Error(ERROR_MESSAGES.API_ERROR);
      }
    }
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }
);

// Movies
export const getPopularMovies = (page = 1) => 
  tmdbClient.get('/movie/popular', { params: { page } });

export const getTrendingMovies = (timeWindow = 'week', page = 1) =>
  tmdbClient.get(`/trending/movie/${timeWindow}`, { params: { page } });

export const getTopRatedMovies = (page = 1) =>
  tmdbClient.get('/movie/top_rated', { params: { page } });

export const getNowPlayingMovies = (page = 1) =>
  tmdbClient.get('/movie/now_playing', { params: { page } });

export const getMovieDetails = (id) =>
  tmdbClient.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos,similar' }
  });

// TV Shows
export const getPopularTV = (page = 1) =>
  tmdbClient.get('/tv/popular', { params: { page } });

export const getTrendingTV = (timeWindow = 'week', page = 1) =>
  tmdbClient.get(`/trending/tv/${timeWindow}`, { params: { page } });

export const getTopRatedTV = (page = 1) =>
  tmdbClient.get('/tv/top_rated', { params: { page } });

export const getAiringTodayTV = (page = 1) =>
  tmdbClient.get('/tv/airing_today', { params: { page } });

export const getTVDetails = (id) =>
  tmdbClient.get(`/tv/${id}`, {
    params: { append_to_response: 'credits,videos,similar' }
  });

export const getSeasonDetails = (tvId, seasonNumber) =>
  tmdbClient.get(`/tv/${tvId}/season/${seasonNumber}`);

// Search
export const multiSearch = (query, page = 1) =>
  tmdbClient.get('/search/multi', {
    params: { query, page, include_adult: false }
  });

export const searchMovies = (query, page = 1) =>
  tmdbClient.get('/search/movie', {
    params: { query, page, include_adult: false }
  });

export const searchTV = (query, page = 1) =>
  tmdbClient.get('/search/tv', {
    params: { query, page, include_adult: false }
  });

// Trending (All)
export const getTrendingAll = (timeWindow = 'week', page = 1) =>
  tmdbClient.get(`/trending/all/${timeWindow}`, { params: { page } });
```

**Deliverables:**
- ✅ Complete TMDB service with all endpoints
- ✅ Error handling and interceptors
- ✅ Proper API key usage

---

### Task 2.2: VidSrc Service Implementation

**Create `src/services/vidsrc.service.js`:**
```javascript
import { VIDSRC_BASE_URL, VIDSRC_PARAMS } from '../utils/constants';

// Generate movie stream URL
export const getMovieStreamUrl = (tmdbId) => {
  if (!tmdbId) {
    console.error('TMDB ID is required for movie stream');
    return null;
  }
  
  const url = `${VIDSRC_BASE_URL}/movie/${tmdbId}`;
  const params = new URLSearchParams(VIDSRC_PARAMS);
  
  return `${url}?${params.toString()}`;
};

// Generate TV show stream URL
export const getTVStreamUrl = (tmdbId, season, episode) => {
  if (!tmdbId || !season || !episode) {
    console.error('TMDB ID, season, and episode are required for TV stream');
    return null;
  }
  
  const url = `${VIDSRC_BASE_URL}/tv/${tmdbId}/${season}/${episode}`;
  const params = new URLSearchParams(VIDSRC_PARAMS);
  
  return `${url}?${params.toString()}`;
};

// Validate stream URL (basic check)
export const isValidStreamUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('vidsrc');
  } catch {
    return false;
  }
};
```

**Deliverables:**
- ✅ VidSrc URL generation functions
- ✅ Exact format as specified
- ✅ Validation helper

---

### Task 2.3: Local Storage Service

**Create `src/services/storage.service.js`:**
```javascript
// Storage keys
const KEYS = {
  WATCHLIST: 'steamhub_watchlist',
  SETTINGS: 'steamhub_settings',
  WATCH_HISTORY: 'steamhub_watch_history_',
  RECENT_SEARCHES: 'steamhub_recent_searches',
};

// Safe JSON parse with fallback
const safeJSONParse = (str, fallback) => {
  try {
    return JSON.parse(str) || fallback;
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
};

// Watchlist
export const getWatchlist = () => {
  const data = localStorage.getItem(KEYS.WATCHLIST);
  return safeJSONParse(data, []);
};

export const saveWatchlist = (items) => {
  try {
    localStorage.setItem(KEYS.WATCHLIST, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error('Error saving watchlist:', error);
    return false;
  }
};

// Settings
export const getSettings = () => {
  const data = localStorage.getItem(KEYS.SETTINGS);
  return safeJSONParse(data, {});
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

// Watch History (TV shows)
export const getWatchHistory = (tvId) => {
  const data = localStorage.getItem(`${KEYS.WATCH_HISTORY}${tvId}`);
  return safeJSONParse(data, []);
};

export const saveWatchHistory = (tvId, episodes) => {
  try {
    localStorage.setItem(`${KEYS.WATCH_HISTORY}${tvId}`, JSON.stringify(episodes));
    return true;
  } catch (error) {
    console.error('Error saving watch history:', error);
    return false;
  }
};

export const markEpisodeWatched = (tvId, season, episode) => {
  const history = getWatchHistory(tvId);
  const key = `${season}-${episode}`;
  if (!history.includes(key)) {
    history.push(key);
    saveWatchHistory(tvId, history);
  }
};

export const isEpisodeWatched = (tvId, season, episode) => {
  const history = getWatchHistory(tvId);
  return history.includes(`${season}-${episode}`);
};

// Recent Searches
export const getRecentSearches = () => {
  const data = localStorage.getItem(KEYS.RECENT_SEARCHES);
  return safeJSONParse(data, []);
};

export const addRecentSearch = (query) => {
  const searches = getRecentSearches();
  const updated = [query, ...searches.filter(s => s !== query)].slice(0, 10);
  localStorage.setItem(KEYS.RECENT_SEARCHES, JSON.stringify(updated));
};

export const clearRecentSearches = () => {
  localStorage.removeItem(KEYS.RECENT_SEARCHES);
};
```

**Deliverables:**
- ✅ Complete storage service
- ✅ Error handling for localStorage
- ✅ Watch history tracking

---

## SPRINT 3: Common Components Library

**Goal:** Build reusable UI components

### Task 3.1: Button Component

**Create `src/components/common/Button.jsx`:**
```jsx
import React from 'react';
import { FiLoader } from 'react-icons/fi';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon = null,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary',
    secondary: 'bg-accent text-white hover:bg-opacity-90 focus:ring-accent',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-text-secondary hover:bg-surface-hover focus:ring-text-muted',
    danger: 'bg-error text-white hover:bg-red-700 focus:ring-error',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {loading ? (
        <FiLoader className="animate-spin mr-2" size={18} />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="mr-2" size={18} />
      )}
      {children}
      {Icon && iconPosition === 'right' && !loading && <Icon className="ml-2" size={18} />}
    </button>
  );
};

export default Button;
```

**Deliverables:**
- ✅ Button with multiple variants
- ✅ Loading state
- ✅ Icon support
- ✅ Fully accessible

---

*Continue with remaining sprints in next files...*
