import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiMoon, FiSun, FiGlobe, FiShield } from 'react-icons/fi';
import { useSettings } from '../../context/SettingsContext';
import './Settings.css';

const Settings = () => {
  const { settings, updateSettings } = useSettings();

  const handleThemeChange = (theme) => {
    updateSettings({ theme });
  };

  const handleRegionChange = (region) => {
    updateSettings({ region });
  };

  const handleContentRatingChange = (rating) => {
    updateSettings({ contentRating: rating });
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <Link to="/" className="back-btn">
          <FiArrowLeft />
          Back to Home
        </Link>
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2 className="section-title">Appearance</h2>

          <div className="setting-item">
            <div className="setting-info">
              <FiMoon className="setting-icon" />
              <div>
                <h3>Theme</h3>
                <p>Choose your preferred theme</p>
              </div>
            </div>
            <div className="setting-controls">
              <button
                className={`theme-btn ${settings.theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <FiMoon />
                Dark
              </button>
              <button
                className={`theme-btn ${settings.theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <FiSun />
                Light
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="section-title">Region & Content</h2>

          <div className="setting-item">
            <div className="setting-info">
              <FiGlobe className="setting-icon" />
              <div>
                <h3>Region</h3>
                <p>Your content region preference</p>
              </div>
            </div>
            <div className="setting-controls">
              <select
                value={settings.region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="region-select"
              >
                <option value="IN">India</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
              </select>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <FiShield className="setting-icon" />
              <div>
                <h3>Content Rating</h3>
                <p>Filter content based on rating</p>
              </div>
            </div>
            <div className="setting-controls">
              <select
                value={settings.contentRating}
                onChange={(e) => handleContentRatingChange(e.target.value)}
                className="rating-select"
              >
                <option value="all">All Content</option>
                <option value="pg">PG and above</option>
                <option value="pg13">PG-13 and above</option>
                <option value="r">R and above</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="section-title">About</h2>
          <div className="about-info">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Built with:</strong> React, TMDB API, VidSrc</p>
            <p>This application is for educational purposes only.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;