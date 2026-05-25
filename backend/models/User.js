const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
  id: String,
  title: String,
  user: {
    name: String,
  },
  artwork: {
    '150x150': String,
    '480x480': String,
  },
  genre: String,
});

const PlaylistSchema = new mongoose.Schema({
  id: String,
  name: String,
  songs: [TrackSchema],
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  country: { type: String, default: 'India', index: true },
  favoriteGenres: [{ type: String, index: true }],
  favoriteMoods: [String],
  likedSongs: [TrackSchema],
  history: [TrackSchema],
  playlists: [PlaylistSchema],
  isPremium: { type: Boolean, default: false },
}, { timestamps: true });

UserSchema.index({ "likedSongs.title": 1, "history.title": 1 });
UserSchema.index({ "likedSongs.genre": 1 });

module.exports = mongoose.model('User', UserSchema);
