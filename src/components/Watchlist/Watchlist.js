import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiHeart, FiTrash2 } from 'react-icons/fi';
import { useWatchlist } from '../../context/WatchlistContext';
import MovieCard from '../MovieCard/MovieCard';
import './Watchlist.css';

const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  const handleRemoveFromWatchlist = (item) => {
    removeFromWatchlist(item);
  };

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <div className="header-content">
          <Link to="/" className="back-btn">
            <FiArrowLeft />
            Back to Home
          </Link>
          <div className="header-info">
            <h1 className="page-title">My Watchlist</h1>
            <p className="watchlist-count">
              {watchlist.length} item{watchlist.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="watchlist-content">
        {watchlist.length === 0 ? (
          <div className="empty-watchlist">
            <div className="empty-content">
              <FiHeart className="empty-icon" />
              <h2>Your watchlist is empty</h2>
              <p>Add movies and TV shows to your watchlist to see them here.</p>
              <Link to="/" className="browse-btn">
                Browse Content
              </Link>
            </div>
          </div>
        ) : (
          <div className="watchlist-grid">
            {watchlist.map((item) => (
              <div key={`${item.type}-${item.id}`} className="watchlist-item">
                <MovieCard
                  item={item}
                  size="medium"
                  showType={true}
                  showYear={true}
                  showRating={true}
                />
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFromWatchlist(item)}
                  title="Remove from watchlist"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;