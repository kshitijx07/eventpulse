const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/demoUser');

// Route imports
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
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

// Public routes (no auth needed)
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/share', shareRoutes);

// Protected routes (auth required)
app.use('/api', authMiddleware);
app.use('/api/events', eventRoutes);
app.use('/api/rsvps', rsvpRoutes);
app.use('/api/events', referralRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
