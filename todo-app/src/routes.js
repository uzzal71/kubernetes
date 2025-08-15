/**
 * Main Application Routes
 * -----------------------
 * This file registers all route modules for the application.
 */

const express = require('express');
const router = express.Router();

// Module routes
const userRoutes = require('./modules/user/user.routes');
const todoRoutes = require('./modules/todo/todo.routes');

// Base route - health check / server status
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '🚀 Server is running successfully',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      api: {
        version: 'v1',
        endpoints: [
          { method: 'GET', path: '/api/v1/users' },
          { method: 'GET', path: '/api/v1/todos' }
        ]
      }
    }
  });
});


// Register routes
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/todos', todoRoutes);

// Default 404 handler for undefined routes
router.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

module.exports = router;
