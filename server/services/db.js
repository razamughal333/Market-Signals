const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('MONGODB_URI not set — running without a database (data resets on restart).');
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    return true;
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.warn('Continuing without a database — data will not persist between restarts.');
    return false;
  }
}

module.exports = { connectDB };
