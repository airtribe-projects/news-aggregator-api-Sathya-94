
/**
 * Main Express application setup for News Aggregator API
 * Loads environment variables, connects to MongoDB, and registers all routes.
 * @module app
 */

require('dotenv').config(); // Load environment variables from .env file

const connectDB = require('./db');
connectDB(); // Establish MongoDB connection

const express = require('express');
const app = express();

// Middleware for parsing JSON and urlencoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register authentication routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

// Register user preferences routes
const preferencesRoutes = require('./routes/preferences');
app.use('/', preferencesRoutes);

// Register news routes
const newsRoutes = require('./routes/news');
app.use('/', newsRoutes);

/**
 * Export the Express app for use in server.js and testing
 */
module.exports = app;