const audiusService = require('../services/audiusService');

// Controller to handle trending songs request
exports.getTrending = async (req, res, next) => {
  try {
    const data = await audiusService.getTrendingTracks();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

// Controller to handle search tracks request
exports.searchTracks = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const data = await audiusService.searchTracks(query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
