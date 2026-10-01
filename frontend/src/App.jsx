import { Routes, Route } from 'react-router-dom'
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

  // Not logged in — show login page (share page still accessible)
  if (!user) {
    return (
      <Routes>
        <Route path="/share/:code" element={<SharedEventPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    )
  }

  // Logged in — show full app
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/my-events" element={<MyEventsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/share/:code" element={<SharedEventPage />} />
        </Routes>
      </main>
      <ChatWidget />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
