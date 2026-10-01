import { useState, useEffect } from 'react'
import api from '../services/api'

export default function MyEventsPage() {
  const [rsvps, setRsvps] = useState([])
  const [loading, setLoading] = useState(true)
  const [shareStates, setShareStates] = useState({})

  useEffect(() => {
    const fetchRsvps = async () => {
      try {
        const res = await api.get('/rsvps')
        setRsvps(res.data.data)
      } catch (err) {
        console.error('Failed to load RSVPs:', err)
      }
      setLoading(false)
    }
    fetchRsvps()
  }, [])

  const handleRemove = async (eventId) => {
    try {
      await api.delete(`/rsvps/${eventId}`)
      setRsvps(prev => prev.filter(r => r.eventId !== eventId))
    } catch (err) {
      console.error('Failed to remove RSVP:', err)
    }
  }

  const handleShare = async (eventId) => {
    try {
      const res = await api.post(`/events/${eventId}/share`)
      const url = `${window.location.origin}/share/${res.data.data.code}`
      await navigator.clipboard.writeText(url)
      setShareStates(prev => ({ ...prev, [eventId]: true }))
      setTimeout(() => setShareStates(prev => ({ ...prev, [eventId]: false })), 2000)
    } catch (err) {
      console.error('Share error:', err)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-2"></div>
        <p>Loading your events...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Events</h1>
      <p className="text-gray-500 mb-6">Your confirmed and interested events</p>

      {rsvps.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>You haven't RSVP'd to any events yet.</p>
          <a href="/" className="text-indigo-600 hover:underline mt-2 inline-block">Discover events →</a>
        </div>
      ) : (
        <div className="space-y-3">
          {rsvps.map(rsvp => (
            <div key={rsvp._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-4">
              {rsvp.eventImage && (
                <img src={rsvp.eventImage} alt={rsvp.eventName} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{rsvp.eventName}</h3>
                <p className="text-sm text-gray-500">📍 {rsvp.eventVenue}</p>
                <p className="text-sm text-gray-500">📅 {formatDate(rsvp.eventDate)}</p>
                <span className="inline-block mt-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                  ✓ {rsvp.status}
                </span>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => handleShare(rsvp.eventId)}
                  className="px-3 py-1.5 text-sm border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
                >
                  {shareStates[rsvp.eventId] ? '✅ Copied!' : '🔗 Share'}
                </button>
                <button
                  onClick={() => handleRemove(rsvp.eventId)}
                  className="px-3 py-1.5 text-sm text-red-500 hover:text-red-700 border border-gray-200 rounded-md"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
