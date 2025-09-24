import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { useDebounce } from 'react-use';
import MovieGrid from '../MovieGrid/MovieGrid';
import { searchApi, genresApi } from '../../services/tmdbApi';
import { useSettings } from '../../context/SettingsContext';
import './Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const { settings } = useSettings();

  // Debounce search query
  useDebounce(() => {
    setDebouncedQuery(searchQuery);
  }, 500, [searchQuery]);

  // Load genres on component mount
  useEffect(() => {
    loadGenres();
  }, []);

  // Update search params when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery });
    } else {
      setSearchParams({});
    }
  }, [debouncedQuery, setSearchParams]);

  const loadGenres = async () => {
    try {
      const [movieGenres, tvGenres] = await Promise.all([
        genresApi.getMovieGenres(),
        genresApi.getTVGenres()
      ]);

      // Combine and deduplicate genres
      const allGenres = [...movieGenres, ...tvGenres];
      const uniqueGenres = allGenres.filter((genre, index, self) =>
        index === self.findIndex(g => g.id === genre.id)
      );

      setGenres(uniqueGenres);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSearchParams({});
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Custom fetch function for search with filters
  const searchWithFilters = useCallback(async ({ page = 1 }) => {
    if (!debouncedQuery && !selectedGenre) {
      return { results: [], total_pages: 0 };
    }

    try {
      let response;

      if (selectedType === 'movie') {
        response = await searchApi.searchMovies(debouncedQuery, page);
      } else if (selectedType === 'tv') {
        response = await searchApi.searchTV(debouncedQuery, page);
      } else {
        response = await searchApi.search(debouncedQuery, page);
      }

      // Filter by genre if selected
      if (selectedGenre && response.results) {
        response.results = response.results.filter(item =>
          item.genreIds?.includes(parseInt(selectedGenre))
        );
      }

      return response;
    } catch (error) {
      throw new Error('Search failed');
    }
  }, [debouncedQuery, selectedGenre, selectedType]);

  const hasActiveFilters = selectedGenre || selectedType !== 'all';

  return (
    <div className="search-page">
      {/* Search Header */}
      <div className="search-header">
        <div className="search-container">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for movies, TV shows..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
              autoFocus
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>

          <button
            className={`filter-toggle-btn ${showFilters ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
            onClick={toggleFilters}
            aria-label="Toggle filters"
          >
            <FiFilter />
            Filters
            {hasActiveFilters && (
              <span className="filter-count">
                {selectedGenre ? 1 : 0 + (selectedType !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label className="filter-label">Type:</label>
              <div className="filter-options">
                <button
                  className={`filter-option ${selectedType === 'all' ? 'active' : ''}`}
                  onClick={() => handleTypeChange('all')}
                >
                  All
                </button>
                <button
                  className={`filter-option ${selectedType === 'movie' ? 'active' : ''}`}
                  onClick={() => handleTypeChange('movie')}
                >
                  Movies
                </button>
                <button
                  className={`filter-option ${selectedType === 'tv' ? 'active' : ''}`}
                  onClick={() => handleTypeChange('tv')}
                >
                  TV Shows
                </button>
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Genre:</label>
              <select
                value={selectedGenre}
                onChange={(e) => handleGenreChange(e.target.value)}
                className="genre-select"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="search-results">
        {debouncedQuery || hasActiveFilters ? (
          <MovieGrid
            fetchData={searchWithFilters}
            title={
              debouncedQuery
                ? `Search Results for "${debouncedQuery}"`
                : 'Filtered Results'
            }
            emptyMessage={
              debouncedQuery
                ? `No results found for "${debouncedQuery}". Try different keywords.`
                : 'No results found with current filters.'
            }
            cardSize="medium"
            showType={true}
            showYear={true}
            showRating={true}
          />
        ) : (
          <div className="search-prompt">
            <div className="prompt-content">
              <FiSearch className="prompt-icon" />
              <h2 className="prompt-title">Start Your Search</h2>
              <p className="prompt-description">
                Search for movies, TV shows, or use filters to find specific content.
              </p>
              <div className="prompt-suggestions">
                <h3>Popular searches:</h3>
                <div className="suggestion-tags">
                  {['Action', 'Comedy', 'Drama', 'Thriller', 'Sci-Fi', 'Horror'].map(tag => (
                    <button
                      key={tag}
                      className="suggestion-tag"
                      onClick={() => handleSearch(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;