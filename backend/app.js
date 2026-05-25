const express = require('express');
const cors = require('cors');
const musicRoutes = require('./routes/music');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

// Routes
app.use('/api/music', musicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Catch-all route to serve React app for any other requests (Client-side routing)
const path = require('path');
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

module.exports = app;
