# VidSrc Integration Technical Specification

## Overview

This document outlines a comprehensive technical specification for integrating VidSrc streaming services into the existing React application. The integration ensures reliable video playback with multiple fallback mechanisms, enhanced user experience, and robust error handling.

## Current State Analysis

### Existing Implementation
- ✅ Basic VidSrc API service with primary and backup domains
- ✅ Simple iframe embedding for movies and TV shows
- ✅ Basic error handling and fallback mechanisms
- ✅ Support for multiple streaming sources (VidSrc, EmbedSoap, SmashyStream)
- ✅ Player component with basic controls
- ✅ TMDB integration for metadata

### Identified Gaps
- ❌ No automatic fallback rotation when streams fail
- ❌ Limited quality selection options
- ❌ No performance monitoring
- ❌ Basic error recovery mechanisms
- ❌ Limited mobile optimization features
- ❌ No CSP-compliant implementation
- ❌ No cross-origin support features

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   TMDB API      │───▶│  Content Service │───▶│  VidSrc Service │
│   (Metadata)    │    │  (Integration)   │    │  (Streaming)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Player UI     │◀───│  Fallback        │◀───│  Error Handler  │
│   Component     │    │  Manager         │    │  & Recovery     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Performance   │    │  Quality         │    │  Mobile         │
│   Monitoring    │    │  Selection       │    │  Optimization   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 1. Multi-Domain Fallback System

### 1.1 Domain Configuration
```javascript
const VIDSRC_DOMAINS = {
  primary: 'https://vidsrc.xyz/embed',
  fallbacks: [
    'https://vidsrc.in/embed',
    'https://vidsrc.pm/embed',
    'https://vidsrc.net/embed'
  ],
  alternative: [
    'https://vidsrc.dev/embed',
    'https://vidsrc.pro/embed'
  ]
};
```

### 1.2 Fallback Strategy
- **Primary**: Use vidsrc.xyz as default
- **Level 1**: Rotate through fallback domains (in, pm, net)
- **Level 2**: Use alternative domains if all fallbacks fail
- **Rotation Logic**: Round-robin with exponential backoff

### 1.3 Implementation
```javascript
class FallbackManager {
  constructor() {
    this.currentIndex = 0;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  getNextUrl(type, id, season = null, episode = null) {
    const domains = this.getDomainsForRetry();
    const domain = domains[this.currentIndex];

    this.currentIndex = (this.currentIndex + 1) % domains.length;

    if (type === 'movie') {
      return `${domain}/movie/${id}`;
    } else {
      return `${domain}/tv/${id}/${season}/${episode}`;
    }
  }

  recordFailure() {
    this.retryCount++;
    if (this.retryCount >= this.maxRetries) {
      this.reset();
      throw new Error('All streaming sources failed');
    }
  }
}
```

## 2. Content Type Detection & URL Formatting

### 2.1 Intelligent Detection
```javascript
const ContentTypeDetector = {
  detectType: (tmdbData) => {
    if (tmdbData.media_type === 'movie' || tmdbData.type === 'movie') {
      return 'movie';
    } else if (tmdbData.media_type === 'tv' || tmdbData.type === 'tv') {
      return 'tv';
    }
    return 'unknown';
  },

  formatUrl: (type, id, options = {}) => {
    const { season = 1, episode = 1, quality = 'auto' } = options;

    if (type === 'movie') {
      return `/movie/${id}?q=${quality}`;
    } else if (type === 'tv') {
      return `/tv/${id}/${season}/${episode}?q=${quality}`;
    }

    throw new Error('Unsupported content type');
  }
};
```

### 2.2 URL Validation
```javascript
const UrlValidator = {
  validateVidSrcUrl: (url) => {
    const pattern = /^https:\/\/(vidsrc\.(xyz|in|pm|net|dev|pro)|embedsoap\.com|player\.smashystream\.com)/;
    return pattern.test(url);
  },

  sanitizeUrl: (url) => {
    // Remove dangerous parameters
    const safeUrl = new URL(url);
    const allowedParams = ['q', 'autoplay', 'muted'];
    const params = new URLSearchParams();

    allowedParams.forEach(param => {
      if (safeUrl.searchParams.has(param)) {
        params.set(param, safeUrl.searchParams.get(param));
      }
    });

    safeUrl.search = params.toString();
    return safeUrl.toString();
  }
};
```

## 3. Error Handling & Recovery

### 3.1 Error Types
```javascript
const StreamErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  PLAYER_ERROR: 'PLAYER_ERROR',
  CONTENT_NOT_FOUND: 'CONTENT_NOT_FOUND',
  GEO_BLOCKED: 'GEO_BLOCKED',
  QUALITY_UNAVAILABLE: 'QUALITY_UNAVAILABLE'
};
```

