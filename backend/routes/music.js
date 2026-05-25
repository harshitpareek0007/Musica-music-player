const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController');

// Route to get trending songs
router.get('/trending', musicController.getTrending);

// Route to search tracks
router.get('/search/tracks', musicController.searchTracks);

module.exports = router;
