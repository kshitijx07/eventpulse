import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ChatWidget from './components/ChatWidget'
import DiscoverPage from './pages/DiscoverPage'
import CalendarPage from './pages/CalendarPage'
import MyEventsPage from './pages/MyEventsPage'
import ProfilePage from './pages/ProfilePage'
import SharedEventPage from './pages/SharedEventPage'

function App() {
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

export default App