### 3.2 Recovery Strategies
```javascript
class ErrorRecoveryManager {
  constructor(fallbackManager) {
    this.fallbackManager = fallbackManager;
    this.recoveryStrategies = new Map();
    this.initializeStrategies();
  }

  initializeStrategies() {
    this.recoveryStrategies.set(StreamErrorTypes.NETWORK_ERROR, this.handleNetworkError.bind(this));
    this.recoveryStrategies.set(StreamErrorTypes.TIMEOUT_ERROR, this.handleTimeoutError.bind(this));
    this.recoveryStrategies.set(StreamErrorTypes.PLAYER_ERROR, this.handlePlayerError.bind(this));
    this.recoveryStrategies.set(StreamErrorTypes.CONTENT_NOT_FOUND, this.handleContentNotFound.bind(this));
  }

  async recover(error, context) {
    const strategy = this.recoveryStrategies.get(error.type);
    if (strategy) {
      return await strategy(error, context);
    }
    throw error;
  }

  async handleNetworkError(error, context) {
    // Wait and retry with different domain
    await this.delay(this.calculateBackoffDelay(context.retryCount));
    return this.fallbackManager.getNextUrl(context.type, context.id);
  }

  async handleTimeoutError(error, context) {
    // Reduce quality and retry
    const newQuality = this.reduceQuality(context.quality);
    return this.fallbackManager.getNextUrl(context.type, context.id, { quality: newQuality });
  }
}
```

## 4. Quality Selection & Adaptive Streaming

### 4.1 Quality Options
```javascript
const QualityOptions = {
  AUTO: 'auto',
  Q4K: '4k',
  Q1080P: '1080p',
  Q720P: '720p',
  Q480P: '480p',
  Q360P: '360p'
};

const QualityManager = {
  getAvailableQualities: (contentType, contentId) => {
    // Base qualities available for VidSrc
    const baseQualities = [QualityOptions.Q1080P, QualityOptions.Q720P, QualityOptions.Q480P];

    // Add 4K for recent movies
    if (contentType === 'movie' && this.isRecentMovie(contentId)) {
      baseQualities.unshift(QualityOptions.Q4K);
    }

    return baseQualities;
  },

  getOptimalQuality: (connectionSpeed, deviceType) => {
    if (deviceType === 'mobile' && connectionSpeed < 5) {
      return QualityOptions.Q480P;
    } else if (connectionSpeed < 10) {
      return QualityOptions.Q720P;
    } else if (connectionSpeed < 25) {
      return QualityOptions.Q1080P;
    }
    return QualityOptions.Q4K;
  }
};
```

## 5. Loading States & Progress Indicators

### 5.1 Loading Phases
```javascript
const LoadingPhases = {
  INITIALIZING: 'initializing',
  FETCHING_METADATA: 'fetching_metadata',
  LOADING_STREAM: 'loading_stream',
  PREPARING_PLAYER: 'preparing_player',
  READY: 'ready'
};

const LoadingManager = {
  phases: LoadingPhases,
  currentPhase: null,
  progress: 0,

  setPhase: (phase) => {
    this.currentPhase = phase;
    this.updateProgress(phase);
    this.notifySubscribers(phase);
  },

  updateProgress: (phase) => {
    const progressMap = {
      [LoadingPhases.INITIALIZING]: 10,
      [LoadingPhases.FETCHING_METADATA]: 30,
      [LoadingPhases.LOADING_STREAM]: 60,
      [LoadingPhases.PREPARING_PLAYER]: 90,
      [LoadingPhases.READY]: 100
    };
    this.progress = progressMap[phase] || 0;
  }
};
```

## 6. Mobile Optimization

### 6.1 Touch Controls
```javascript
const TouchControls = {
  initialize: (playerElement) => {
    let touchStartX = 0;
    let touchStartY = 0;
    let isScrubbing = false;

    playerElement.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    playerElement.addEventListener('touchmove', (e) => {
      if (!isScrubbing && this.isVerticalSwipe(e)) {
        this.handleBrightnessVolume(e);
      } else if (this.isHorizontalSwipe(e)) {
        isScrubbing = true;
        this.handleSeek(e);
      }
    });
  },

  handleBrightnessVolume: (e) => {
    const deltaY = e.touches[0].clientY - touchStartY;
    if (Math.abs(deltaY) > 50) {
      // Adjust brightness/volume based on swipe direction
      this.adjustBrightnessVolume(deltaY);
    }
  }
};
```

### 6.2 Responsive Player
```javascript
const ResponsivePlayer = {
  getOptimalDimensions: (containerWidth, containerHeight, aspectRatio = 16/9) => {
    const maxWidth = Math.min(containerWidth, 1200);
    const maxHeight = Math.min(containerHeight, maxWidth / aspectRatio);

    return {
      width: maxWidth,
      height: maxHeight,
      aspectRatio
    };
  },

  handleOrientationChange: () => {
    // Adjust player dimensions based on device orientation
    const isLandscape = window.innerHeight < window.innerWidth;
    this.updatePlayerDimensions(isLandscape);
  }
};
```

## 7. Performance Monitoring

