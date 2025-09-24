import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlay, FiHeart, FiPlus, FiCheck } from 'react-icons/fi';
import { useWatchlist } from '../../context/WatchlistContext';
import { getImageUrl } from '../../services/tmdbApi';
import './MovieCard.css';

const MovieCard = ({
  item,
  showType = true,
  showYear = true,
  showRating = true,
  size = 'medium',
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const navigate = useNavigate();

  const isInWatchlistState = isInWatchlist(item.id);

  const handleWatchlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWatchlistState) {
      removeFromWatchlist(item);
    } else {
      addToWatchlist(item);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  const formatYear = (date) => {
    return date ? new Date(date).getFullYear() : 'N/A';
  };

  const getTypeLabel = () => {
    return item.type === 'movie' ? 'Movie' : 'TV Show';
  };

  const getTypeColor = () => {
    return item.type === 'movie' ? '#e50914' : '#00d4aa';
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons or links
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    navigate(`/${item.type}/${item.id}`);
  };

  return (
    <div className={`movie-card ${size} ${className}`}>
      <div className="card-link" onClick={handleCardClick}>
        <div className="card-image-container">
          {/* Skeleton/Placeholder */}
          {!imageLoaded && (
            <div className="card-skeleton">
              <div className="skeleton-image"></div>
            </div>
          )}

          {/* Main Image */}
          <img
            src={getImageUrl(item.posterPath, size === 'large' ? 'w500' : 'w342')}
            alt={item.title}
            className={`card-image ${imageLoaded ? 'loaded' : 'loading'} ${imageError ? 'error' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />

          {/* Fallback for broken images */}
          {imageError && (
            <div className="card-image-fallback">
              <div className="fallback-icon">🎬</div>
              <div className="fallback-text">No Image</div>
            </div>
          )}

          {/* Overlay with actions */}
          <div className="card-overlay">
            <div className="overlay-actions">
              <button
                className="play-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/play/${item.type}/${item.id}`);
                }}
                title="Watch Now"
                aria-label={`Watch ${item.title}`}
              >
                <FiPlay />
              </button>

              <button
                className={`watchlist-btn ${isInWatchlistState ? 'active' : ''}`}
                onClick={handleWatchlistToggle}
                title={isInWatchlistState ? 'Remove from Watchlist' : 'Add to Watchlist'}
                aria-label={isInWatchlistState ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                {isInWatchlistState ? <FiCheck /> : <FiPlus />}
              </button>
            </div>
          </div>

          {/* Type Badge */}
          {showType && (
            <div
              className="type-badge"
              style={{ backgroundColor: getTypeColor() }}
            >
              {getTypeLabel()}
            </div>
          )}
        </div>

        <div className="card-content">
          <h3 className="card-title" title={item.title}>
            {item.title}
          </h3>

          <div className="card-meta">
            {showYear && (
              <span className="card-year">
                {formatYear(item.releaseDate)}
              </span>
            )}

            {showRating && item.voteAverage > 0 && (
              <div className="card-rating">
                <span className="rating-star">⭐</span>
                <span className="rating-value">{formatRating(item.voteAverage)}</span>
              </div>
            )}
          </div>

          {item.overview && (
            <p className="card-description" title={item.overview}>
              {item.overview.length > 100
                ? `${item.overview.substring(0, 100)}...`
                : item.overview
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;