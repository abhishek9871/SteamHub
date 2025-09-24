import React, { useState, useEffect, useCallback, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import MovieCard from '../MovieCard/MovieCard';
import { useSettings } from '../../context/SettingsContext';
import './MovieGrid.css';

const MovieGrid = ({
  fetchData,
  fetchParams = {},
  title = '',
  loading: initialLoading = false,
  error: initialError = null,
  emptyMessage = 'No items found',
  cardSize = 'medium',
  showType = true,
  showYear = true,
  showRating = true,
  className = ''
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(initialError);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { settings } = useSettings();

  // Memoize fetchParams to prevent infinite re-renders
  const memoizedFetchParams = useMemo(() => fetchParams, [JSON.stringify(fetchParams)]);

  // Validate and sanitize fetchParams
  const sanitizedFetchParams = useMemo(() => {
    if (!memoizedFetchParams || typeof memoizedFetchParams !== 'object') {
      return {};
    }
    return memoizedFetchParams;
  }, [JSON.stringify(memoizedFetchParams)]);

  const loadData = useCallback(async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      setError(null);

      // Pass parameters correctly based on the fetchData function signature
      let response;
      if (Object.keys(sanitizedFetchParams).length === 0) {
        // No additional params, just pass page
        response = await fetchData(pageNum);
      } else {
        // Pass additional parameters as separate arguments, not as an object
        // For trending API: fetchData(timeWindow, page)
        // For other APIs: fetchData(page)
        const paramKeys = Object.keys(sanitizedFetchParams);
        if (paramKeys.length === 1 && paramKeys[0] === 'timeWindow') {
          // Trending API expects (timeWindow, page)
          response = await fetchData(sanitizedFetchParams.timeWindow, pageNum);
        } else if (paramKeys.length === 1 && paramKeys[0] === 'query') {
          // Search API expects (query, page)
          response = await fetchData(sanitizedFetchParams.query, pageNum);
        } else {
          // Other APIs expect just (page) - pass params as second argument if needed
          response = await fetchData(pageNum, sanitizedFetchParams);
        }
      }

      if (response && response.results) {
        if (append) {
          setData(prev => [...prev, ...response.results]);
        } else {
          setData(response.results);
        }

        // Check if there are more pages
        setHasMore(pageNum < response.total_pages && response.results.length > 0);
      } else {
        setHasMore(false);
        if (!append) {
          setData([]);
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
      let errorMessage = 'Failed to load content';

      // Provide more specific error messages
      if (err.message.includes('API key')) {
        errorMessage = 'API configuration error. Please check your settings.';
      } else if (err.message.includes('Network error') || err.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.message.includes('Server error')) {
        errorMessage = 'Server temporarily unavailable. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [fetchData, memoizedFetchParams]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, true);
    }
  };

  const refresh = () => {
    setPage(1);
    setHasMore(true);
    loadData(1, false);
  };

  useEffect(() => {
    loadData(1, false);
  }, [loadData]);

  // Reset data when fetchParams change
  useEffect(() => {
    if (Object.keys(sanitizedFetchParams).length > 0) {
      setPage(1);
      setHasMore(true);
      setData([]);
      loadData(1, false);
    }
  }, [sanitizedFetchParams, loadData]);

  // Retry function for error state
  const retry = () => {
    setError(null);
    loadData(page, false);
  };

  if (error) {
    return (
      <div className={`movie-grid-error ${className}`}>
        <div className="error-content">
          <FiAlertTriangle className="error-icon" />
          <h3 className="error-title">Unable to Load Content</h3>
          <p className="error-message">
            {error.includes('API configuration') && (
              <span>
                {error}
                <br />
                <small style={{ fontSize: '0.9em', opacity: 0.8 }}>
                  Please check your TMDB API key in the settings.
                </small>
              </span>
            )}
            {!error.includes('API configuration') && error}
          </p>
          <button className="retry-btn" onClick={retry}>
            <FiRefreshCw className="retry-icon" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`movie-grid ${className}`}>
      {title && (
        <div className="grid-header">
          <h2 className="grid-title">{title}</h2>
          {data.length > 0 && (
            <span className="grid-count">
              {data.length} item{data.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {loading && data.length === 0 ? (
        <div className="grid-loading">
          <div className="loading-skeleton">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-meta"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="grid-empty">
          <div className="empty-content">
            <div className="empty-icon">🎬</div>
            <h3 className="empty-title">No Content Found</h3>
            <p className="empty-message">{emptyMessage}</p>
            <button className="refresh-btn" onClick={refresh}>
              <FiRefreshCw className="refresh-icon" />
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={data.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="grid-loading-more">
              <div className="loading-spinner"></div>
              <span>Loading more content...</span>
            </div>
          }
          endMessage={
            <div className="grid-end">
              <p>You've seen all available content!</p>
            </div>
          }
          className="infinite-scroll"
        >
          <div className={`grid-container ${cardSize}`}>
            {data.map((item) => (
              <MovieCard
                key={`${item.type}-${item.id}`}
                item={item}
                size={cardSize}
                showType={showType}
                showYear={showYear}
                showRating={showRating}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}

      {/* Floating refresh button */}
      {data.length > 0 && (
        <button
          className="floating-refresh-btn"
          onClick={refresh}
          title="Refresh content"
          aria-label="Refresh content"
        >
          <FiRefreshCw />
        </button>
      )}
    </div>
  );
};

export default MovieGrid;