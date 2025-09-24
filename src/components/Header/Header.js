import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiHeart, FiSettings, FiMenu, FiX } from 'react-icons/fi';
import { useWatchlist } from '../../context/WatchlistContext';
import { useSettings } from '../../context/SettingsContext';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { watchlist } = useWatchlist();
  const { settings } = useSettings();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <span className="logo-text">StreamHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/watchlist"
            className={`nav-link ${isActive('/watchlist') ? 'active' : ''}`}
          >
            Watchlist
            {watchlist.length > 0 && (
              <span className="watchlist-count">{watchlist.length}</span>
            )}
          </Link>
          <Link
            to="/settings"
            className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
          >
            Settings
          </Link>
        </nav>

        {/* Search Bar */}
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search movies, TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search for movies and TV shows"
            />
          </div>
        </form>

        {/* Action Buttons */}
        <div className="header-actions">
          <Link
            to="/watchlist"
            className="action-btn"
            aria-label="Watchlist"
            title="Watchlist"
          >
            <FiHeart className={watchlist.length > 0 ? 'active' : ''} />
            {watchlist.length > 0 && (
              <span className="watchlist-count-mobile">{watchlist.length}</span>
            )}
          </Link>
          <Link
            to="/settings"
            className="action-btn"
            aria-label="Settings"
            title="Settings"
          >
            <FiSettings />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <Link
            to="/"
            className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            to="/watchlist"
            className={`mobile-nav-link ${isActive('/watchlist') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Watchlist
            {watchlist.length > 0 && (
              <span className="watchlist-count">{watchlist.length}</span>
            )}
          </Link>
          <Link
            to="/settings"
            className={`mobile-nav-link ${isActive('/settings') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Settings
          </Link>
        </nav>

        {/* Mobile Search */}
        <form className="mobile-search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search movies, TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search for movies and TV shows"
            />
          </div>
          <button type="submit" className="mobile-search-btn">
            Search
          </button>
        </form>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Header;