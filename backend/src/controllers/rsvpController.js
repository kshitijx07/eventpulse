const rsvpService = require('../services/rsvpService');

const createRsvp = async (req, res, next) => {
  try {
    const { eventId, eventName, eventDate, eventVenue, eventImage } = req.body;
    if (!eventId || !eventName) {
      return res.status(400).json({ success: false, message: 'eventId and eventName are required' });
    }
    const rsvp = await rsvpService.createRsvp(req.userId, req.body);
    res.status(201).json({ success: true, data: rsvp });
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const getUserRsvps = async (req, res, next) => {
  try {
    const rsvps = await rsvpService.getUserRsvps(req.userId);
    res.json({ success: true, data: rsvps });
  } catch (error) {
    next(error);
  }
};

const deleteRsvp = async (req, res, next) => {
  try {
    await rsvpService.deleteRsvp(req.userId, req.params.eventId);
    res.json({ success: true, message: 'RSVP removed' });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const getUserRsvpEventIds = async (req, res, next) => {
  try {
    const eventIds = await rsvpService.getUserRsvpEventIds(req.userId);
    res.json({ success: true, data: eventIds });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRsvp, getUserRsvps, deleteRsvp, getUserRsvpEventIds };
