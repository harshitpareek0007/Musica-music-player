import apiClient from './apiClient';

/**
 * Music Provider Architecture
 * Supports multiple music sources (Audius, Jamendo, etc.)
 * Easily extensible for fallback providers.
 */
class AudiusProvider {
  async getTrending() {
    const response = await apiClient.get('/trending');
    return response.data.data;
  }

  async searchTracks(query) {
    const response = await apiClient.get(`/search/tracks?query=${encodeURIComponent(query)}`);
    return response.data.data;
  }
}

import axios from 'axios';

class FallbackProvider {
  async getHost() {
    try {
      const res = await axios.get('https://api.audius.co');
      return res.data.data[0] || 'https://discoveryprovider.audius.co';
    } catch {
      return 'https://audius-discovery-1.theblueprint.xyz';
    }
  }

  async getTrending() {
    console.log("Using fallback provider for trending");
    const host = await this.getHost();
    const res = await axios.get(`${host}/v1/tracks/trending?app_name=MusicaApp`);
    return res.data.data;
  }
  
  async searchTracks(query) {
    console.log("Using fallback provider for search");
    const host = await this.getHost();
    const res = await axios.get(`${host}/v1/tracks/search?query=${encodeURIComponent(query)}&app_name=MusicaApp`);
    return res.data.data;
  }
}

class MusicService {
  constructor() {
    this.primaryProvider = new AudiusProvider();
    this.fallbackProvider = new FallbackProvider();
    this.cache = new Map(); // Simple in-memory cache
  }

  async getTrending() {
    if (this.cache.has('trending')) {
      return this.cache.get('trending');
    }
    try {
      const data = await this.primaryProvider.getTrending();
      if (!data || data.length === 0) throw new Error("No data from primary provider");
      this.cache.set('trending', data);
      return data;
    } catch (error) {
      console.error('Error in primary provider, using fallback', error);
      return await this.fallbackProvider.getTrending();
    }
  }
  
  async searchTracks(query) {
    const cacheKey = `search_${query}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    try {
      const data = await this.primaryProvider.searchTracks(query);
      if (!data || data.length === 0) throw new Error("No data from primary provider");
      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error searching tracks in primary provider, using fallback', error);
      return await this.fallbackProvider.searchTracks(query);
    }
  }
}

export const musicApi = new MusicService();
