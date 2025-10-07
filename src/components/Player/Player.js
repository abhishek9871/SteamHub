import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FiArrowLeft, FiExternalLink, FiAlertTriangle, FiInfo, 
  FiChevronDown, FiPlay, FiClock, FiCheckCircle, FiSkipForward 
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

  // Basic states
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // TV Series states (only for TV shows)
  const [seasons, setSeasons] = useState([]);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [showSeasonSelector, setShowSeasonSelector] = useState(false);
  const [watchedEpisodes, setWatchedEpisodes] = useState(new Set());

  // Initialize from URL params if available (TV only)
  useEffect(() => {
    if (type === 'tv') {
      const season = parseInt(searchParams.get('season')) || 1;
      const episode = parseInt(searchParams.get('episode')) || 1;
      setCurrentSeason(season);
      setCurrentEpisode(episode);
    }
  }, [type, searchParams]);

  // Load content - OPTIMIZED for fast movie loading
  useEffect(() => {
    loadContent();
  }, [type, id, currentSeason, currentEpisode]);

  // Load watched episodes from localStorage (TV only)
  useEffect(() => {
    if (type === 'tv' && id) {
      const stored = localStorage.getItem(`watched_${id}`);
      if (stored) {
        try {
          setWatchedEpisodes(new Set(JSON.parse(stored)));
        } catch (e) {
          console.error('Error loading watch history:', e);
        }
      }
    }
  }, [type, id]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      setIframeLoaded(false);

      // OPTIMIZATION: For movies, only fetch basic details and stream URL
      if (type === 'movie') {
        const [contentData, url] = await Promise.all([
          moviesApi.getDetails(id),
          Promise.resolve(vidsrcCcApi.getMovieStreamFromDomain(id, null, 'vidsrc.cc'))
        ]);
        
        setContent(contentData);
        if (url) {
          setStreamUrl(url);
          console.log('✅ Movie stream ready:', url);
        } else {
          throw new Error('Failed to generate stream URL');
        }
      } else {
        // For TV shows, fetch all required data
        const contentData = await tvApi.getDetails(id);
        setContent(contentData);
        
        // Fetch seasons and episodes in parallel
        const [seasonsData, seasonDetails] = await Promise.all([
          tvApi.getSeasons(id),
          tvApi.getSeasonDetails(id, currentSeason)
        ]);
        
        const filteredSeasons = seasonsData.filter(s => s.season_number > 0);
        setSeasons(filteredSeasons);
        setEpisodes(seasonDetails.episodes || []);
        
        // Generate stream URL
        const url = vidsrcCcApi.getTvStreamFromDomain(id, null, currentSeason, currentEpisode, 'vidsrc.cc');
        
        if (url) {
          setStreamUrl(url);
          console.log('✅ TV stream ready:', url);
          setSearchParams({ season: currentSeason, episode: currentEpisode }, { replace: true });
        } else {
          throw new Error('Failed to generate stream URL');
        }
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
    }
  };

  const markEpisodeWatched = (season, episode) => {
    const key = `${season}-${episode}`;
    const newWatched = new Set(watchedEpisodes);
    newWatched.add(key);
    setWatchedEpisodes(newWatched);
    
    // Save to localStorage
    try {
      localStorage.setItem(`watched_${id}`, JSON.stringify([...newWatched]));
    } catch (e) {
      console.error('Error saving watch history:', e);
    }
  };

  const isEpisodeWatched = (season, episode) => {
    return watchedEpisodes.has(`${season}-${episode}`);
  };

  const getNextEpisode = () => {
    if (type !== 'tv') return null;
    
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

  const getPreviousEpisode = () => {
    if (type !== 'tv') return null;
    
    // Check if there's a previous episode in current season
    if (currentEpisode > 1) {
      return {
        season: currentSeason,
        episode: currentEpisode - 1
      };
    }
    
    // Check if there's a previous season
    if (currentSeason > 1) {
      const prevSeasonData = seasons.find(s => s.season_number === currentSeason - 1);
      if (prevSeasonData) {
        // Need to know how many episodes in previous season
        // For now, just go to episode 1
        return {
          season: currentSeason - 1,
          episode: 1
        };
      }
    }
    
    return null;
  };

  const playNextEpisode = () => {
    const nextEp = getNextEpisode();
    if (nextEp) {
      setCurrentSeason(nextEp.season);
      setCurrentEpisode(nextEp.episode);
      setShowEpisodeList(false);
    } else {
      // Series complete
      navigate(`/series-complete/${id}`);
    }
  };

  const playPreviousEpisode = () => {
    const prevEp = getPreviousEpisode();
    if (prevEp) {
      setCurrentSeason(prevEp.season);
      setCurrentEpisode(prevEp.episode);
      setShowEpisodeList(false);
    }
  };

  const handleEpisodeSelect = (season, episode) => {
    setCurrentSeason(season);
    setCurrentEpisode(episode);
    setShowEpisodeList(false);
  };

  const handleSeasonChange = async (seasonNumber) => {
    try {
      setCurrentSeason(seasonNumber);
      setCurrentEpisode(1);
      
      // Fetch episodes for new season
      const seasonDetails = await tvApi.getSeasonDetails(id, seasonNumber);
      setEpisodes(seasonDetails.episodes || []);
    } catch (err) {
      console.error('Error loading season:', err);
    }
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

  const nextEpisode = getNextEpisode();
  const prevEpisode = getPreviousEpisode();

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
            <>
              <button
                className="header-season-btn"
                onClick={() => setShowSeasonSelector(!showSeasonSelector)}
                aria-label="Select Season"
              >
                Season {currentSeason}
                <FiChevronDown />
              </button>
              <button
                className="header-episodes-btn"
                onClick={() => setShowEpisodeList(!showEpisodeList)}
                aria-label="Episodes"
              >
                Episodes
                <FiChevronDown />
              </button>
            </>
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

      {/* Season Selector Dropdown (for TV shows with multiple seasons) */}
      {type === 'tv' && showSeasonSelector && seasons.length > 0 && (
        <div className="season-selector-dropdown">
          <div className="season-selector-content">
            <h3>Select Season</h3>
            <div className="season-grid">
              {seasons.map(season => (
                <button
                  key={season.season_number}
                  className={`season-card ${currentSeason === season.season_number ? 'active' : ''}`}
                  onClick={() => {
                    handleSeasonChange(season.season_number);
                    setShowSeasonSelector(false);
                  }}
                >
                  <div className="season-poster">
                    {season.poster_path ? (
                      <img
                        src={getImageUrl(season.poster_path, 'w185')}
                        alt={season.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="season-placeholder">S{season.season_number}</div>
                    )}
                  </div>
                  <div className="season-info">
                    <h4>{season.name}</h4>
                    <p>{season.episode_count} Episodes</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Episode Selector Dropdown */}
      {type === 'tv' && showEpisodeList && (
        <div className="episode-selector-dropdown">
          <div className="episode-selector-content">
            <h3>Season {currentSeason} Episodes</h3>
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
                          {episode.overview.substring(0, 120)}
                          {episode.overview.length > 120 ? '...' : ''}
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
      </div>

      {/* Next Episode Button (for TV shows) - Positioned below video player */}
      {type === 'tv' && nextEpisode && (
        <div className="next-episode-below-player">
          <button 
            className="next-episode-below-btn"
            onClick={playNextEpisode}
            title="Next Episode"
          >
            <FiSkipForward />
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
                  onClick={playPreviousEpisode}
                  disabled={!prevEpisode}
                >
                  ← Previous Episode
                </button>
                <button
                  className="nav-btn next-btn"
                  onClick={playNextEpisode}
                  disabled={!nextEpisode}
                >
                  {nextEpisode ? 'Next Episode →' : 'Series Complete ✓'}
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
