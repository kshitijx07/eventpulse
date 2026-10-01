const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const demoUser = require('./middleware/demoUser');

// Route imports
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health route (no auth needed)
app.use('/api/health', healthRoutes);

// Demo user middleware for all other API routes
app.use('/api', demoUser);

// Error handler
app.use(errorHandler);

module.exports = app;
