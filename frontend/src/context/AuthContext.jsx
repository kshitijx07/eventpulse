import { createContext, useContext, useState, useEffect } from 'react'

const defaultAuth = {
  user: null,
  login: () => {},
  logout: () => {},
  loading: false
}

const AuthContext = createContext(defaultAuth)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('eventpulse_user')
      if (saved) {
        setUser(JSON.parse(saved))
      }
    } catch (err) {
      console.error('Failed reading user from localStorage:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    try {
      localStorage.setItem('eventpulse_user', JSON.stringify(userData))
    } catch (err) {
      console.error('Failed saving user to localStorage:', err)
    }
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem('eventpulse_user')
    } catch (err) {
      console.error('Failed clearing user from localStorage:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  return context || defaultAuth
}
