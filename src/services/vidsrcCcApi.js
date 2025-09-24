/**
 * VidSrc.cc API service for streaming embeds
 * Based on deep research response (2025-09-23)
 * Supports TMDB/IMDB IDs, movies, and TV shows
 */
import axios from 'axios';

const BASE_URL = 'https://vidsrc.cc';

export const vidsrcCcApi = {
  // Get movie embed URL
  getMovieStreamFromDomain: (tmdbId, imdbId, domain = 'vidsrc.cc') => {
    const id = tmdbId || imdbId;
    if (!id) {
      console.error('VidSrc.cc: No TMDB or IMDB ID provided');
      return null;
    }
    const baseUrl = `https://${domain}/v2/embed/movie/${id}`;
    const params = new URLSearchParams({
      autoplay: '1',
      autonext: '1',
    });
    const url = `${baseUrl}?${params.toString()}`;
    console.log(`VidSrc.cc URL generated: ${url}`);
    return url;
  },

  // Get TV episode embed URL
  getTvStreamFromDomain: (tmdbId, imdbId, season, episode, domain = 'vidsrc.cc') => {
    const id = tmdbId || imdbId;
    const baseUrl = `https://${domain}/v2/embed/tv/${id}/${season}/${episode}`;
    const params = new URLSearchParams({
      autoplay: '1',
      autonext: '1',
    });
    return `${baseUrl}?${params.toString()}`;
  },

  // Fetch M3U8 URL for quality selection (from grok.md)
  getM3u8Url: async (imdbId, season = null, episode = null) => {
    // Avoid dev-time CORS errors in browser
    try {
      if (typeof window !== 'undefined' && window.location.origin.includes('localhost')) {
        console.warn('Skipping M3U8 fetch in dev (CORS). Falling back to embed.');
        return null;
      }
    } catch {}
    const endpoint = season && episode
      ? `https://api.vercel.app/vidsrc/${imdbId}?s=${season}&e=${episode}`
      : `https://api.vercel.app/vidsrc/${imdbId}`;
    try {
      const response = await axios.get(endpoint);
      const data = response.data;
      if (data.status === 200 && data.sources && data.sources.length > 0) {
        const streamUrl = data.sources[0].data.stream;
        console.log(`VidSrc.cc M3U8 fetched: ${streamUrl}`);
        return streamUrl;
      }
      throw new Error('No M3U8 found');
    } catch (error) {
      console.error('VidSrc.cc M3U8 fetch error:', error);
      return null;
    }
  },

  // API endpoint for generating embed URLs (from response)
  getEmbedFromApi: async (imdbId, season = null, episode = null) => {
    const endpoint = season && episode
      ? `https://vidsrc.xyz/embed/tv?imdb=${imdbId}&season=${season}&episode=${episode}`
      : `https://vidsrc.xyz/embed/movie?imdb=${imdbId}`;
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      return data.embedUrl || endpoint;
    } catch (error) {
      console.error('VidSrc.cc API error:', error);
      return null;
    }
  },

  // List of domains for rotation
  domains: ['vidsrc.cc', 'vidsrc.xyz'], // Add more if needed
};
