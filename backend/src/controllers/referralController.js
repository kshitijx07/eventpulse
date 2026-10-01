const referralService = require('../services/referralService');
const eventService = require('../services/eventService');

const createShareLink = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ success: false, message: 'eventId is required' });
    }
    const shareLink = await referralService.createShareLink(req.userId, eventId);
    res.status(201).json({
      success: true,
      data: {
        code: shareLink.code,
        shareUrl: `/share/${shareLink.code}`
      }
    });
  } catch (error) {
    next(error);
  }
};

const resolveShareLink = async (req, res, next) => {
  try {
    const { code } = req.params;
    const visitorId = req.query.visitorId || req.ip;

    const shareLink = await referralService.resolveShareLink(code, visitorId);

    // Fetch the event from Ticketmaster
    let event = null;
    try {
      event = await eventService.getEventById(shareLink.eventId);
    } catch (e) {
      // Event might no longer exist on Ticketmaster
    }

    const friendsAttending = await referralService.getFriendsAttending(shareLink.eventId);

    res.json({
      success: true,
      data: {
        event,
        shareLink: {
          code: shareLink.code,
          clicks: shareLink.clicks,
          uniqueVisitors: shareLink.uniqueVisitors.length
        },
        friendsAttending
      }
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

const getFriendsAttending = async (req, res, next) => {
  try {
    const count = await referralService.getFriendsAttending(req.params.eventId);
    res.json({ success: true, data: { count } });
  } catch (error) {
    next(error);
  }
};

module.exports = { createShareLink, resolveShareLink, getFriendsAttending };
