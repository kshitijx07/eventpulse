const Rsvp = require('../models/Rsvp');

const createRsvp = async (userId, eventData) => {
  // Check for duplicate
  const existing = await Rsvp.findOne({ userId, eventId: eventData.eventId });
  if (existing) {
    const error = new Error('You have already RSVP\'d to this event');
    error.statusCode = 409;
    throw error;
  }

  const rsvp = await Rsvp.create({
    userId,
    eventId: eventData.eventId,
    eventName: eventData.eventName,
    eventDate: eventData.eventDate,
    eventVenue: eventData.eventVenue,
    eventImage: eventData.eventImage,
    status: 'interested'
  });

  return rsvp;
};

const getUserRsvps = async (userId) => {
  return Rsvp.find({ userId }).sort({ createdAt: -1 });
};

const deleteRsvp = async (userId, eventId) => {
  const rsvp = await Rsvp.findOneAndDelete({ userId, eventId });
  if (!rsvp) {
    const error = new Error('RSVP not found');
    error.statusCode = 404;
    throw error;
  }
  return rsvp;
};

// Check which events a user has RSVP'd to (for batch checking on event cards)
const getUserRsvpEventIds = async (userId) => {
  const rsvps = await Rsvp.find({ userId }).select('eventId');
  return rsvps.map(r => r.eventId);
};

module.exports = { createRsvp, getUserRsvps, deleteRsvp, getUserRsvpEventIds };
