import { useState, useEffect } from 'react'
import api from '../services/api'

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [reminders, setReminders] = useState({ enabled: false, reminderTime: '1 hour' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, reminderRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/users/me/reminders')
        ])
        setProfile({ name: profileRes.data.data.name, email: profileRes.data.data.email })
        setReminders(reminderRes.data.data)
      } catch (err) {
        console.error('Failed to load profile:', err)
      }
    }
    load()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await Promise.all([
        api.patch('/users/me', profile),
        api.patch('/users/me/reminders', reminders)
      ])
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Failed to save:', err)
    }
    setSaving(false)
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile</h1>
      <p className="text-gray-500 mb-6">Manage your profile and reminder settings</p>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Personal Info</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Reminder Settings</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={reminders.enabled}
                onChange={e => setReminders({ ...reminders, enabled: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-sm text-gray-700">Enable event reminders</span>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remind me</label>
              <select
                value={reminders.reminderTime}
                onChange={e => setReminders({ ...reminders, reminderTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="30 minutes">30 minutes before</option>
                <option value="1 hour">1 hour before</option>
                <option value="3 hours">3 hours before</option>
                <option value="1 day">1 day before</option>
                <option value="1 week">1 week before</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
