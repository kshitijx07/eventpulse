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
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            🎪 EventPulse
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
                <span className="text-sm text-gray-500 mr-2">👤 {user.name}</span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
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

