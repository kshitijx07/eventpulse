const { nanoid } = require('nanoid');
const ShareLink = require('../models/ShareLink');

const createShareLink = async (userId, eventId) => {
  // Return existing share link if user already created one for this event
  const existing = await ShareLink.findOne({ eventId, creatorUserId: userId });
  if (existing) return existing;

  const code = nanoid(10);
  const shareLink = await ShareLink.create({
    eventId,
    creatorUserId: userId,
    code
  });
  return shareLink;
};

const resolveShareLink = async (code, visitorId) => {
  const shareLink = await ShareLink.findOne({ code });
  if (!shareLink) {
    const error = new Error('Invalid share code');
    error.statusCode = 404;
    throw error;
  }

  // Increment clicks
  shareLink.clicks += 1;

  // Track unique visitors
  if (visitorId && !shareLink.uniqueVisitors.includes(visitorId)) {
    shareLink.uniqueVisitors.push(visitorId);
  }

  await shareLink.save();
  return shareLink;
};

// Get total friends attending (unique visitors across all share links for an event)
const getFriendsAttending = async (eventId) => {
  const shareLinks = await ShareLink.find({ eventId });
  const allVisitors = new Set();
  shareLinks.forEach(link => {
    link.uniqueVisitors.forEach(v => allVisitors.add(v));
  });
  return allVisitors.size;
};

module.exports = { createShareLink, resolveShareLink, getFriendsAttending };