### 7.1 Metrics Collection
```javascript
const PerformanceMonitor = {
  metrics: {
    streamLoadTime: [],
    bufferingEvents: [],
    qualitySwitches: [],
    errorRates: [],
    userEngagement: []
  },

  trackStreamLoadTime: (startTime, endTime) => {
    const loadTime = endTime - startTime;
    this.metrics.streamLoadTime.push(loadTime);

    if (loadTime > 10000) { // 10 seconds
      this.reportSlowLoading();
    }
  },

  trackBufferingEvent: (duration) => {
    this.metrics.bufferingEvents.push({
      timestamp: Date.now(),
      duration
    });
  },

  generateReport: () => {
    return {
      averageLoadTime: this.calculateAverage(this.metrics.streamLoadTime),
      bufferingFrequency: this.metrics.bufferingEvents.length,
      errorRate: this.calculateErrorRate(),
      qualitySwitchCount: this.metrics.qualitySwitches.length
    };
  }
};
```

## 8. Security Implementation

### 8.1 CSP-Compliant Embedding
```javascript
const SecureEmbedder = {
  createSecureIframe: (url, options = {}) => {
    const iframe = document.createElement('iframe');

    // Security attributes
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-presentation');
    iframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen; picture-in-picture');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.setAttribute('loading', 'lazy');

    // CSP compliant URL
    const secureUrl = this.sanitizeUrl(url);
    iframe.src = secureUrl;

    return iframe;
  },

  sanitizeUrl: (url) => {
    const parsedUrl = new URL(url);
    // Remove potentially dangerous parameters
    const allowedParams = ['q', 'autoplay', 'muted'];
    const params = new URLSearchParams();

    allowedParams.forEach(param => {
      if (parsedUrl.searchParams.has(param)) {
        params.set(param, parsedUrl.searchParams.get(param));
      }
    });

    parsedUrl.search = params.toString();
    return parsedUrl.toString();
  }
};
```

## 9. Integration Points

### 9.1 TMDB Integration
```javascript
const TMDBIntegration = {
  enhanceWithTMDB: async (contentId, type) => {
    try {
      const tmdbData = await tmdbApi.getDetails(contentId);
      const enhancedData = {
        ...tmdbData,
        streamingSources: await this.getStreamingSources(contentId, type),
        qualityOptions: this.getQualityOptions(tmdbData),
        recommendations: await this.getRecommendations(contentId, type)
      };
      return enhancedData;
    } catch (error) {
      console.warn('Failed to enhance with TMDB data:', error);
      return null;
    }
  }
};
```

### 9.2 Watchlist Integration
```javascript
const WatchlistIntegration = {
  addToWatchlist: async (contentId, type, title) => {
    const watchlistItem = {
      id: contentId,
      type,
      title,
      addedAt: new Date().toISOString(),
      streamingUrl: this.generateStreamingUrl(contentId, type)
    };

    await storageService.saveToWatchlist(watchlistItem);
  },

  getWatchlistWithStreams: async () => {
    const watchlist = await storageService.getWatchlist();
    return Promise.all(
      watchlist.map(item => this.enhanceWatchlistItem(item))
    );
  }
};
```

## 10. Testing Strategy

### 10.1 Unit Tests
```javascript
describe('VidSrcService', () => {
  test('should generate correct movie URL', () => {
    const url = vidsrcApi.getMovieStream('12345');
    expect(url).toBe('https://vidsrc.xyz/embed/movie/12345');
  });

  test('should handle fallback rotation', () => {
    const fallbackManager = new FallbackManager();
    const firstUrl = fallbackManager.getNextUrl('movie', '12345');
    const secondUrl = fallbackManager.getNextUrl('movie', '12345');

    expect(firstUrl).not.toBe(secondUrl);
  });
});
```

### 10.2 Integration Tests
```javascript
describe('Player Integration', () => {
  test('should load stream successfully', async () => {
    const player = new Player();
    await player.loadContent('movie', '12345');

    expect(player.streamData.url).toContain('vidsrc.xyz');
    expect(player.loadingState).toBe('ready');
  });

  test('should fallback on stream failure', async () => {
    // Mock network failure
    mockNetworkFailure();

    const player = new Player();
    await player.loadContent('movie', '12345');

    expect(player.streamData.url).toContain('vidsrc.in');
  });
});
```

## Implementation Priority

### Phase 1: Core Reliability (Week 1-2)
1. Multi-domain fallback system
2. Error handling and recovery
3. Content type detection
4. Basic loading states

### Phase 2: Enhanced Experience (Week 3-4)
1. Quality selection
2. Mobile optimization
3. Custom controls
4. Performance monitoring

### Phase 3: Advanced Features (Week 5-6)
1. CSP compliance
2. Cross-origin support
3. Watchlist integration
4. Comprehensive testing

## Success Metrics

- **Stream Success Rate**: >95% of streams load successfully
- **Fallback Success Rate**: >99% of failed streams recover via fallback
- **Load Time**: <5 seconds average stream load time
- **Mobile Compatibility**: Works on 95%+ of mobile devices
- **Error Recovery**: <1% of errors require manual intervention

## Conclusion

This technical specification provides a comprehensive roadmap for implementing a robust VidSrc integration with multiple fallback mechanisms, enhanced user experience, and reliable video playback. The architecture ensures scalability, maintainability, and excellent performance across all devices and network conditions.