import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import ChatWidget from './components/ChatWidget'
import LoginPage from './pages/LoginPage'
import DiscoverPage from './pages/DiscoverPage'
import CalendarPage from './pages/CalendarPage'
import MyEventsPage from './pages/MyEventsPage'
import ProfilePage from './pages/ProfilePage'
import SharedEventPage from './pages/SharedEventPage'

function AppContent() {
  const { user } = useAuth()

  // When not logged in, user sees LoginPage (or SharedEventPage if opening a share link)
  if (!user) {
    return (
      <Routes>
        <Route path="/share/:code" element={<SharedEventPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    )
  }

  // When logged in, user sees full application with navigation and chat
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1">
        <Routes>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/my-events" element={<MyEventsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/share/:code" element={<SharedEventPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ChatWidget />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
