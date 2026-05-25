const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'premium_music_secret_12345';

// Middleware to protect routes
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Token is invalid' });
  }
};

router.post('/like', auth, async (req, res) => {
  try {
    const { song } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.likedSongs.find(s => s.id === song.id)) {
      user.likedSongs.push(song);
      await user.save();
    }
    res.json(user.likedSongs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/like/:songId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.likedSongs = user.likedSongs.filter(s => s.id !== req.params.songId);
    await user.save();
    res.json(user.likedSongs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/history', auth, async (req, res) => {
  try {
    const { song } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.history = [song, ...user.history.filter(s => s.id !== song.id)].slice(0, 50);
    await user.save();
    res.json(user.history);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Playlist routes
router.post('/playlists', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newPlaylist = {
      id: Date.now().toString(),
      name,
      songs: []
    };

    user.playlists.push(newPlaylist);
    await user.save();
    res.json(newPlaylist);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/playlists/:playlistId/songs', auth, async (req, res) => {
  try {
    const { song } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const playlist = user.playlists.find(p => p.id === req.params.playlistId);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

    if (!playlist.songs.find(s => s.id === song.id)) {
      playlist.songs.push(song);
      await user.save();
    }
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/playlists/:playlistId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.playlists = user.playlists.filter(p => p.id !== req.params.playlistId);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Settings update
router.put('/settings', auth, async (req, res) => {
  try {
    const { country, favoriteGenres, favoriteMoods } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (country) user.country = country;
    if (favoriteGenres) user.favoriteGenres = favoriteGenres;
    if (favoriteMoods) user.favoriteMoods = favoriteMoods;
    
    await user.save();
    res.json({ country: user.country, favoriteGenres: user.favoriteGenres, favoriteMoods: user.favoriteMoods });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
