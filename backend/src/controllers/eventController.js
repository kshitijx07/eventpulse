const eventService = require('../services/eventService');

const getEvents = async (req, res, next) => {
  try {
    const events = await eventService.getEvents(req.query);
    res.json({ success: true, data: events });
  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(500).json({ success: false, message: 'Ticketmaster API key is invalid' });
    }
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.json({ success: true, data: event });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    next(error);
  }
};

module.exports = { getEvents, getEventById };
