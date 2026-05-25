import axios from 'axios';

// Get a random Audius host for streaming if needed, but we rely mostly on our backend proxy
// Backend URL (assuming running on localhost:5000)
const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/music` : 'http://localhost:5000/api/music';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
