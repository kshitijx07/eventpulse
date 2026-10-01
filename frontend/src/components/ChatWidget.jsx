import { useState, useRef, useEffect } from 'react'
import api from '../services/api'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! Ask me about events. Try "Show me concerts" or "events in New York"' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setLoading(true)

    try {
      const res = await api.post('/chat', { message: userMessage })
      const { message, events } = res.data.data
      setMessages(prev => [...prev, { role: 'assistant', text: message, events }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, something went wrong. Try again.' }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Chat bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 flex items-center justify-center text-2xl z-50"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
          <div className="px-4 py-3 bg-indigo-600 text-white rounded-t-lg font-semibold">
            Event Assistant
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] max-h-[350px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p>{msg.text}</p>
                  {msg.events && msg.events.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.events.slice(0, 5).map((evt, j) => (
                        <div key={j} className="bg-white rounded p-2 border border-gray-200 text-xs">
                          <p className="font-semibold text-gray-900">{evt.title}</p>
                          <p className="text-gray-500">📍 {evt.venue} • 📅 {evt.date}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about events..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}
