import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiStar, FiPlay, FiUsers } from 'react-icons/fi';
import MovieGrid from '../MovieGrid/MovieGrid';
import { trendingApi, moviesApi, tvApi } from '../../services/tmdbApi';
import { useSettings } from '../../context/SettingsContext';
import './Home.css';

const Home = () => {
  const [heroContent, setHeroContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    loadHeroContent();
  }, []);

  const loadHeroContent = async () => {
    try {
      setLoading(true);
      // Get trending content for hero section
      const trendingResponse = await trendingApi.getAll('week', 1);
      if (trendingResponse.results && trendingResponse.results.length > 0) {
        // Pick a random trending item for hero
        const randomIndex = Math.floor(Math.random() * Math.min(trendingResponse.results.length, 5));
        setHeroContent(trendingResponse.results[randomIndex]);
      }
    } catch (error) {
      console.error('Error loading hero content:', error);
    } finally {
      setLoading(false);
    }
  };

  const heroStyle = heroContent?.backdropPath ? {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(https://image.tmdb.org/t/p/original${heroContent.backdropPath})`
  } : {};

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section" style={heroStyle}>
        <div className="hero-content">
          <div className="hero-info">
            {heroContent && (
              <>
                <div className="hero-type">
                  <span className={`type-badge ${heroContent.type}`}>
                    {heroContent.type === 'movie' ? 'Movie' : 'TV Show'}
                  </span>
                </div>
                <h1 className="hero-title">{heroContent.title}</h1>
                <div className="hero-meta">
                  <span className="hero-year">
                    {new Date(heroContent.releaseDate).getFullYear()}
                  </span>
                  {heroContent.voteAverage > 0 && (
                    <div className="hero-rating">
                      <FiStar className="rating-icon" />
                      <span>{heroContent.voteAverage.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                {heroContent.overview && (
                  <p className="hero-description">
                    {heroContent.overview.length > 200
                      ? `${heroContent.overview.substring(0, 200)}...`
                      : heroContent.overview
                    }
                  </p>
                )}
                <div className="hero-actions">
                  <Link
                    to={`/play/${heroContent.type}/${heroContent.id}`}
                    className="hero-play-btn"
                  >
                    <FiPlay className="play-icon" />
                    Watch Now
                  </Link>
                  <Link
                    to={`/${heroContent.type}/${heroContent.id}`}
                    className="hero-info-btn"
                  >
                    More Info
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hero Navigation Dots */}
        <div className="hero-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </section>

      {/* Content Sections */}
      <div className="home-content">
        {/* Trending Section */}
        <section className="content-section">
          <MovieGrid
            fetchData={trendingApi.getAll}
            fetchParams={{ timeWindow: 'week' }}
            title={
              <div className="section-header">
                <FiTrendingUp className="section-icon" />
                <span>Trending Now</span>
              </div>
            }
            cardSize="medium"
            showType={true}
            showYear={true}
            showRating={true}
          />
        </section>

        {/* Popular Movies Section */}
        <section className="content-section">
          <MovieGrid
            fetchData={moviesApi.getPopular}
            title={
              <div className="section-header">
                <FiPlay className="section-icon" />
                <span>Popular Movies</span>
              </div>
            }
            cardSize="medium"
            showType={true}
            showYear={true}
            showRating={true}
          />
        </section>

        {/* Top Rated Movies Section */}
        <section className="content-section">
          <MovieGrid
            fetchData={moviesApi.getTopRated}
            title={
              <div className="section-header">
                <FiStar className="section-icon" />
                <span>Top Rated Movies</span>
              </div>
            }
            cardSize="medium"
            showType={true}
            showYear={true}
            showRating={true}
          />
        </section>

        {/* Popular TV Shows Section */}
        <section className="content-section">
          <MovieGrid
            fetchData={tvApi.getPopular}
            title={
              <div className="section-header">
                <FiUsers className="section-icon" />
                <span>Popular TV Shows</span>
              </div>
            }
            cardSize="medium"
            showType={true}
            showYear={true}
            showRating={true}
          />
        </section>

        {/* Top Rated TV Shows Section */}
        <section className="content-section">
          <MovieGrid
            fetchData={tvApi.getTopRated}
            title={
              <div className="section-header">
                <FiStar className="section-icon" />
                <span>Top Rated TV Shows</span>
              </div>
            }
            cardSize="medium"
            showType={true}
            showYear={true}
            showRating={true}
          />
        </section>
      </div>
    </div>
  );
};

export default Home;