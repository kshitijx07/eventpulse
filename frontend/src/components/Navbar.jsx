import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Discover' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/my-events', label: 'My Events' },
  { to: '/profile', label: 'Profile' }
]

export default function Navbar() {
  const location = useLocation()
  const auth = useAuth() || {}
  const user = auth.user
  const logout = auth.logout

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <span>🎪</span>
            <span>EventPulse</span>
          </Link>
          <div className="flex items-center space-x-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="flex items-center ml-3 pl-3 border-l border-gray-200">
                <span className="text-sm font-medium text-gray-700 mr-3">
                  👤 {user.name || user.email}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors border border-red-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
