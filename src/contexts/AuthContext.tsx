'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { AuthContextType, AuthState, User, LoginCredentials, OTPLoginCredentials, RegisterCredentials, OTPVerification, UserRole } from '@/types/Auth'

/**
 * Authentication context that manages user authentication state
 * Implements the Single Responsibility Principle by only handling authentication concerns
 */

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, error: null }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'LOGOUT':
      return { ...initialState, isLoading: false }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Check for existing user session on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (token) {
          // In a real app, validate token with backend
          const userData = localStorage.getItem('userData')
          if (userData) {
            const user = JSON.parse(userData)
            dispatch({ type: 'SET_USER', payload: user })
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock user data - in real app, this would come from API
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: 'John Doe',
        phone: '+91 98765 43210', // Mock phone number
        role: credentials.role,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Store in localStorage (in real app, use secure HTTP-only cookies)
      localStorage.setItem('userData', JSON.stringify(mockUser))
      localStorage.setItem('authToken', 'mock-token')

      dispatch({ type: 'SET_USER', payload: mockUser })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Login failed. Please try again.' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const loginWithOTP = async (credentials: OTPLoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock user data - in real app, this would come from API
      const mockUser: User = {
        id: '1',
        email: 'user@example.com', // Mock email for OTP login
        name: 'John Doe',
        phone: credentials.phone,
        role: credentials.role,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Store in localStorage (in real app, use secure HTTP-only cookies)
      localStorage.setItem('userData', JSON.stringify(mockUser))
      localStorage.setItem('authToken', 'mock-token')

      dispatch({ type: 'SET_USER', payload: mockUser })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'OTP login failed. Please try again.' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock user data - in real app, this would come from API
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: credentials.name,
        phone: credentials.phone,
        role: credentials.role,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Store in localStorage (in real app, use secure HTTP-only cookies)
      localStorage.setItem('userData', JSON.stringify(mockUser))
      localStorage.setItem('authToken', 'mock-token')

      dispatch({ type: 'SET_USER', payload: mockUser })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Registration failed. Please try again.' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const verifyOTP = async (verification: OTPVerification): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock OTP verification - in real app, validate with backend
      if (verification.otp === '123456') {
        const currentUser = state.user
        if (currentUser) {
          const verifiedUser = { ...currentUser, isVerified: true }
          localStorage.setItem('userData', JSON.stringify(verifiedUser))
          dispatch({ type: 'SET_USER', payload: verifiedUser })
        }
      } else {
        throw new Error('Invalid OTP')
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'OTP verification failed. Please try again.' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const resendOTP = async (phone: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // In real app, send OTP to phone number
      console.log(`OTP sent to ${phone}`)
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to resend OTP. Please try again.' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const logout = (): void => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    dispatch({ type: 'LOGOUT' })
  }

  const value: AuthContextType = {
    ...state,
    login,
    loginWithOTP,
    register,
    verifyOTP,
    logout,
    resendOTP
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
