const axios = require('axios');

const TICKETMASTER_BASE = 'https://app.ticketmaster.com/discovery/v2/events.json';

// Normalize a single Ticketmaster event into our clean DTO
const normalizeEvent = (event) => ({
  id: event.id,
  title: event.name,
  venue: event._embedded?.venues?.[0]?.name || 'TBA',
  city: event._embedded?.venues?.[0]?.city?.name || '',
  date: event.dates?.start?.localDate || '',
  time: event.dates?.start?.localTime || '',
  image: (event.images || []).find(i => i.ratio === '16_9' && i.width > 500)?.url
    || event.images?.[0]?.url || '',
  url: event.url || '',
  genre: event.classifications?.[0]?.genre?.name || '',
  segment: event.classifications?.[0]?.segment?.name || ''
});

// Fetch events from Ticketmaster with optional filters
const getEvents = async (params = {}) => {
  const queryParams = {
    apikey: process.env.TICKETMASTER_API_KEY,
    size: params.size || 20,
    sort: 'date,asc'
  };

  if (params.keyword) queryParams.keyword = params.keyword;
  if (params.city) queryParams.city = params.city;
  if (params.classificationName) queryParams.classificationName = params.classificationName;
  if (params.startDateTime) queryParams.startDateTime = params.startDateTime;
  if (params.endDateTime) queryParams.endDateTime = params.endDateTime;

  const response = await axios.get(TICKETMASTER_BASE, { params: queryParams });

  const events = response.data._embedded?.events || [];
  return events.map(normalizeEvent);
};

// Fetch single event by ID
const getEventById = async (eventId) => {
  const url = `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json`;
  const response = await axios.get(url, {
    params: { apikey: process.env.TICKETMASTER_API_KEY }
  });
  return normalizeEvent(response.data);
};

module.exports = { getEvents, getEventById };
