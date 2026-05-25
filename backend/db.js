require("dotenv").config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/musica';
    const conn = await mongoose.connect(mongoURI);
    console.log(`[SUCCESS] MongoDB Atlas Connected successfully: ${conn.connection.host}`);
    console.log(`[SUCCESS] Database used: ${conn.connection.name}`);
  } catch (err) {
    console.error('[ERROR] MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
