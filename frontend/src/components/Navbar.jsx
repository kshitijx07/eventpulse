import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Discover' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/my-events', label: 'My Events' },
  { to: '/profile', label: 'Profile' }
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            🎪 EventPulse
          </Link>
          <div className="flex space-x-1">
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
          </div>
        </div>
      </div>
    </nav>
  )
}
