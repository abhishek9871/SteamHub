import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FiArrowLeft, FiExternalLink, FiAlertTriangle, FiInfo, 
  FiChevronDown, FiChevronRight, FiPlay, FiClock, FiCheckCircle 
} from 'react-icons/fi';
import { moviesApi, tvApi } from '../../services/tmdbApi';
import { vidsrcCcApi } from '../../services/vidsrcCcApi';
import { getImageUrl } from '../../services/tmdbApi';
import './Player.css';

const Player = () => {
  const { type, id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const autoPlayTimeoutRef = useRef(null);

  // Basic states
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // TV Series states
  const [seasons, setSeasons] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [watchedEpisodes, setWatchedEpisodes] = useState(new Set());
  
  // Auto-play next episode states
  const [showNextEpisodePopup, setShowNextEpisodePopup] = useState(false);
  const [nextEpisodeCountdown, setNextEpisodeCountdown] = useState(10);
  const [isSeriesComplete, setIsSeriesComplete] = useState(false);

  // Initialize from URL params if available
  useEffect(() => {
    const season = parseInt(searchParams.get('season')) || 1;
    const episode = parseInt(searchParams.get('episode')) || 1;
    setCurrentSeason(season);
    setCurrentEpisode(episode);
  }, []);

  // Load content and generate stream URL
  useEffect(() => {
    loadContent();
  }, [type, id, currentSeason, currentEpisode]);

  // Load watched episodes from localStorage
  useEffect(() => {
    if (type === 'tv' && id) {
      const stored = localStorage.getItem(`watched_${id}`);
      if (stored) {
        setWatchedEpisodes(new Set(JSON.parse(stored)));
      }
    }
  }, [type, id]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      setIframeLoaded(false);

      // Fetch content details from TMDB
      let contentData;
      if (type === 'movie') {
        contentData = await moviesApi.getDetails(id);
      } else {
        contentData = await tvApi.getDetails(id);
        
        // Fetch seasons for TV shows
        const seasonsData = await tvApi.getSeasons(id);
        setSeasons(seasonsData.filter(s => s.season_number > 0)); // Exclude specials
        
        // Fetch episodes for current season
        const seasonDetails = await tvApi.getSeasonDetails(id, currentSeason);
        setEpisodes(seasonDetails.episodes || []);
      }

      setContent(contentData);

      // Generate vidsrc.cc embed URL
      const url = type === 'movie' 
        ? vidsrcCcApi.getMovieStreamFromDomain(id, null, 'vidsrc.cc')
        : vidsrcCcApi.getTvStreamFromDomain(id, null, currentSeason, currentEpisode, 'vidsrc.cc');

      if (url) {
        setStreamUrl(url);
        console.log('✅ Stream URL generated:', url);
        
        // Update URL params for TV shows
        if (type === 'tv') {
          setSearchParams({ season: currentSeason, episode: currentEpisode });
        }
      } else {
        throw new Error('Failed to generate stream URL');
      }
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load player. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    console.log('✅ Player loaded successfully');
    
    // Mark episode as watched for TV shows
    if (type === 'tv') {
      markEpisodeWatched(currentSeason, currentEpisode);
      
      // Start auto-play timer (simulate end of episode after 5 seconds for demo)
      // In production, this would be triggered by actual video end event
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      
      // Simulate episode end after 30 seconds for demo (remove this in production)
      // autoPlayTimeoutRef.current = setTimeout(() => {
      //   handleEpisodeEnd();
      // }, 30000);
    }
  };

  const markEpisodeWatched = (season, episode) => {
    const key = `${season}-${episode}`;
    const newWatched = new Set(watchedEpisodes);
    newWatched.add(key);
    setWatchedEpisodes(newWatched);
    
    // Save to localStorage
    localStorage.setItem(`watched_${id}`, JSON.stringify([...newWatched]));
  };

  const isEpisodeWatched = (season, episode) => {
    return watchedEpisodes.has(`${season}-${episode}`);
  };

  const handleEpisodeEnd = useCallback(() => {
    if (type !== 'tv') return;
    
    const nextEp = getNextEpisode();
    if (nextEp) {
      // Show next episode popup
      setShowNextEpisodePopup(true);
      startNextEpisodeCountdown();
    } else {
      // Series complete
      setIsSeriesComplete(true);
      setTimeout(() => {
        navigate(`/series-complete/${id}`);
      }, 3000);
    }
  }, [type, currentSeason, currentEpisode, episodes, seasons]);

  const getNextEpisode = () => {
    // Check if there's a next episode in current season
    if (currentEpisode < episodes.length) {
      return {
        season: currentSeason,
        episode: currentEpisode + 1
      };
    }
    
    // Check if there's a next season
    const nextSeasonData = seasons.find(s => s.season_number === currentSeason + 1);
    if (nextSeasonData) {
      return {
        season: currentSeason + 1,
        episode: 1
      };
    }
    
    return null;
  };

  const startNextEpisodeCountdown = () => {
    let count = 10;
    setNextEpisodeCountdown(count);
    
    const interval = setInterval(() => {
      count -= 1;
      setNextEpisodeCountdown(count);
      
      if (count <= 0) {
        clearInterval(interval);
        playNextEpisode();
      }
    }, 1000);
    
    // Store interval for cleanup
    autoPlayTimeoutRef.current = interval;
  };

  const cancelAutoPlay = () => {
    if (autoPlayTimeoutRef.current) {
      clearInterval(autoPlayTimeoutRef.current);
    }
    setShowNextEpisodePopup(false);
  };

  const playNextEpisode = () => {
    const nextEp = getNextEpisode();
    if (nextEp) {
      setShowNextEpisodePopup(false);
      setCurrentSeason(nextEp.season);
      setCurrentEpisode(nextEp.episode);
    }
  };

  const handleEpisodeSelect = (season, episode) => {
    setCurrentSeason(season);
    setCurrentEpisode(episode);
    setShowEpisodeList(false);
  };

  const handleRetry = () => {
    setError(null);
    setIframeLoaded(false);
    loadContent();
  };

  const openInNewTab = () => {
    if (streamUrl) {
      window.open(streamUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearInterval(autoPlayTimeoutRef.current);
      }
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="player-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            <h3>Loading Player...</h3>
            <p>Preparing your {type === 'movie' ? 'movie' : 'episode'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="player-error">
        <div className="error-content">
          <div className="error-icon">
            <FiAlertTriangle />
          </div>
          <h2>Unable to Load Player</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={handleRetry} className="retry-btn">
              Try Again
            </button>
            <Link to="/" className="back-home-btn">
              <FiArrowLeft />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No content/stream
  if (!content || !streamUrl) {
    return null;
  }

  const currentEpisodeData = type === 'tv' && episodes.length > 0 
    ? episodes.find(ep => ep.episode_number === currentEpisode)
    : null;

  return (
    <div className="player-container">
      {/* Header */}
      <header className="player-header">
        <div className="header-left">
          <button
            className="header-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FiArrowLeft />
          </button>
          <div className="header-content-info">
            <h1 className="header-title">
              {content.title}
              {type === 'tv' && (
                <span className="header-episode-info">
                  S{currentSeason}:E{currentEpisode}
                </span>
              )}
            </h1>
            {type === 'tv' && currentEpisodeData && (
              <span className="header-episode-title">
                {currentEpisodeData.name}
              </span>
            )}
          </div>
        </div>

        <div className="header-right">
          {type === 'tv' && (
            <button
              className="header-episodes-btn"
              onClick={() => setShowEpisodeList(!showEpisodeList)}
              aria-label="Episodes"
            >
              Episodes
              <FiChevronDown />
            </button>
          )}
          <button
            className="header-action-btn"
            onClick={openInNewTab}
            title="Open in new tab"
            aria-label="Open player in new tab"
          >
            <FiExternalLink />
          </button>
        </div>
      </header>

      {/* Episode Selector Dropdown */}
      {type === 'tv' && showEpisodeList && (
        <div className="episode-selector-dropdown">
          <div className="episode-selector-content">
            <div className="season-selector">
              <h3>Season {currentSeason}</h3>
              <div className="season-buttons">
                {seasons.map(season => (
                  <button
                    key={season.season_number}
                    className={`season-btn ${currentSeason === season.season_number ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentSeason(season.season_number);
                      setCurrentEpisode(1);
                    }}
                  >
                    Season {season.season_number}
                  </button>
                ))}
              </div>
            </div>

            <div className="episodes-grid">
              {episodes.map(episode => {
                const isWatched = isEpisodeWatched(currentSeason, episode.episode_number);
                const isCurrent = currentEpisode === episode.episode_number;
                
                return (
                  <div
                    key={episode.id}
                    className={`episode-card ${isCurrent ? 'current' : ''} ${isWatched ? 'watched' : ''}`}
                    onClick={() => handleEpisodeSelect(currentSeason, episode.episode_number)}
                  >
                    <div className="episode-thumbnail">
                      {episode.still_path ? (
                        <img
                          src={getImageUrl(episode.still_path, 'w300')}
                          alt={episode.name}
                          loading="lazy"
                        />
                      ) : (
                        <div className="episode-placeholder">
                          <FiPlay />
                        </div>
                      )}
                      {isWatched && (
                        <div className="watched-badge">
                          <FiCheckCircle />
                        </div>
                      )}
                      {isCurrent && (
                        <div className="current-badge">
                          NOW PLAYING
                        </div>
                      )}
                      <div className="episode-number">
                        E{episode.episode_number}
                      </div>
                    </div>
                    <div className="episode-info">
                      <h4 className="episode-title">{episode.name}</h4>
                      {episode.runtime && (
                        <span className="episode-runtime">
                          <FiClock /> {episode.runtime}m
                        </span>
                      )}
                      {episode.overview && (
                        <p className="episode-overview">
                          {episode.overview.substring(0, 150)}
                          {episode.overview.length > 150 ? '...' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

        {/* Full Screen Video Player */}
      <div className="video-player-wrapper">
        {!iframeLoaded && (
          <div className="iframe-loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading video player...</p>
          </div>
        )}

        <iframe
          ref={iframeRef}
          key={streamUrl} // Force re-render on URL change
          src={streamUrl}
          title={`${content.title} - Player`}
          className="video-iframe"
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-forms allow-presentation allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={handleIframeLoad}
        />

        {/* Next Episode Popup (Netflix-style) */}
        {showNextEpisodePopup && getNextEpisode() && (
          <div className="next-episode-popup">
            <div className="next-episode-content">
              <div className="next-episode-info">
                <h3>Next Episode</h3>
                {(() => {
                  const nextEp = getNextEpisode();
                  const nextEpData = nextEp.season === currentSeason 
                    ? episodes.find(ep => ep.episode_number === nextEp.episode)
                    : null;
                  
                  return (
                    <>
                      <p className="next-episode-title">
                        S{nextEp.season}:E{nextEp.episode} {nextEpData?.name || 'Loading...'}
                      </p>
                      <div className="next-episode-countdown">
                        Playing in {nextEpisodeCountdown}s...
                      </div>
                    </>
                  );
                })()}
              </div>
              <div className="next-episode-actions">
                <button onClick={cancelAutoPlay} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={playNextEpisode} className="play-now-btn">
                  <FiPlay /> Play Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Series Complete Popup */}
        {isSeriesComplete && (
          <div className="series-complete-popup">
            <div className="series-complete-content">
              <h2>🎉 Series Complete!</h2>
              <p>You've finished watching {content.title}</p>
              <p>Redirecting to recommendations...</p>
            </div>
          </div>
        )}
      </div>

      {/* Next Episode Button (for TV shows) - Positioned below video player */}
      {type === 'tv' && getNextEpisode() && (
        <div className="next-episode-below-player">
          <button 
            className="next-episode-below-btn"
            onClick={playNextEpisode}
            title="Next Episode"
          >
            <FiPlay />
            <span>Next Episode</span>
          </button>
        </div>
      )}

      {/* Content Details Section */}
      <section className="content-details-section">
        <div className="details-container">
          <div className="details-poster">
            <img
              src={getImageUrl(
                type === 'tv' && currentEpisodeData?.still_path 
                  ? currentEpisodeData.still_path 
                  : content.posterPath, 
                'w342'
              )}
              alt={content.title}
              loading="lazy"
            />
          </div>

          <div className="details-info">
            <h2 className="details-title">
              {content.title}
              {type === 'tv' && currentEpisodeData && (
                <span className="details-episode">
                  - Season {currentSeason}, Episode {currentEpisode}
                </span>
              )}
            </h2>

            {type === 'tv' && currentEpisodeData && (
              <h3 className="details-episode-title">{currentEpisodeData.name}</h3>
            )}

            <div className="details-meta">
              {content.voteAverage > 0 && (
                <div className="meta-rating">
                  <span className="rating-star">⭐</span>
                  <span>{content.voteAverage.toFixed(1)}</span>
                </div>
              )}
              {content.releaseDate && (
                <span className="meta-year">
                  {new Date(content.releaseDate).getFullYear()}
                </span>
              )}
              {type === 'movie' && content.runtime && (
                <span className="meta-runtime">
                  {content.runtime} min
                </span>
              )}
              {type === 'tv' && currentEpisodeData?.runtime && (
                <span className="meta-runtime">
                  {currentEpisodeData.runtime} min
                </span>
              )}
            </div>

            {content.genres && content.genres.length > 0 && (
              <div className="details-genres">
                {content.genres.map(genre => (
                  <span key={genre.id} className="genre-badge">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="details-overview">
              {type === 'tv' && currentEpisodeData?.overview 
                ? currentEpisodeData.overview 
                : content.overview}
            </p>

            {/* Navigation Buttons for TV Shows */}
            {type === 'tv' && (
              <div className="episode-navigation">
                <button
                  className="nav-btn prev-btn"
                  onClick={() => {
                    if (currentEpisode > 1) {
                      setCurrentEpisode(currentEpisode - 1);
                    } else if (currentSeason > 1) {
                      // Go to last episode of previous season
                      setCurrentSeason(currentSeason - 1);
                      // Will need to load that season's episodes first
                    }
                  }}
                  disabled={currentSeason === 1 && currentEpisode === 1}
                >
                  ← Previous Episode
                </button>
                <button
                  className="nav-btn next-btn"
                  onClick={() => {
                    const nextEp = getNextEpisode();
                    if (nextEp) {
                      setCurrentSeason(nextEp.season);
                      setCurrentEpisode(nextEp.episode);
                    }
                  }}
                  disabled={!getNextEpisode()}
                >
                  Next Episode →
                </button>
              </div>
            )}

            <div className="details-actions">
              <Link
                to={`/${type}/${id}`}
                className="details-more-btn"
              >
                <FiInfo />
                More Information
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="details-disclaimer">
              <p><strong>Disclaimer:</strong> This app aggregates publicly available streaming links. Users are responsible for their content access. We are not liable for any copyright infringement. Legal risks may include fines as per your local copyright laws.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Player;
