import { useState, useEffect } from 'react'
import { AuthService, type User, type UserRole } from '@/lib/authService'

/**
 * Custom hook for managing authentication state
 * Provides user authentication status, user data, and authentication methods
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  /**
   * Signs out the current user
   */
  const signOut = () => {
    AuthService.clearUserFromLocalStorage()
    setUser(null)
    setUserRole(null)
    setIsAuthenticated(false)
  }

  /**
   * Refreshes authentication state from localStorage
   */
  const refreshAuthState = () => {
    const storedUser = AuthService.getUserFromLocalStorage()
    const storedRole = AuthService.getUserRole()
    const storedAuthStatus = AuthService.isAuthenticated()

    setUser(storedUser)
    setUserRole(storedRole)
    setIsAuthenticated(storedAuthStatus)
    setLoading(false)
  }

  // Initialize authentication state
  useEffect(() => {
    refreshAuthState()
  }, [])

  // Listen for storage changes (when user logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isAuthenticated' || e.key === 'user' || e.key === 'userRole') {
        refreshAuthState()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return {
    user,
    userRole,
    isAuthenticated,
    loading,
    signOut,
    refreshAuthState
  }
}
