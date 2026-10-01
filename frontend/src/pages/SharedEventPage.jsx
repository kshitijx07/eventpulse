import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'

export default function SharedEventPage() {
  const { code } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rsvpDone, setRsvpDone] = useState(false)

  useEffect(() => {
    const resolve = async () => {
      try {
        // Generate a simple visitor ID to track unique visitors
        let visitorId = localStorage.getItem('eventpulse_visitor')
        if (!visitorId) {
          visitorId = 'v_' + Math.random().toString(36).substring(2, 10)
          localStorage.setItem('eventpulse_visitor', visitorId)
        }

        const res = await api.get(`/share/${code}?visitorId=${visitorId}`)
        setData(res.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid share link')
      }
      setLoading(false)
    }
    resolve()
  }, [code])

  const handleRsvp = async () => {
    if (!data?.event) return
    try {
      await api.post('/rsvps', {
        eventId: data.event.id,
        eventName: data.event.title,
        eventDate: data.event.date,
        eventVenue: data.event.venue,
        eventImage: data.event.image
      })
      setRsvpDone(true)
    } catch (err) {
      if (err.response?.status === 409) setRsvpDone(true)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
        <p>Loading shared event...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">⚠️ {error}</p>
        <Link to="/" className="text-indigo-600 hover:underline mt-4 inline-block">← Back to Discover</Link>
      </div>
    )
  }

  const { event, shareLink, friendsAttending } = data

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {event?.image && (
          <img src={event.image} alt={event.title} className="w-full h-56 object-cover" />
        )}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">{event?.title || 'Event'}</h1>
          <p className="text-gray-500 mt-2">📍 {event?.venue}{event?.city ? `, ${event.city}` : ''}</p>
          <p className="text-gray-500 mt-1">📅 {formatDate(event?.date)}</p>
          {event?.time && <p className="text-gray-500 mt-1">🕐 {event.time}</p>}

          <div className="mt-4 p-3 bg-indigo-50 rounded-md">
            <p className="text-sm text-indigo-700">
              👥 <strong>{friendsAttending}</strong> friend{friendsAttending !== 1 ? 's' : ''} attending
            </p>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleRsvp}
              disabled={rsvpDone}
              className={`flex-1 py-2 rounded-md text-sm font-medium ${
                rsvpDone
                  ? 'bg-green-500 text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {rsvpDone ? '✓ RSVP\'d!' : '❤️ I\'m Interested'}
            </button>
            <Link
              to="/"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50"
            >
              Discover More
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
