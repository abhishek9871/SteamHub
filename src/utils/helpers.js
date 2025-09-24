// Utility helper functions

import { API_CONSTANTS, CONTENT_TYPES } from './constants';

/**
 * Get full image URL from TMDB image path
 */
export const getImageUrl = (path, size = 'medium') => {
  if (!path) return null;

  const sizeMap = {
    small: API_CONSTANTS.TMDB.POSTER_SIZES.SMALL,
    medium: API_CONSTANTS.TMDB.POSTER_SIZES.MEDIUM,
    large: API_CONSTANTS.TMDB.POSTER_SIZES.LARGE,
    xlarge: API_CONSTANTS.TMDB.POSTER_SIZES.XLARGE,
    original: API_CONSTANTS.TMDB.POSTER_SIZES.ORIGINAL
  };

  const imageSize = sizeMap[size] || API_CONSTANTS.TMDB.POSTER_SIZES.MEDIUM;
  return `${API_CONSTANTS.TMDB.IMAGE_BASE_URL}/${imageSize}${path}`;
};

/**
 * Get backdrop image URL
 */
export const getBackdropUrl = (path, size = 'large') => {
  if (!path) return null;

  const sizeMap = {
    small: API_CONSTANTS.TMDB.BACKDROP_SIZES.SMALL,
    medium: API_CONSTANTS.TMDB.BACKDROP_SIZES.MEDIUM,
    large: API_CONSTANTS.TMDB.BACKDROP_SIZES.LARGE,
    original: API_CONSTANTS.TMDB.BACKDROP_SIZES.ORIGINAL
  };

  const imageSize = sizeMap[size] || API_CONSTANTS.TMDB.BACKDROP_SIZES.LARGE;
  return `${API_CONSTANTS.TMDB.IMAGE_BASE_URL}/${imageSize}${path}`;
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount) return 'N/A';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(dateString));
};

/**
 * Format runtime (minutes to hours and minutes)
 */
export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Format rating
 */
export const formatRating = (rating) => {
  if (!rating) return 'N/A';
  return `${rating.toFixed(1)}/10`;
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Generate slug from title
 */
export const generateSlug = (title) => {
  if (!title) return '';

  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if device is mobile
 */
export const isMobile = () => {
  return window.innerWidth <= 768;
};

/**
 * Check if device is tablet
 */
export const isTablet = () => {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

/**
 * Check if device is desktop
 */
export const isDesktop = () => {
  return window.innerWidth > 1024;
};

/**
 * Get responsive image size based on screen size
 */
export const getResponsiveImageSize = () => {
  if (isMobile()) return 'small';
  if (isTablet()) return 'medium';
  return 'large';
};

/**
 * Convert TMDB content type to readable format
 */
export const getContentTypeLabel = (type) => {
  switch (type) {
    case CONTENT_TYPES.MOVIE:
      return 'Movie';
    case CONTENT_TYPES.TV:
      return 'TV Show';
    case CONTENT_TYPES.PERSON:
      return 'Person';
    default:
      return 'Content';
  }
};

/**
 * Get year from date string
 */
export const getYear = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).getFullYear().toString();
};

/**
 * Check if content is adult
 */
export const isAdultContent = (item) => {
  return item && item.adult === true;
};

/**
 * Filter content based on rating preferences
 */
export const filterByRating = (items, maxRating = 'R') => {
  if (maxRating === 'all') return items;

  const ratingHierarchy = {
    'G': 0,
    'PG': 1,
    'PG-13': 2,
    'R': 3,
    'NC-17': 4
  };

  const maxRatingLevel = ratingHierarchy[maxRating] || 3;

  return items.filter(item => {
    if (!item.adult) return true;

    // If adult content, only show if maxRating allows NC-17
    return maxRatingLevel >= 4;
  });
};

/**
 * Sort items by different criteria
 */
export const sortItems = (items, sortBy = 'popularity.desc') => {
  const [field, direction] = sortBy.split('.');

  return [...items].sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];

    // Handle nested properties
    if (field === 'release_date') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    } else if (field === 'title') {
      aValue = (aValue || '').toLowerCase();
      bValue = (bValue || '').toLowerCase();
    }

    if (direction === 'desc') {
      return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
    } else {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    }
  });
};

/**
 * Get random items from array
 */
export const getRandomItems = (items, count = 10) => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default {
  getImageUrl,
  getBackdropUrl,
  formatCurrency,
  formatDate,
  formatRuntime,
  formatRating,
  truncateText,
  generateSlug,
  debounce,
  isMobile,
  isTablet,
  isDesktop,
  getResponsiveImageSize,
  getContentTypeLabel,
  getYear,
  isAdultContent,
  filterByRating,
  sortItems,
  getRandomItems
};