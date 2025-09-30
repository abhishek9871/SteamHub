import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { moviesApi, tvApi } from '../../services/tmdbApi';
import { vidsrcCcApi } from '../../services/vidsrcCcApi';
import { getImageUrl } from '../../services/tmdbApi';
import './Player.css';

const Player = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const iframeRef = useRef(null);

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Load content and generate stream URL
  useEffect(() => {
    loadContent();
  }, [type, id]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch content details from TMDB
      let contentData;
      if (type === 'movie') {
        contentData = await moviesApi.getDetails(id);
      } else {
        contentData = await tvApi.getDetails(id);
      }

      setContent(contentData);

      // Generate vidsrc.cc embed URL (only provider that works)
      const url = type === 'movie' 
        ? vidsrcCcApi.getMovieStreamFromDomain(id, null, 'vidsrc.cc')
        : vidsrcCcApi.getTvStreamFromDomain(id, null, 1, 1, 'vidsrc.cc');

      if (url) {
        setStreamUrl(url);
        console.log('✅ Stream URL generated:', url);
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
            <p>Preparing your video experience</p>
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

  return (
    <div className="player-container">
      {/* Minimal Header */}
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
            <h1 className="header-title">{content.title}</h1>
            {content.releaseDate && (
              <span className="header-year">
                {new Date(content.releaseDate).getFullYear()}
              </span>
            )}
          </div>
        </div>

        <div className="header-right">
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

      {/* Content Details Section */}
      <section className="content-details-section">
        <div className="details-container">
          <div className="details-poster">
            <img
              src={getImageUrl(content.posterPath, 'w342')}
              alt={content.title}
              loading="lazy"
            />
          </div>

          <div className="details-info">
            <h2 className="details-title">{content.title}</h2>

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
              {content.runtime && (
                <span className="meta-runtime">
                  {content.runtime} min
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

            {content.overview && (
              <p className="details-overview">
                {content.overview}
              </p>
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
