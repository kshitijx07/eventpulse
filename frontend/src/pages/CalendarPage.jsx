import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import api from '../services/api'
import Calendar from '../components/Calendar'
import EventCard from '../components/EventCard'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [events, setEvents] = useState([])
  const [eventDates, setEventDates] = useState([])
  const [rsvpIds, setRsvpIds] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch events for current month to get event dates
  useEffect(() => {
    const fetchMonthEvents = async () => {
      try {
        const now = new Date()
        const start = format(startOfMonth(now), "yyyy-MM-dd'T'HH:mm:ss'Z'")
        const end = format(endOfMonth(now), "yyyy-MM-dd'T'HH:mm:ss'Z'")
        const res = await api.get('/events', { params: { startDateTime: start, endDateTime: end, size: 50 } })
        const dates = [...new Set(res.data.data.map(e => e.date))]
        setEventDates(dates)
      } catch (err) {
        console.error('Failed to load month events:', err)
      }
    }
    fetchMonthEvents()
  }, [])

  // Fetch RSVP IDs
  useEffect(() => {
    api.get('/rsvps/event-ids').then(res => setRsvpIds(res.data.data)).catch(() => {})
  }, [])

  const handleDateSelect = async (date) => {
    setSelectedDate(date)
    setLoading(true)
    try {
      const dateStr = format(date, 'yyyy-MM-dd')
      const start = dateStr + 'T00:00:00Z'
      const end = dateStr + 'T23:59:59Z'
      const res = await api.get('/events', { params: { startDateTime: start, endDateTime: end } })
      setEvents(res.data.data)
    } catch (err) {
      setEvents([])
    }
    setLoading(false)
  }

  const handleRsvpChange = (eventId, isRsvped) => {
    setRsvpIds(prev =>
      isRsvped ? [...prev, eventId] : prev.filter(id => id !== eventId)
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Event Calendar</h1>
      <p className="text-gray-500 mb-6">Browse events by date</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Calendar
            eventDates={eventDates}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>

        <div className="lg:col-span-2">
          {!selectedDate && (
            <div className="text-center py-12 text-gray-400">
              <p>Select a date to see events</p>
            </div>
          )}

          {selectedDate && loading && (
            <div className="text-center py-12 text-gray-500">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
              <p>Loading events...</p>
            </div>
          )}

          {selectedDate && !loading && events.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No events found for {format(selectedDate, 'MMMM d, yyyy')}.</p>
            </div>
          )}

          {selectedDate && !loading && events.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Events on {format(selectedDate, 'MMMM d, yyyy')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isRsvped={rsvpIds.includes(event.id)}
                    onRsvpChange={handleRsvpChange}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
