import { useState } from 'react'
import api from '../services/api'

export default function EventCard({ event, isRsvped, onRsvpChange, friendsCount = 0 }) {
  const [loading, setLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleRsvp = async () => {
    setLoading(true)
    try {
      if (isRsvped) {
        await api.delete(`/rsvps/${event.id}`)
        onRsvpChange(event.id, false)
      } else {
        await api.post('/rsvps', {
          eventId: event.id,
          eventName: event.title,
          eventDate: event.date,
          eventVenue: event.venue,
          eventImage: event.image
        })
        onRsvpChange(event.id, true)
      }
    } catch (err) {
      console.error('RSVP error:', err)
    }
    setLoading(false)
  }

  const handleShare = async () => {
    try {
      const res = await api.post(`/events/${event.id}/share`)
      const url = `${window.location.origin}/share/${res.data.data.code}`
      setShareUrl(url)
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Share error:', err)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (timeStr) => {
    if (!timeStr) return ''
    const [h, m] = timeStr.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    return `${hour % 12 || 12}:${m} ${ampm}`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg truncate">{event.title}</h3>
        <p className="text-sm text-gray-500 mt-1">📍 {event.venue}{event.city ? `, ${event.city}` : ''}</p>
        <p className="text-sm text-gray-500 mt-1">
          📅 {formatDate(event.date)}{event.time ? ` • ${formatTime(event.time)}` : ''}
        </p>
        {event.genre && event.genre !== 'Undefined' && (
          <span className="inline-block mt-2 text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
            {event.genre}
          </span>
        )}

        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={handleRsvp}
            disabled={loading}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isRsvped
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            {loading ? '...' : isRsvped ? '❤️ Interested' : '🤍 Interested'}
          </button>

          <div className="flex items-center space-x-2">
            {friendsCount > 0 && (
              <span className="text-xs text-gray-500">👥 {friendsCount} attending</span>
            )}
            {isRsvped && (
              <button
                onClick={handleShare}
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                title="Share with friends"
              >
                {copied ? '✅ Copied!' : '🔗 Share'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
