/**
 * Application Configuration
 * -------------------------
 * This file sets up Express, middlewares, routes, and error handling.
 */

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const ApiError = require('./utils/ApiError');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Register main routes
app.use(routes);

// Handle non-existing endpoints
app.use((req, res, next) => {
  next(new ApiError(404, 'Not Found'));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
