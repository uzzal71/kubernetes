require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

if (!config.mongoUri) throw new Error('MONGODB_URI is required');
if (!config.jwt.secret) throw new Error('JWT_SECRET is required');

module.exports = config;