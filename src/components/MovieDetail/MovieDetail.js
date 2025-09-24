import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPlay, FiHeart, FiStar, FiCalendar, FiClock, FiArrowLeft } from 'react-icons/fi';
import { moviesApi } from '../../services/tmdbApi';
import { useWatchlist } from '../../context/WatchlistContext';
import { getImageUrl } from '../../services/tmdbApi';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    loadMovieDetails();
  }, [id]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const movieData = await moviesApi.getDetails(id);
      setMovie(movieData);
    } catch (err) {
      console.error('Error loading movie details:', err);
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistToggle = () => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie);
    } else {
      addToWatchlist(movie);
    }
  };

  if (loading) {
    return (
      <div className="movie-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-error">
        <div className="error-content">
          <h2>Movie Not Found</h2>
          <p>{error || 'The requested movie could not be found.'}</p>
          <Link to="/" className="back-btn">
            <FiArrowLeft />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const backdropStyle = movie.backdropPath ? {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${getImageUrl(movie.backdropPath, 'original')})`
  } : {};

  return (
    <div className="movie-detail">
      {/* Hero Section */}
      <div className="detail-hero" style={backdropStyle}>
        <div className="hero-content">
          <div className="hero-info">
            <div className="hero-type">
              <span className="type-badge movie">Movie</span>
            </div>
            <h1 className="hero-title">{movie.title}</h1>

            <div className="hero-meta">
              {movie.releaseDate && (
                <div className="meta-item">
                  <FiCalendar className="meta-icon" />
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                </div>
              )}
              {movie.runtime && (
                <div className="meta-item">
                  <FiClock className="meta-icon" />
                  <span>{movie.runtime} min</span>
                </div>
              )}
              {movie.voteAverage > 0 && (
                <div className="meta-item">
                  <FiStar className="meta-icon rating" />
                  <span>{movie.voteAverage.toFixed(1)}</span>
                </div>
              )}
            </div>

            {movie.overview && (
              <p className="hero-description">
                {movie.overview}
              </p>
            )}

            <div className="hero-actions">
              <Link to={`/play/movie/${movie.id}`} className="play-btn">
                <FiPlay className="play-icon" />
                Watch Now
              </Link>
              <button
                className={`watchlist-btn ${isInWatchlist(movie.id) ? 'active' : ''}`}
                onClick={handleWatchlistToggle}
              >
                <FiHeart className={isInWatchlist(movie.id) ? 'active' : ''} />
                {isInWatchlist(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>

          <div className="hero-poster">
            <img
              src={getImageUrl(movie.posterPath, 'w500')}
              alt={movie.title}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Content Info */}
      <div className="detail-content">
        <div className="content-section">
          <h3>Overview</h3>
          <p>{movie.overview || 'No overview available.'}</p>
        </div>

        {movie.genres && movie.genres.length > 0 && (
          <div className="content-section">
            <h3>Genres</h3>
            <div className="genres-list">
              {movie.genres.map(genre => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;