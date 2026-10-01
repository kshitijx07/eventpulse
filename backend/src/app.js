const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const demoUser = require('./middleware/demoUser');

// Route imports
const healthRoutes = require('./routes/healthRoutes');
const eventRoutes = require('./routes/eventRoutes');
const rsvpRoutes = require('./routes/rsvpRoutes');
const referralRoutes = require('./routes/referralRoutes');
const shareRoutes = require('./routes/shareRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health route (no auth needed)
app.use('/api/health', healthRoutes);

// Demo user middleware for all other API routes
app.use('/api', demoUser);

// API routes
app.use('/api/events', eventRoutes);
app.use('/api/rsvps', rsvpRoutes);
app.use('/api/events', referralRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
