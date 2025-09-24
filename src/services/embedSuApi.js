/**
 * Embed.su API service for streaming embeds
 * Based on deep research response (2025-09-23)
 * Supports TMDB/IMDB IDs, movies, and TV shows
 */
import axios from 'axios';

const BASE_URL = 'https://multiembed.mov';

export const embedSuApi = {
  // Get movie embed URL
  getMovieStreamFromDomain: (tmdbId, imdbId, domain = 'multiembed.mov') => {
    const id = tmdbId || imdbId;
    const tmdbParam = tmdbId ? '&tmdb=1' : '';
    const baseUrl = `https://${domain}/?video_id=${id}${tmdbParam}`;
    const params = new URLSearchParams({
      check: '1', // For VIP player
    });
    return `${baseUrl}&${params.toString()}`;
  },

  // Get TV episode embed URL
  getTvStreamFromDomain: (tmdbId, imdbId, season, episode, domain = 'multiembed.mov') => {
    const id = tmdbId || imdbId;
    const tmdbParam = tmdbId ? '&tmdb=1' : '';
    const baseUrl = `https://${domain}/?video_id=${id}&s=${season}&e=${episode}${tmdbParam}`;
    const params = new URLSearchParams({
      check: '1',
    });
    return `${baseUrl}&${params.toString()}`;
  },

  // Fetch M3U8 URL for quality selection (no official, from grok.md)
  getM3u8Url: async (tmdbId, imdbId, season = null, episode = null) => {
    // No official API; placeholder for scraping
    const embedUrl = season && episode
      ? embedSuApi.getTvStreamFromDomain(tmdbId, imdbId, season, episode)
      : embedSuApi.getMovieStreamFromDomain(tmdbId, imdbId);
    try {
      console.log(`Embed.su M3U8 fetch not implemented; using embed: ${embedUrl}`);
      return null; // Implement scraping if needed
    } catch (error) {
      console.error('Embed.su M3U8 fetch error:', error);
      return null;
    }
  },

  // No formal API; direct embed only
  getEmbedFromApi: async (tmdbId, imdbId, season = null, episode = null) => {
    return season && episode
      ? embedSuApi.getTvStreamFromDomain(tmdbId, imdbId, season, episode)
      : embedSuApi.getMovieStreamFromDomain(tmdbId, imdbId);
  },

  // List of domains for rotation
  domains: ['multiembed.mov', 'embed.su'], // Main and alternative
};
