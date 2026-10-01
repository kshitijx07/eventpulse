import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function LoginPage() {
  const { login } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        if (!name || !email || !password) {
          setError('All fields are required')
          setLoading(false)
          return
        }
        const res = await api.post('/auth/register', { name, email, password })
        login(res.data.data)
      } else {
        if (!email) {
          setError('Email is required')
          setLoading(false)
          return
        }
        // If demo email, supply default password if empty
        const pass = password || (email === 'demo@eventpulse.com' ? 'password123' : '')
        if (!pass) {
          setError('Password is required')
          setLoading(false)
          return
        }
        const res = await api.post('/auth/login', { email, password: pass })
        login(res.data.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  const handleDemoSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', {
        email: 'demo@eventpulse.com',
        password: 'password123'
      })
      login(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🎪</div>
          <h1 className="text-3xl font-extrabold text-indigo-600">EventPulse</h1>
          <p className="text-gray-500 mt-1">Discover, track, and share live events</p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {!isRegister && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleDemoSignIn}
                disabled={loading}
                className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg text-sm transition-colors border border-indigo-200 flex items-center justify-center gap-2"
              >
                <span>⚡</span>
                <span>1-Click Sign In as Demo User</span>
              </button>
            </div>
          )}

          <div className="mt-5 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError('') }}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
