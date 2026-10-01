import { useState, useEffect } from 'react'
import api from '../services/api'
import EventCard from '../components/EventCard'

export default function DiscoverPage() {
  const [events, setEvents] = useState([])
  const [rsvpIds, setRsvpIds] = useState([])
  const [friendsCounts, setFriendsCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [city, setCity] = useState('')

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (keyword) params.keyword = keyword
      if (city) params.city = city
      const res = await api.get('/events', { params })
      setEvents(res.data.data)

      // Fetch RSVP state
      const rsvpRes = await api.get('/rsvps/event-ids')
      setRsvpIds(rsvpRes.data.data)

      // Fetch friends counts
      const counts = {}
      for (const event of res.data.data) {
        try {
          const fcRes = await api.get(`/events/${event.id}/friends-count`)
          counts[event.id] = fcRes.data.data.count
        } catch { counts[event.id] = 0 }
      }
      setFriendsCounts(counts)
    } catch (err) {
      setError('Unable to load events. Please try again.')
    }
    setLoading(false)
  }

  useEffect(() => { fetchEvents() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchEvents()
  }

  const handleRsvpChange = (eventId, isRsvped) => {
    setRsvpIds(prev =>
      isRsvped ? [...prev, eventId] : prev.filter(id => id !== eventId)
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Discover Events</h1>
        <p className="text-gray-500 mt-1">Find something worth attending</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search events..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
          className="w-36 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          🔍 Search
        </button>
      </form>

      {loading && (
        <div className="text-center py-12 text-gray-500">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
          <p>Finding events...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12 text-red-500">
          <p>⚠️ {error}</p>
          <button onClick={fetchEvents} className="mt-2 text-indigo-600 hover:underline">Try again</button>
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No events found. Try a different search.</p>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              isRsvped={rsvpIds.includes(event.id)}
              onRsvpChange={handleRsvpChange}
              friendsCount={friendsCounts[event.id] || 0}
            />
          ))}
        </div>
      )}
    </div>
  )
}
