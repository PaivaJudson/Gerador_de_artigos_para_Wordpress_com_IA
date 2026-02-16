import { createContext, useContext, useState, useEffect } from 'react'
import { api, setToken, isAuthenticated } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      setLoading(false)
      return
    }
    api.me()
      .then((data) => setUser(data))
      .catch(() => setToken(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const data = await api.login(email, password)
    setToken(data.access_token)
    setUser(data.user)
    return data
  }

  const register = async (payload) => {
    const data = await api.register(payload)
    setToken(data.access_token)
    setUser(data.user)
    return data
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
