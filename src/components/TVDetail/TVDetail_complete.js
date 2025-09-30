import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPlay, FiHeart, FiStar, FiCalendar, FiTv, FiArrowLeft, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { tvApi } from '../../services/tmdbApi';
import { useWatchlist } from '../../context/WatchlistContext';
import { getImageUrl } from '../../services/tmdbApi';
import '../MovieDetail/MovieDetail.css';
import './TVDetail.css';

const TVDetail = () => {
  const { id } = useParams();
  const [tvShow, setTvShow] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSeasons, setExpandedSeasons] = useState(new Set([1])); // Default expand season 1
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    loadTVDetails();
  }, [id]);

  const loadTVDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch TV show details and seasons in parallel
      const [tvData, seasonsData] = await Promise.all([
        tvApi.getDetails(id),
        tvApi.getSeasons(id)
      ]);
      
      setTvShow(tvData);
      const filteredSeasons = seasonsData.filter(s => s.season_number > 0);
      setSeasons(filteredSeasons);
      
      // Load first season episodes by default
      if (filteredSeasons.length > 0) {
        loadSeasonEpisodes(filteredSeasons[0].season_number);
      }
    } catch (err) {
      console.error('Error loading TV show details:', err);
      setError('Failed to load TV show details');
    } finally {
      setLoading(false);
    }
  };

  const loadSeasonEpisodes = async (seasonNumber) => {
    try {
      setLoadingEpisodes(true);
      setSelectedSeason(seasonNumber);
      const seasonDetails = await tvApi.getSeasonDetails(id, seasonNumber);
      setSeasonEpisodes(seasonDetails.episodes || []);
    } catch (err) {
      console.error('Error loading season episodes:', err);
    } finally {
      setLoadingEpisodes(false);
    }
  };

  const toggleSeasonExpand = (seasonNumber) => {
    const newExpanded = new Set(expandedSeasons);
    if (newExpanded.has(seasonNumber)) {
      newExpanded.delete(seasonNumber);
    } else {
      newExpanded.add(seasonNumber);
      loadSeasonEpisodes(seasonNumber);
    }
    setExpandedSeasons(newExpanded);
  };

  const handleWatchlistToggle = () => {
    if (isInWatchlist(tvShow.id)) {
      removeFromWatchlist(tvShow);
    } else {
      addToWatchlist(tvShow);
    }
  };

  const getWatchedEpisodes = () => {
    const stored = localStorage.getItem(`watched_${id}`);
    if (stored) {
      try {
        return new Set(JSON.parse(stored));
      } catch (e) {
        return new Set();
      }
    }
    return new Set();
  };

  const isEpisodeWatched = (season, episode) => {
    const watched = getWatchedEpisodes();
    return watched.has(`${season}-${episode}`);
  };

  if (loading) {
    return (
      <div className="movie-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading TV show details...</p>
      </div>
    );
  }

  if (error || !tvShow) {
    return (
      <div className="movie-detail-error">
        <div className="error-content">
          <h2>TV Show Not Found</h2>
          <p>{error || 'The requested TV show could not be found.'}</p>
          <Link to="/" className="back-btn">
            <FiArrowLeft />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const backdropStyle = tvShow.backdropPath ? {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${getImageUrl(tvShow.backdropPath, 'original')})`
  } : {};

  return (
    <div className="movie-detail tv-detail">
      {/* Hero Section */}
      <div className="detail-hero" style={backdropStyle}>
        <div className="hero-content">
          <div className="hero-info">
            <div className="hero-type">
              <span className="type-badge tv">TV Series</span>
            </div>
            <h1 className="hero-title">{tvShow.title}</h1>

            <div className="hero-meta">
              {tvShow.releaseDate && (
                <div className="meta-item">
                  <FiCalendar className="meta-icon" />
                  <span>{new Date(tvShow.releaseDate).getFullYear()}</span>
                </div>
              )}
              {seasons.length > 0 && (
                <div className="meta-item">
                  <FiTv className="meta-icon" />
                  <span>{seasons.length} Season{seasons.length > 1 ? 's' : ''}</span>
                </div>
              )}
              {tvShow.voteAverage > 0 && (
                <div className="meta-item">
                  <FiStar className="meta-icon rating" />
                  <span>{tvShow.voteAverage.toFixed(1)}</span>
                </div>
              )}
            </div>

            {tvShow.overview && (
              <p className="hero-description">
                {tvShow.overview}
              </p>
            )}

            <div className="hero-actions">
              <Link to={`/play/tv/${tvShow.id}?season=1&episode=1`} className="play-btn">
                <FiPlay className="play-icon" />
                Watch Now
              </Link>
              <button
                className={`watchlist-btn ${isInWatchlist(tvShow.id) ? 'active' : ''}`}
                onClick={handleWatchlistToggle}
              >
                <FiHeart className={isInWatchlist(tvShow.id) ? 'active' : ''} />
                {isInWatchlist(tvShow.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>

          <div className="hero-poster">
            <img
              src={getImageUrl(tvShow.posterPath, 'w500')}
              alt={tvShow.title}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Content Info */}
      <div className="detail-content">
        <div className="content-section">
          <h3>Overview</h3>
          <p>{tvShow.overview || 'No overview available.'}</p>
        </div>

        {tvShow.genres && tvShow.genres.length > 0 && (
          <div className="content-section">
            <h3>Genres</h3>
            <div className="genres-list">
              {tvShow.genres.map(genre => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Seasons & Episodes */}
        {seasons.length > 0 && (
          <div className="content-section seasons-section">
            <h3>Seasons & Episodes</h3>
            <div className="seasons-list">
              {seasons.map(season => {
                const isExpanded = expandedSeasons.has(season.season_number);
                const isLoadingThis = loadingEpisodes && selectedSeason === season.season_number;
                
                return (
                  <div key={season.id} className="season-item">
                    <div 
                      className="season-header"
                      onClick={() => toggleSeasonExpand(season.season_number)}
                    >
                      <div className="season-header-left">
                        <div className="season-poster-small">
                          {season.poster_path ? (
                            <img
                              src={getImageUrl(season.poster_path, 'w92')}
                              alt={season.name}
                              loading="lazy"
                            />
                          ) : (
                            <div className="season-poster-placeholder">
                              S{season.season_number}
                            </div>
                          )}
                        </div>
                        <div className="season-header-info">
                          <h4>{season.name}</h4>
                          <p className="season-meta">
                            {season.episode_count} Episode{season.episode_count > 1 ? 's' : ''}
                            {season.air_date && ` • ${new Date(season.air_date).getFullYear()}`}
                          </p>
                        </div>
                      </div>
                      <button className="season-toggle-btn">
                        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="season-episodes">
                        {isLoadingThis ? (
                          <div className="episodes-loading">
                            <div className="loading-spinner-small"></div>
                            <p>Loading episodes...</p>
                          </div>
                        ) : selectedSeason === season.season_number && seasonEpisodes.length > 0 ? (
                          <div className="episodes-grid-detail">
                            {seasonEpisodes.map(episode => {
                              const watched = isEpisodeWatched(season.season_number, episode.episode_number);
                              
                              return (
                                <Link
                                  key={episode.id}
                                  to={`/play/tv/${id}?season=${season.season_number}&episode=${episode.episode_number}`}
                                  className={`episode-card-detail ${watched ? 'watched' : ''}`}
                                >
                                  <div className="episode-thumbnail-detail">
                                    {episode.still_path ? (
                                      <img
                                        src={getImageUrl(episode.still_path, 'w300')}
                                        alt={episode.name}
                                        loading="lazy"
                                      />
                                    ) : (
                                      <div className="episode-placeholder-detail">
                                        <FiPlay />
                                      </div>
                                    )}
                                    <div className="episode-play-overlay">
                                      <FiPlay />
                                    </div>
                                    {watched && (
                                      <div className="episode-watched-badge">✓</div>
                                    )}
                                  </div>
                                  <div className="episode-info-detail">
                                    <div className="episode-header-detail">
                                      <span className="episode-number-detail">
                                        E{episode.episode_number}
                                      </span>
                                      {episode.runtime && (
                                        <span className="episode-runtime-detail">
                                          {episode.runtime}m
                                        </span>
                                      )}
                                    </div>
                                    <h5 className="episode-title-detail">{episode.name}</h5>
                                    {episode.overview && (
                                      <p className="episode-overview-detail">
                                        {episode.overview.substring(0, 150)}
                                        {episode.overview.length > 150 ? '...' : ''}
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="no-episodes">No episodes available</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVDetail;
