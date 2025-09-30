import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiPlay, FiPlus, FiHome } from 'react-icons/fi';
import { tvApi } from '../../services/tmdbApi';
import { useWatchlist } from '../../context/WatchlistContext';
import { getImageUrl } from '../../services/tmdbApi';
import './SeriesComplete.css';

const SeriesComplete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWatchlist } = useWatchlist();

  const [tvShow, setTvShow] = useState(null);
  const [similarShows, setSimilarShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get TV show details
      const showData = await tvApi.getDetails(id);
      setTvShow(showData);

      // Get similar shows
      const similar = await tvApi.getSimilar(id);
      setSimilarShows(similar.results.slice(0, 6));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchAgain = () => {
    navigate(`/play/tv/${id}?season=1&episode=1`);
  };

  const handleWatchSimilar = (showId) => {
    navigate(`/play/tv/${showId}?season=1&episode=1`);
  };

  const handleAddToWatchlist = (show) => {
    addToWatchlist(show);
  };

  if (loading) {
    return (
      <div className="series-complete-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!tvShow) {
    return (
      <div className="series-complete-error">
        <p>Unable to load show information</p>
        <Link to="/" className="home-btn">Go to Home</Link>
      </div>
    );
  }

  return (
    <div className="series-complete-container">
      {/* Hero Section */}
      <div 
        className="series-complete-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(20,20,20,1)), url(${getImageUrl(tvShow.backdropPath, 'original')})`
        }}
      >
        <div className="hero-content">
          <div className="completion-icon">
            <FiCheckCircle />
          </div>
          <h1 className="completion-title">You've Completed</h1>
          <h2 className="show-title">{tvShow.title}</h2>
          
          {tvShow.voteAverage > 0 && (
            <div className="show-rating">
              <span className="rating-star">⭐</span>
              <span>{tvShow.voteAverage.toFixed(1)}/10</span>
            </div>
          )}

          <p className="completion-message">
            Congratulations on finishing all episodes! Ready for your next binge?
          </p>

          <div className="completion-actions">
            <button onClick={handleWatchAgain} className="watch-again-btn">
              <FiPlay /> Watch Again
            </button>
            <Link to="/" className="browse-btn">
              <FiHome /> Browse More
            </Link>
          </div>
        </div>
      </div>

      {/* Similar Shows Recommendations */}
      <section className="recommendations-section">
        <h2 className="section-title">You Might Also Like</h2>
        <div className="recommendations-grid">
          {similarShows.map(show => (
            <div key={show.id} className="recommendation-card">
              <div className="card-poster">
                <img
                  src={getImageUrl(show.posterPath, 'w342')}
                  alt={show.title}
                  loading="lazy"
                />
                <div className="card-overlay">
                  <button
                    className="play-overlay-btn"
                    onClick={() => handleWatchSimilar(show.id)}
                  >
                    <FiPlay />
                    <span>Watch Now</span>
                  </button>
                </div>
              </div>
              <div className="card-info">
                <h3 className="card-title">{show.title}</h3>
                <div className="card-meta">
                  {show.voteAverage > 0 && (
                    <div className="card-rating">
                      <span className="rating-star">⭐</span>
                      <span>{show.voteAverage.toFixed(1)}</span>
                    </div>
                  )}
                  {show.releaseDate && (
                    <span className="card-year">
                      {new Date(show.releaseDate).getFullYear()}
                    </span>
                  )}
                </div>
                <button
                  className="add-watchlist-btn"
                  onClick={() => handleAddToWatchlist(show)}
                >
                  <FiPlus /> Add to Watchlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Continue Watching Section */}
      <section className="continue-section">
        <div className="continue-content">
          <h2>Keep the Momentum Going!</h2>
          <p>
            Don't let the binge end here. Discover thousands of shows and movies 
            waiting for you. Your next favorite is just a click away!
          </p>
          <Link to="/" className="explore-btn">
            Explore More Content
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SeriesComplete;
