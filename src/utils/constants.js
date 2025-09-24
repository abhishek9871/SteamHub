// Application constants

export const API_CONSTANTS = {
  TMDB: {
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    POSTER_SIZES: {
      SMALL: 'w154',
      MEDIUM: 'w342',
      LARGE: 'w500',
      XLARGE: 'w780',
      ORIGINAL: 'original'
    },
    BACKDROP_SIZES: {
      SMALL: 'w300',
      MEDIUM: 'w780',
      LARGE: 'w1280',
      ORIGINAL: 'original'
    }
  },
  VIDSRC: {
    BASE_URL: 'https://vidsrc.xyz/embed',
    ALTERNATIVE_DOMAINS: [
      'https://vidsrc.xyz',
      'https://vidsrc.in',
      'https://vidsrc.pm',
      'https://vidsrc.net'
    ]
  }
};

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  MOVIE_DETAIL: '/movie/:id',
  TV_DETAIL: '/tv/:id',
  PLAYER: '/play/:type/:id',
  WATCHLIST: '/watchlist',
  SETTINGS: '/settings'
};

export const CONTENT_TYPES = {
  MOVIE: 'movie',
  TV: 'tv',
  PERSON: 'person'
};

export const WATCHLIST_TYPES = {
  MOVIE: 'movie',
  TV: 'tv'
};

export const THEME_OPTIONS = {
  DARK: 'dark',
  LIGHT: 'light'
};

export const REGION_OPTIONS = {
  IN: 'IN',
  US: 'US',
  UK: 'UK',
  CA: 'CA',
  AU: 'AU',
  GLOBAL: 'global'
};

export const CONTENT_RATINGS = {
  ALL: 'all',
  G: 'G',
  PG: 'PG',
  PG13: 'PG-13',
  R: 'R',
  NC17: 'NC-17'
};

export const SORT_OPTIONS = {
  POPULARITY_DESC: 'popularity.desc',
  POPULARITY_ASC: 'popularity.asc',
  RELEASE_DATE_DESC: 'release_date.desc',
  RELEASE_DATE_ASC: 'release_date.asc',
  VOTE_AVERAGE_DESC: 'vote_average.desc',
  VOTE_AVERAGE_ASC: 'vote_average.asc',
  TITLE_ASC: 'title.asc',
  TITLE_DESC: 'title.desc'
};

export const DEFAULT_SETTINGS = {
  theme: THEME_OPTIONS.DARK,
  region: REGION_OPTIONS.IN,
  contentRating: CONTENT_RATINGS.ALL,
  autoplay: false,
  showTrailers: true,
  enableNotifications: true
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  API_ERROR: 'Unable to load content. Please try again later.',
  SEARCH_ERROR: 'Search failed. Please try different keywords.',
  NO_RESULTS: 'No results found. Try adjusting your search terms.',
  PLAYER_ERROR: 'Unable to load video player. Please try again.',
  WATCHLIST_ERROR: 'Unable to update watchlist. Please try again.',
  STORAGE_ERROR: 'Unable to save preferences. Please check your browser settings.'
};

export const SUCCESS_MESSAGES = {
  ADDED_TO_WATCHLIST: 'Added to watchlist',
  REMOVED_FROM_WATCHLIST: 'Removed from watchlist',
  SETTINGS_SAVED: 'Settings saved successfully',
  WATCHLIST_CLEARED: 'Watchlist cleared'
};

export const LOADING_MESSAGES = {
  SEARCHING: 'Searching...',
  LOADING_MOVIES: 'Loading movies...',
  LOADING_DETAILS: 'Loading details...',
  LOADING_PLAYER: 'Loading player...',
  SAVING: 'Saving...'
};

export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE: 1280
};

export const Z_INDEX = {
  DROPDOWN: 1000,
  MODAL: 2000,
  TOAST: 3000,
  OVERLAY: 4000
};

export default {
  API_CONSTANTS,
  ROUTES,
  CONTENT_TYPES,
  WATCHLIST_TYPES,
  THEME_OPTIONS,
  REGION_OPTIONS,
  CONTENT_RATINGS,
  SORT_OPTIONS,
  DEFAULT_SETTINGS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  BREAKPOINTS,
  Z_INDEX
};