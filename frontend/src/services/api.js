import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

// Attach x-user-id header on every request if user is logged in
api.interceptors.request.use((config) => {
  const saved = localStorage.getItem('eventpulse_user')
  if (saved) {
    try {
      const user = JSON.parse(saved)
      config.headers['x-user-id'] = user.userId
    } catch { /* ignore */ }
  }
  return config
})

export default api
