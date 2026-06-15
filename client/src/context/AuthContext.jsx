import { createContext, useContext, useState, useEffect } from 'react'
import { loginAdmin, logoutAdmin, onAuthChange } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('adminToken') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken()
          sessionStorage.setItem('adminToken', idToken)
          setToken(idToken)
        } catch (err) {
          console.error("Error getting Firebase ID Token:", err)
          sessionStorage.removeItem('adminToken')
          setToken(null)
        }
      } else {
        sessionStorage.removeItem('adminToken')
        setToken(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (password) => {
    const userCredential = await loginAdmin(password)
    const idToken = await userCredential.user.getIdToken()
    sessionStorage.setItem('adminToken', idToken)
    setToken(idToken)
    return userCredential
  }

  const logout = async () => {
    await logoutAdmin()
    sessionStorage.removeItem('adminToken')
    setToken(null)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
