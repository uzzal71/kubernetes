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
