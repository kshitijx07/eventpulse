const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: String, required: true },
  eventName: { type: String, required: true },
  eventDate: { type: String },
  eventVenue: { type: String },
  eventImage: { type: String },
  status: { type: String, default: 'interested' },
  createdAt: { type: Date, default: Date.now }
});

// Prevent duplicate RSVPs
rsvpSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Rsvp', rsvpSchema);
