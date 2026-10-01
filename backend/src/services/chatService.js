const eventService = require('./eventService');
const rsvpService = require('./rsvpService');

// Simple deterministic intent parser
const parseIntent = (message) => {
  const lower = message.toLowerCase().trim();

  // Check for "my events" / "my rsvps"
  if (lower.includes('my event') || lower.includes('my rsvp')) {
    return { intent: 'MY_EVENTS' };
  }

  const params = {};

  // Extract city: "in <city>"
  const cityMatch = lower.match(/in\s+([a-zA-Z\s]+?)(?:\s+this|\s+next|\s+today|\s+tomorrow|$)/);
  if (cityMatch) params.city = cityMatch[1].trim();

  // Extract classification: concerts, sports, arts, theatre, music
  const classifications = ['concerts', 'concert', 'sports', 'sport', 'arts', 'art', 'theatre', 'theater', 'music', 'comedy', 'festival'];
  for (const cls of classifications) {
    if (lower.includes(cls)) {
      params.classificationName = cls.replace(/s$/, ''); // normalize plural
      break;
    }
  }

  // Extract date ranges
  const now = new Date();
  if (lower.includes('today')) {
    params.startDateTime = formatTMDate(now);
    params.endDateTime = formatTMDate(endOfDay(now));
  } else if (lower.includes('tomorrow')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    params.startDateTime = formatTMDate(tomorrow);
    params.endDateTime = formatTMDate(endOfDay(tomorrow));
  } else if (lower.includes('this weekend')) {
    const saturday = getNextDayOfWeek(now, 6);
    const sunday = new Date(saturday);
    sunday.setDate(sunday.getDate() + 1);
    params.startDateTime = formatTMDate(saturday);
    params.endDateTime = formatTMDate(endOfDay(sunday));
  } else if (lower.includes('this week')) {
    params.startDateTime = formatTMDate(now);
    const endOfWeek = new Date(now);
    endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
    params.endDateTime = formatTMDate(endOfDay(endOfWeek));
  }

  // Extract keyword (anything that isn't a recognized pattern)
  if (!params.city && !params.classificationName && !params.startDateTime) {
    params.keyword = lower.replace(/show\s+me|find|search|events?|please|the/gi, '').trim();
    if (!params.keyword) params.keyword = undefined;
  }

  return { intent: 'SEARCH_EVENTS', params };
};

const formatTMDate = (date) => {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

const endOfDay = (date) => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 0);
  return end;
};

const getNextDayOfWeek = (date, dayOfWeek) => {
  const result = new Date(date);
  const diff = (dayOfWeek - result.getDay() + 7) % 7;
  result.setDate(result.getDate() + (diff === 0 ? 0 : diff));
  result.setHours(0, 0, 0, 0);
  return result;
};

const processMessage = async (message, userId) => {
  const { intent, params } = parseIntent(message);

  if (intent === 'MY_EVENTS') {
    const rsvps = await rsvpService.getUserRsvps(userId);
    if (rsvps.length === 0) {
      return { message: "You haven't RSVP'd to any events yet.", events: [] };
    }
    return {
      message: `You have ${rsvps.length} event${rsvps.length > 1 ? 's' : ''} in your list.`,
      events: rsvps.map(r => ({
        id: r.eventId,
        title: r.eventName,
        venue: r.eventVenue,
        date: r.eventDate,
        image: r.eventImage
      }))
    };
  }

  // SEARCH_EVENTS
  try {
    const events = await eventService.getEvents(params || {});
    if (events.length === 0) {
      return { message: 'No events found matching your request.', events: [] };
    }
    return {
      message: `I found ${events.length} event${events.length > 1 ? 's' : ''} for you!`,
      events
    };
  } catch (error) {
    return { message: 'Sorry, I had trouble finding events. Please try again.', events: [] };
  }
};

module.exports = { processMessage };
