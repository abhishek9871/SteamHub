// 2Embed API service (fallback provider)
// Public embed mirrors are volatile; this list reflects commonly active domains as of 2025.

const TWOEMBED_DOMAINS = {
  primary: 'https://2embed.to',
  fallbacks: [
    'https://2embed.cc',
    'https://2embed.org',
    'https://2embed.ru'
  ]
};

export const twoEmbedApi = {
  getAllDomains: () => [TWOEMBED_DOMAINS.primary, ...TWOEMBED_DOMAINS.fallbacks],

  // Movie via TMDB ID
  getMovieStreamFromDomain: (domain, tmdbId, options = {}) => {
    const { autoplay = true, muted = true } = options; // kept for symmetry, not appended
    // Prefer TMDB-prefixed pattern for better compatibility
    let url = `${domain}/v.php?id=${encodeURIComponent(`tmdb-${tmdbId}`)}`;
    // Do not append additional params for 2Embed; some mirrors error out with extra query params

    return {
      url,
      type: 'movie',
      provider: '2embed',
      embeddable: true
    };
  },

  // Movie via IMDb ID
  getMovieStreamByImdbFromDomain: (domain, imdbId, options = {}) => {
    const { autoplay = true, muted = true } = options; // kept for symmetry, not appended
    // Common pattern: v.php?imdb=<IMDB_ID>
    let url = `${domain}/v.php?imdb=${encodeURIComponent(imdbId)}`;
    // Do not append additional params for 2Embed

    return {
      url,
      type: 'movie',
      provider: '2embed',
      embeddable: true
    };
  },

  // TV via TMDB ID + season/episode
  getTVStreamFromDomain: (domain, tmdbId, season = 1, episode = 1, options = {}) => {
    const { autoplay = true, muted = true } = options; // kept for symmetry, not appended
    // Prefer TMDB-prefixed pattern for better compatibility
    let url = `${domain}/v.php?id=${encodeURIComponent(`tmdb-${tmdbId}`)}&s=${encodeURIComponent(season)}&e=${encodeURIComponent(episode)}`;
    // Do not append additional params for 2Embed

    return {
      url,
      type: 'tv',
      provider: '2embed',
      embeddable: true,
      season,
      episode
    };
  }
};

export default twoEmbedApi;
