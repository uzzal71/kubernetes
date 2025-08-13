const mongoose = require('mongoose');
const config = require('../config');

async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongoUri, {
    autoIndex: config.env === 'development',
  });
  console.log('🗄️  MongoDB connected');
}

module.exports = connectDB;