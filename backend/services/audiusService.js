const axios = require('axios');

// Helper to get a random Audius host
const getAudiusHost = async () => {
  try {
    const response = await axios.get('https://api.audius.co');
    return response.data.data[0];
  } catch (error) {
    console.error('Failed to get Audius host', error);
    return 'https://audius-discovery-1.theblueprint.xyz'; // fallback
  }
};

const APP_NAME = process.env.AUDIUS_APP_NAME || 'MyMusicApp';

// Service to fetch trending tracks
exports.getTrendingTracks = async () => {
  const host = await getAudiusHost();
  const response = await axios.get(`${host}/v1/tracks/trending`, {
    params: { app_name: APP_NAME, limit: 20 }
  });
  return response.data;
};

// Service to search tracks
exports.searchTracks = async (query) => {
  const host = await getAudiusHost();
  const response = await axios.get(`${host}/v1/tracks/search`, {
    params: { app_name: APP_NAME, query, limit: 20 }
  });
  return response.data;
};
