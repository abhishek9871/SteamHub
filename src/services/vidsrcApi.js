// VidSrc API service for streaming integration
// No API key required - uses TMDB IDs directly

// Simplified domain configuration - prioritize the most reliable domain first
const VIDSRC_DOMAINS = {
  primary: 'https://vidsrc.to/embed',
  fallbacks: [
    'https://vidsrc.net/embed',
    'https://vidsrc.cc/embed',
    'https://vidsrc.me/embed'
  ]
};

// Quality options for streaming
const QualityOptions = {
  AUTO: 'auto',
  Q4K: '4k',
  Q1080P: '1080p',
  Q720P: '720p',
  Q480P: '480p',
  Q360P: '360p'
};

// Error types for better error handling
const StreamErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  PLAYER_ERROR: 'PLAYER_ERROR',
  CONTENT_NOT_FOUND: 'CONTENT_NOT_FOUND',
  GEO_BLOCKED: 'GEO_BLOCKED',
  QUALITY_UNAVAILABLE: 'QUALITY_UNAVAILABLE'
};

export const vidsrcApi = {
  // Simple streaming URL generation using vidsrc.net
  getMovieStream: (tmdbId, options = {}) => {
    const { quality = 'auto', autoplay = false, muted = false, color } = options;

    let url = `${VIDSRC_DOMAINS.primary}/movie/${tmdbId}`;
    const params = new URLSearchParams();
    if (quality !== 'auto') params.set('q', quality);
    if (autoplay) params.set('autoplay', '1');
    if (muted) params.set('muted', '1');
    if (color) params.set('color', String(color).replace('#', ''));
    const qs = params.toString();
    if (qs) url += `?${qs}`;

    return {
      url,
      type: 'movie',
      provider: 'vidsrc',
      embeddable: true,
      quality
    };
  },

  // Simple TV streaming using vidsrc.net
  getTVStream: (tmdbId, season = 1, episode = 1, options = {}) => {
    const { quality = 'auto', autoplay = false, muted = false, color } = options;

    let url = `${VIDSRC_DOMAINS.primary}/tv/${tmdbId}/${season}/${episode}`;
    const params = new URLSearchParams();
    if (quality !== 'auto') params.set('q', quality);
    if (autoplay) params.set('autoplay', '1');
    if (muted) params.set('muted', '1');
    if (color) params.set('color', String(color).replace('#', ''));
    const qs = params.toString();
    if (qs) url += `?${qs}`;

    return {
      url,
      type: 'tv',
      provider: 'vidsrc',
      embeddable: true,
      season,
      episode,
      quality
    };
  },

  // Build a movie stream URL using IMDb ID on a specific domain
  getMovieStreamByImdbFromDomain: (domain, imdbId, options = {}) => {
    const { quality = 'auto', autoplay = false, muted = false, color } = options;

    let url = `${domain}/movie/${imdbId}`;
    const params = new URLSearchParams();
    if (quality !== 'auto') params.set('q', quality);
    if (autoplay) params.set('autoplay', '1');
    if (muted) params.set('muted', '1');
    if (color) params.set('color', String(color).replace('#', ''));
    const qs = params.toString();
    if (qs) url += `?${qs}`;

    return {
      url,
      type: 'movie',
      provider: 'vidsrc',
      embeddable: true,
      quality
    };
  },

  // Build a movie stream URL using IMDb ID on the primary domain
  getMovieStreamByImdb: (imdbId, options = {}) => {
    const { quality = 'auto', autoplay = false, muted = false, color } = options;

    let url = `${VIDSRC_DOMAINS.primary}/movie/${imdbId}`;
    const params = new URLSearchParams();
    if (quality !== 'auto') params.set('q', quality);
    if (autoplay) params.set('autoplay', '1');
    if (muted) params.set('muted', '1');
    if (color) params.set('color', String(color).replace('#', ''));
    const qs = params.toString();
    if (qs) url += `?${qs}`;

    return {
      url,
      type: 'movie',
      provider: 'vidsrc',
      embeddable: true,
      quality
    };
  },

  // Return all supported domains in priority order
  getAllDomains: () => {
    return [VIDSRC_DOMAINS.primary, ...VIDSRC_DOMAINS.fallbacks];
  },

  // Build a movie stream URL using a specific domain
  getMovieStreamFromDomain: (domain, tmdbId, options = {}) => {
    const { quality = 'auto', autoplay = false, muted = false, color } = options;

    let url = `${domain}/movie/${tmdbId}`;
    const params = new URLSearchParams();
    if (quality !== 'auto') params.set('q', quality);
    if (autoplay) params.set('autoplay', '1');
    if (muted) params.set('muted', '1');
    if (color) params.set('color', String(color).replace('#', ''));
    const qs = params.toString();
    if (qs) url += `?${qs}`;

    return {
      url,
      type: 'movie',
      provider: 'vidsrc',
      embeddable: true,
      quality
    };
  },

  // Build a TV stream URL using a specific domain
  getTVStreamFromDomain: (domain, tmdbId, season = 1, episode = 1, options = {}) => {
    const { quality = 'auto', autoplay = false, muted = false, color } = options;

    let url = `${domain}/tv/${tmdbId}/${season}/${episode}`;
    const params = new URLSearchParams();
    if (quality !== 'auto') params.set('q', quality);
    if (autoplay) params.set('autoplay', '1');
    if (muted) params.set('muted', '1');
    if (color) params.set('color', String(color).replace('#', ''));
    const qs = params.toString();
    if (qs) url += `?${qs}`;

    return {
      url,
      type: 'tv',
      provider: 'vidsrc',
      embeddable: true,
      season,
      episode,
      quality
    };
  },

  // Get error stream for failed requests
  getErrorStream: (type, id, error, season = null, episode = null) => {
    return {
      url: '',
      type,
      provider: 'error',
      embeddable: false,
      error: error.message,
      season,
      episode
    };
  },

  // Check if streaming is available for a movie
  checkAvailability: async (tmdbId, type = 'movie') => {
    try {
      // VidSrc doesn't have a formal availability check API
      // We assume content is available if it has a valid TMDB ID
      return {
        available: true,
        provider: 'vidsrc',
        embeddable: true,
        message: 'Streaming available via VidSrc'
      };
    } catch (error) {
      return {
        available: false,
        provider: 'vidsrc',
        embeddable: false,
        message: 'Streaming temporarily unavailable'
      };
    }
  },

  // Get streaming quality information
  getQualityInfo: () => {
    return {
      default: '1080p',
      available: ['720p', '1080p', '4K'],
      note: 'Quality automatically adjusts based on connection speed'
    };
  },

  // Get supported regions
  getSupportedRegions: () => {
    return {
      regions: ['IN', 'US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'KR', 'BR', 'MX', 'ES', 'IT', 'NL', 'SE', 'NO', 'DK', 'FI', 'PL', 'RU', 'CN', 'HK', 'TW', 'SG', 'MY', 'TH', 'VN', 'PH', 'ID', 'AE', 'SA', 'EG', 'ZA', 'NG', 'KE', 'MA', 'TN', 'DZ', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'UY', 'PY', 'BO', 'GT', 'CR', 'PA', 'DO', 'JM', 'TT', 'BB', 'LC', 'VC', 'GD', 'AG', 'DM', 'KN', 'MS', 'VG', 'AI', 'BM', 'KY', 'TC', 'FK', 'GS', 'SH', 'IO', 'AC', 'TA', 'PN', 'WF', 'PF', 'NC', 'VU', 'FJ', 'PG', 'SB', 'KI', 'NR', 'TV', 'TO', 'WS', 'CK', 'NU', 'TK', 'AS', 'GU', 'MP', 'FM', 'MH', 'PW', 'UM', 'VI', 'PR'],
      note: 'VidSrc works globally with no regional restrictions'
    };
  },






  // Get available quality options
  getQualityOptions: (contentType = 'movie') => {
    const baseQualities = [QualityOptions.Q1080P, QualityOptions.Q720P, QualityOptions.Q480P];

    if (contentType === 'movie') {
      baseQualities.unshift(QualityOptions.Q4K);
    }

    return baseQualities;
  },








  // Create secure iframe embed
  createSecureEmbed: (streamData, options = {}) => {
    const {
      width = '100%',
      height = '500',
      autoplay = false,
      muted = false,
      controls = true,
      sandbox = 'allow-same-origin allow-scripts allow-presentation'
    } = options;

    const embedUrl = streamData.url;

    return {
      iframe: `<iframe
        src="${embedUrl}"
        width="${width}"
        height="${height}"
        frameborder="0"
        allowfullscreen
        ${autoplay ? 'autoplay' : ''}
        ${muted ? 'muted' : ''}
        ${controls ? '' : 'controls="false"'}
        sandbox="${sandbox}"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        referrerpolicy="strict-origin-when-cross-origin"
        loading="lazy"
      ></iframe>`,
      url: embedUrl,
      type: streamData.type,
      provider: streamData.provider,
      security: {
        sandbox,
        referrerPolicy: 'strict-origin-when-cross-origin',
        cspCompliant: true
      }
    };
  }
};

// Helper function to create iframe embed code
export const createEmbedCode = (streamData, options = {}) => {
  const {
    width = '100%',
    height = '500',
    autoplay = false,
    muted = false,
    controls = true
  } = options;

  const embedUrl = streamData.url;

  return {
    iframe: `<iframe
      src="${embedUrl}"
      width="${width}"
      height="${height}"
      frameborder="0"
      allowfullscreen
      ${autoplay ? 'autoplay' : ''}
      ${muted ? 'muted' : ''}
      ${controls ? '' : 'controls="false"'}
      sandbox="allow-same-origin allow-scripts allow-presentation"
    ></iframe>`,
    url: embedUrl,
    type: streamData.type,
    provider: streamData.provider
  };
};

// Error handling for streaming
export const handleStreamError = (error, fallbackSources = []) => {
  console.error('Streaming error:', error);

  if (fallbackSources.length > 0) {
    return {
      success: false,
      error: error.message,
      fallback: fallbackSources[0],
      hasFallback: true
    };
  }

  return {
    success: false,
    error: error.message,
    hasFallback: false
  };
};

export default vidsrcApi;