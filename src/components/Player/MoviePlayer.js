import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiSettings, FiRotateCcw, FiAlertTriangle, FiCheckCircle, FiLoader, FiExternalLink } from 'react-icons/fi';
import ReactPlayer from 'react-player';
import { Parser as M3U8Parser } from 'm3u8-parser';
import { moviesApi, tvApi } from '../../services/tmdbApi';
import { vidsrcCcApi } from '../../services/vidsrcCcApi';
import { godrivePlayerApi } from '../../services/godrivePlayerApi';
import { embedSuApi } from '../../services/embedSuApi';
import { useSettings } from '../../context/SettingsContext';
import { getImageUrl } from '../../services/tmdbApi';
import './Player.css';

const Player = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Enhanced state management
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPhase, setLoadingPhase] = useState('initializing');
  const [error, setError] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('auto');
  const [m3u8Url, setM3u8Url] = useState(null);
  const [qualityVariants, setQualityVariants] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [showQualitySelector, setShowQualitySelector] = useState(false);
  const [showSourceSelector, setShowSourceSelector] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const sources = useMemo(() => {
    const vidsrcCc = vidsrcCcApi.domains.map((d) => ({ provider: 'vidsrcCc', domain: d }));
    const godrivePlayer = godrivePlayerApi.domains.map((d) => ({ provider: 'godrivePlayer', domain: d }));
    const embedSu = embedSuApi.domains.map((d) => ({ provider: 'embedSu', domain: d }));
    return [...vidsrcCc, ...godrivePlayer, ...embedSu];
  }, []);
  const [sourceIndex, setSourceIndex] = useState(0);
  const rotationAttemptsRef = useRef(0);
  const didUserInteractRef = useRef(false);
  const autoRotateTimerRef = useRef(null);

  // Load preferred source from previous sessions
  useEffect(() => {
    try {
      const prefProvider = localStorage.getItem('preferredSourceProvider');
      const prefHost = localStorage.getItem('preferredSourceHost');
      if (prefHost) {
        const idx = sources.findIndex((s) => {
          try { return new URL(s.domain).host === prefHost && (!prefProvider || s.provider === prefProvider); }
          catch { return false; }
        });
        if (idx >= 0) setSourceIndex(idx);
      }
    } catch {}
  }, [sources]);

  // Load content details (movie or TV) from TMDB
  const loadContent = async () => {
    try {
      setLoading(true);
      setLoadingPhase('fetching_metadata');
      setError(null);

      let contentData;
      if (type === 'movie') {
        contentData = await moviesApi.getDetails(id);
      } else {
        contentData = await tvApi.getDetails(id);
      }

      setContent(contentData);
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load content details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
    detectMobileDevice();

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [type, id]);

  useEffect(() => {
    if (content) {
      loadStream();
    }
  }, [content]);

  // Heuristic: auto-rotate only if the initial source appears unavailable (not ready or errored)
  useEffect(() => {
    if (!streamData) return;
    if (videoReady && !videoError) return; // do not rotate when things look fine
    if (autoRotateTimerRef.current) {
      clearTimeout(autoRotateTimerRef.current);
    }
    const t = setTimeout(() => {
      if (!didUserInteractRef.current) {
        rotationAttemptsRef.current += 1;
        if (rotationAttemptsRef.current <= sources.length - 1) {
          const nextIdx = (sourceIndex + 1) % sources.length;
          setSourceIndex(nextIdx);
          setTimeout(() => loadStream(sources[nextIdx]), 0);
        }
      }
    }, 5000);
    autoRotateTimerRef.current = t;
    return () => {
      if (autoRotateTimerRef.current) {
        clearTimeout(autoRotateTimerRef.current);
        autoRotateTimerRef.current = null;
      }
    };
  }, [streamData, sourceIndex, sources]);

  // Detect mobile device
  const detectMobileDevice = () => {
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                   window.innerWidth <= 768;
    setIsMobile(mobile);
  };

  const parseM3u8Variants = async (m3u8Url) => {
    try {
      const response = await fetch(m3u8Url);
      const manifest = await response.text();
      const parser = new M3U8Parser();
      parser.push(manifest);
      parser.end();
      const parsedManifest = parser.manifest;

      const variants = parsedManifest.playlists.map((playlist) => ({
        name: `${playlist.attributes.RESOLUTION.width}x${playlist.attributes.RESOLUTION.height}`,
        url: playlist.uri,
        resolution: playlist.attributes.RESOLUTION,
        bandwidth: playlist.attributes.BANDWIDTH,
      })).sort((a, b) => b.bandwidth - a.bandwidth);

      console.log('Parsed M3U8 variants:', variants);
      return variants;
    } catch (error) {
      console.error('Error parsing M3U8:', error);
      return [];
    }
  };

  const loadStream = async (overrideSource) => {
    try {
      setLoadingPhase('loading_stream');
      setError(null);

      let stream;
      const source = overrideSource || sources[sourceIndex];
      const domain = source.domain;

      // Fetch IMDB/TMDB IDs if needed
      let tmdbId = id;
      let imdbId = null;
      if (type === 'movie') {
        const ids = await moviesApi.getExternalIds(id);
        imdbId = ids?.imdb_id || null;
      } else {
        const ids = await tvApi.getExternalIds(id);
        imdbId = ids?.imdb_id || null;
      }

      // Fetch M3U8 URL for quality selection
      let m3u8 = null;
      if (source.provider === 'vidsrcCc') {
        m3u8 = await vidsrcCcApi.getM3u8Url(imdbId, type === 'tv' ? 1 : null, type === 'tv' ? 1 : null);
      } else if (source.provider === 'godrivePlayer') {
        m3u8 = await godrivePlayerApi.getM3u8Url(imdbId, type === 'tv' ? 1 : null, type === 'tv' ? 1 : null);
      } else {
        m3u8 = await embedSuApi.getM3u8Url(tmdbId, imdbId, type === 'tv' ? 1 : null, type === 'tv' ? 1 : null);
      }

      if (m3u8) {
        setM3u8Url(m3u8);
        setLoadingPhase('preparing_player');

        // Parse M3U8 for quality variants
        const variants = await parseM3u8Variants(m3u8);
        setQualityVariants(variants);
        setSelectedQuality(variants.length > 0 ? variants[0].name : 'auto');

        stream = { url: m3u8, provider: source.provider };
      } else {
        // Fallback to provider embed URL
        if (type === 'movie') {
          if (source.provider === 'vidsrcCc') {
            stream = { url: vidsrcCcApi.getMovieStreamFromDomain(tmdbId, imdbId, domain), provider: source.provider };
          } else if (source.provider === 'godrivePlayer') {
            stream = { url: godrivePlayerApi.getMovieStreamFromDomain(imdbId, domain), provider: source.provider };
          } else {
            stream = { url: embedSuApi.getMovieStreamFromDomain(tmdbId, imdbId, domain), provider: source.provider };
          }
        } else {
          if (source.provider === 'vidsrcCc') {
            stream = { url: vidsrcCcApi.getTvStreamFromDomain(tmdbId, imdbId, 1, 1, domain), provider: source.provider };
          } else if (source.provider === 'godrivePlayer') {
            stream = { url: godrivePlayerApi.getTvStreamFromDomain(imdbId, 1, 1, domain), provider: source.provider };
          } else {
            stream = { url: embedSuApi.getTvStreamFromDomain(tmdbId, imdbId, 1, 1, domain), provider: source.provider };
          }
        }
      }

      setStreamData(stream);
      setLoadingPhase('ready');
      console.log(`✅ [Player] Stream loaded successfully: ${stream.url}`);
    } catch (err) {
      console.error('Error loading stream:', err);
      await handleStreamError(err);
    }
  };

  const handleStreamError = async (error) => {
    console.error('Stream loading error:', error);

    // For single domain setup, just show a simple error message
    setError(`Unable to load stream: ${error.message || 'Unknown error occurred'}. Please try again later.`);
  };

  const handlePlayPause = () => {
    didUserInteractRef.current = true;
    if (playerRef.current) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleMouseMove = () => {
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    controlsTimeoutRef.current = timeout;
  };

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  // Manual source change
  const handleSourceChange = (idx) => {
    setShowSourceSelector(false);
    if (idx === sourceIndex) return;
    didUserInteractRef.current = true;
    if (autoRotateTimerRef.current) {
      clearTimeout(autoRotateTimerRef.current);
      autoRotateTimerRef.current = null;
    }
    setSourceIndex(idx);
    rotationAttemptsRef.current = 0;
    setTimeout(() => loadStream(sources[idx]), 0);
  };

  // Enhanced quality selection
  const handleQualityChange = async (newQuality) => {
    setSelectedQuality(newQuality);
    setShowQualitySelector(false);

    // Reload stream with new quality if M3U8 available
    if (m3u8Url) {
      const variant = qualityVariants.find((v) => v.name === newQuality);
      if (variant) {
        setM3u8Url(variant.url);
      }
    }
  };

  // Retry stream loading
  const handleRetry = () => {
    didUserInteractRef.current = true;
    if (autoRotateTimerRef.current) {
      clearTimeout(autoRotateTimerRef.current);
      autoRotateTimerRef.current = null;
    }
    setError(null);
    setRetryCount(0);
    loadStream();
  };

  // Enhanced iframe load handler with video detection
  const handleIframeLoad = () => {
    setIframeLoaded(true);
    setIframeError(false);
    console.log('Video iframe loaded successfully');

    // Mark as ready so overlay doesn't block the embedded player's UI
    setVideoReady(true);
    setVideoError(null);

    // Save working source preference
    try {
      const current = sources[sourceIndex];
      if (current) {
        const host = new URL(current.domain).host;
        localStorage.setItem('preferredSourceHost', host);
        localStorage.setItem('preferredSourceProvider', current.provider);
      }
    } catch {}

    // Optionally still perform a delayed content check (non-blocking)
    setTimeout(() => checkVideoContent(), 2000);
  };

  // Iframe error handler
  const handleIframeError = () => {
    setIframeLoaded(false);
    setIframeError(true);
    setVideoReady(false);
    console.error('Video iframe failed to load');

    // Rotate to next source on error and attempt reload
    const nextIdx = (sourceIndex + 1) % sources.length;
    setSourceIndex(nextIdx);
    setTimeout(() => {
      loadStream(sources[nextIdx]);
    }, 500);
  };

  // Enhanced video content detection
  const checkVideoContent = useCallback(async () => {
    if (!iframeRef.current) return;

    try {
      const iframe = iframeRef.current;

      // Wait for iframe to be fully loaded
      if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
        const videoElement = iframe.contentDocument.querySelector('video');
        const playerContainer = iframe.contentDocument.querySelector('.player-container, #player, [data-player]');

        if (videoElement || playerContainer) {
          console.log('✅ Video content detected in iframe');
          setVideoReady(true);
          setVideoError(null);
          return;
        }

        // Check for vidsrc.net specific elements
        const vidsrcElements = iframe.contentDocument.querySelectorAll('[src*="vidsrc"], [data-src*="vidsrc"]');
        if (vidsrcElements.length > 0) {
          console.log('✅ VidSrc elements detected');
          setVideoReady(true);
          setVideoError(null);
          return;
        }

        // Check if iframe has loaded successfully but video isn't ready yet
        if (iframe.contentDocument.body && iframe.contentDocument.body.innerHTML.trim()) {
          console.log('⏳ Iframe loaded but video not ready yet, waiting...');
          // Wait a bit more for video to initialize
          setTimeout(() => checkVideoContent(), 2000);
          return;
        }
      }

      // Cross-origin or delayed readiness: allow interactions after a short delay
      setTimeout(() => {
        setVideoReady(true);
        setVideoError(null);
      }, 1500);
    } catch (error) {
      console.warn('Cannot access iframe content (cross-origin):', error.message);
      // For cross-origin iframes, we rely on load events and timing
      setTimeout(() => {
        setVideoReady(true);
        setVideoError(null);
      }, 3000);
    }
  }, []);

  // Retry mechanism with exponential backoff
  const retryWithBackoff = useCallback(async (attempt = 1, maxAttempts = 3) => {
    if (attempt > maxAttempts) {
      setVideoError('Video failed to load after multiple attempts');
      setIsRetrying(false);
      return;
    }

    setIsRetrying(true);
    setVideoError(null);
    setRetryAttempts(attempt);

    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff, max 10s

    console.log(`🔄 Retrying video load (attempt ${attempt}/${maxAttempts}) in ${delay}ms`);

    setTimeout(() => {
      // Rotate source on each retry attempt
      setSourceIndex(prev => {
        const next = (prev + 1) % sources.length;
        return next;
      });

      // Load stream again with new source; on final attempt try IMDb ID fallback (movies only)
      setTimeout(async () => {
        try {
          if (type === 'movie' && attempt === maxAttempts) {
            const nextSource = sources[(sourceIndex + 1) % sources.length];
            const ids = await moviesApi.getExternalIds(id);
            if (ids?.imdb_id) {
              if (nextSource.provider === 'vidsrc') {
                const alt = vidsrcApi.getMovieStreamByImdbFromDomain(nextSource.domain, ids.imdb_id, { quality, autoplay: true, muted: true });
                setStreamData(alt);
                console.log(`🔄 Using IMDb fallback via ${nextSource.domain} (vidsrc): ${alt.url}`);
              } else {
                const alt = twoEmbedApi.getMovieStreamByImdbFromDomain(nextSource.domain, ids.imdb_id, { autoplay: true, muted: true });
                setStreamData(alt);
                console.log(`🔄 Using IMDb fallback via ${nextSource.domain} (2embed): ${alt.url}`);
              }
            } else {
              loadStream();
            }
          } else {
            loadStream();
          }
        } catch (e) {
          console.warn('Retry fallback error:', e);
          loadStream();
        }
        setTimeout(() => {
          checkVideoContent();
          setIsRetrying(false);
        }, 2000);
      }, 50);
    }, delay);
  }, [checkVideoContent, sources, sourceIndex, type, id, quality]);

  // Performance monitoring removed - simplified player

  if (loading) {
    return (
      <div className="player-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-progress">
            <div className="loading-text">
              {loadingPhase === 'initializing' && 'Initializing player...'}
              {loadingPhase === 'fetching_metadata' && 'Loading content details...'}
              {loadingPhase === 'loading_stream' && 'Finding best streaming source...'}
              {loadingPhase === 'finding_best_source' && 'Finding best streaming source...'}
              {loadingPhase.startsWith('testing_') && `Testing ${loadingPhase.replace('testing_', '').toUpperCase()}...`}
              {loadingPhase === 'testing_alternative' && 'Trying alternative sources...'}
              {loadingPhase === 'preparing_player' && 'Setting up player...'}
              {loadingPhase === 'ready' && 'Ready to play!'}
            </div>
            <div className="loading-bar">
              <div
                className="loading-fill"
                style={{
                  width: loadingPhase === 'initializing' ? '10%' :
                         loadingPhase === 'fetching_metadata' ? '30%' :
                         loadingPhase === 'loading_stream' ? '50%' :
                         loadingPhase === 'finding_best_source' ? '75%' :
                         loadingPhase === 'preparing_player' ? '90%' : '100%'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="player-error">
        <div className="error-content">
          <div className="error-icon">
            <FiAlertTriangle />
          </div>
          <h2>Unable to Load Stream</h2>
          <p>{error}</p>

          <div className="error-actions">
            <button onClick={handleRetry} className="retry-btn">
              <FiRotateCcw />
              Try Again
            </button>
            <Link to="/" className="back-btn">
              <FiArrowLeft />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!content || !streamData) {
    return (
      <div className="player-error">
        <div className="error-content">
          <h2>Content Not Found</h2>
          <p>The requested content could not be found.</p>
          <Link to="/" className="back-btn">
            <FiArrowLeft />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="player-container" onMouseMove={handleMouseMove}>
      {/* Player Header */}
      <div className={`player-header ${showControls ? 'visible' : 'hidden'}`}>
        <div className="header-left">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FiArrowLeft />
          </button>
          <div className="content-info">
            <h1 className="content-title">{content.title}</h1>
            {content.releaseDate && (
              <span className="content-year">
                {new Date(content.releaseDate).getFullYear()}
              </span>
            )}
          </div>
        </div>

        <div className="header-right">
          <div className="quality-selector">
            <button
              className="quality-btn"
              onClick={() => setShowQualitySelector(!showQualitySelector)}
              aria-label="Quality settings"
            >
              {selectedQuality.toUpperCase()}
            </button>
            {showQualitySelector && (
              <div className="quality-dropdown">
                {qualityVariants.map((v) => (
                  <button
                    key={v.name}
                    className={`quality-option ${selectedQuality === v.name ? 'active' : ''}`}
                    onClick={() => handleQualityChange(v.name)}
                  >
                    {v.name}
                    {selectedQuality === v.name && <FiCheckCircle />}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Source selector */}
          <div className="quality-selector">
            <button
              className="quality-btn"
              onClick={() => setShowSourceSelector(!showSourceSelector)}
              aria-label="Source settings"
            >
              {`SRC: ${sources[sourceIndex]?.domain || 'unknown'}`}
            </button>
            {showSourceSelector && (
              <div className="quality-dropdown">
                {sources.map((s, idx) => (
                  <button
                    key={`${s.provider}-${s.domain}`}
                    className={`quality-option ${sourceIndex === idx ? 'active' : ''}`}
                    onClick={() => handleSourceChange(idx)}
                  >
                    {`${s.provider}: ${s.domain}`}
                    {sourceIndex === idx && <FiCheckCircle />}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Popout current source */}
          <button
            className="settings-btn"
            aria-label="Open source in new tab"
            onClick={() => { try { if (streamData?.url) window.open(streamData.url, '_blank', 'noopener'); } catch (e) { console.warn('Popout failed', e); } }}
          >
            <FiExternalLink />
          </button>
          <button className="settings-btn" aria-label="Settings">
            <FiSettings />
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="video-wrapper">
        {m3u8Url ? (
          <ReactPlayer
            ref={(player) => (playerRef.current = player)}
            url={m3u8Url}
            playing={isPlaying}
            muted={isMuted}
            volume={1}
            width="100%"
            height="100%"
            controls={true}
            config={{
              file: {
                hlsOptions: {
                  enableWorker: false,
                },
              },
            }}
            onReady={() => {
              setVideoReady(true);
              setVideoError(null);
            }}
            onError={(error) => {
              console.error('Player error:', error);
              setVideoError('Video failed to load');
            }}
            onEnded={() => {
              // Handle ended if needed
            }}
          />
        ) : (
          <iframe
            ref={iframeRef}
            src={streamData.url}
            title={`${content?.title || type}-${id} - Player`}
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write"
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-forms allow-presentation allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
            className="video-player"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}

        {/* Video Loading Overlay */}
        {!videoReady && !videoError && (
          <div className="video-loading-overlay">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <div className="loading-text">
                <h3>Preparing Video...</h3>
                <p>Video content is loading, please wait</p>
              </div>
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className={`video-controls ${showControls ? 'visible' : 'hidden'}`}>
          <div className="controls-center">
            <button
              className="control-btn play-pause"
              onClick={handlePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FiPause /> : <FiPlay />}
            </button>
          </div>

          <div className="controls-bottom">
            <div className="controls-left">
              <button
                className="control-btn"
                onClick={handleMuteToggle}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <FiVolumeX /> : <FiVolume2 />}
              </button>
            </div>

            <div className="controls-right">
              {videoReady && (
                <div className="stream-status">
                  <span className="status-dot good"></span>
                  <span className="status-text">READY</span>
                </div>
              )}
              {videoError && (
                <div className="stream-status error">
                  <span className="status-dot error"></span>
                  <span className="status-text">VIDEO ERROR</span>
                </div>
              )}
              <button
                className="control-btn retry"
                onClick={() => loadStream()}
                aria-label="Retry video load"
              >
                <FiRotateCcw />
              </button>
              <button
                className="control-btn fullscreen"
                onClick={handleFullscreen}
                aria-label="Toggle fullscreen"
              >
                <FiMaximize />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Info Panel */}
      <div className="content-panel">
        <div className="panel-poster">
          <img
            src={getImageUrl(content.posterPath)}
            alt={content.title}
            loading="lazy"
          />
        </div>

        <div className="panel-info">
          <h2 className="panel-title">{content.title}</h2>

          <div className="panel-meta">
            {content.voteAverage > 0 && (
              <div className="panel-rating">
                <span className="rating-star">⭐</span>
                <span>{content.voteAverage.toFixed(1)}</span>
              </div>
            )}
            {content.releaseDate && (
              <span className="panel-year">
                {new Date(content.releaseDate).getFullYear()}
              </span>
            )}
            {content.runtime && (
              <span className="panel-runtime">
                {content.runtime} min
              </span>
            )}
          </div>

          {content.overview && (
            <p className="panel-description">
              {content.overview}
            </p>
          )}

          <div className="panel-actions">
            <Link
              to={`/${type}/${id}`}
              className="more-info-btn"
            >
              More Information
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="disclaimer">
            <p><strong>Note:</strong> This app aggregates public links; users assume responsibility for content access. Not liable for copyright infringement. Legal risks include fines up to ₹2 lakh under Copyright Act.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;