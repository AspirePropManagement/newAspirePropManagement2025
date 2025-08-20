import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

/**
 * User role types for the application
 */
export type UserRole = 'ADMIN' | 'AGENT' | 'BUYER' | 'BUILDER'

/**
 * User interface matching the database schema
 */
export interface User {
  id: string
  email: string
  password_hash: string
  first_name?: string
  last_name?: string
  phone?: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * User registration data interface
 */
export interface UserRegistrationData {
  email: string
  password: string
  first_name: string
  last_name: string
  phone: string
  role: UserRole
}

/**
 * User login data interface
 */
export interface UserLoginData {
  email: string
  password: string
}

/**
 * Authentication service for user management
 */
export class AuthService {
  /**
   * Registers a new user in the users table
   */
  static async registerUser(userData: UserRegistrationData): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single()

      if (existingUser) {
        return { success: false, error: 'Email address is already registered' }
      }

      // Hash the password
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(userData.password, saltRounds)

      // Insert new user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          password_hash: passwordHash,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          role: userData.role,
          is_active: true
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating user:', error)
        return { success: false, error: 'Failed to create user account' }
      }

      return { success: true, user: newUser }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'An unexpected error occurred during registration' }
    }
  }

  /**
   * Authenticates user by checking email and password
   */
  static async loginUser(loginData: UserLoginData): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      // Find user by email
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', loginData.email)
        .eq('is_active', true)
        .single()

      if (error || !user) {
        return { success: false, error: 'Invalid email or password' }
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password_hash)
      if (!isPasswordValid) {
        return { success: false, error: 'Invalid email or password' }
      }

      return { success: true, user }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'An unexpected error occurred during login' }
    }
  }

  /**
   * Stores user data in localStorage
   */
  static storeUserInLocalStorage(user: User): void {
    try {
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('userRole', user.role)
      localStorage.setItem('isAuthenticated', 'true')
    } catch (error) {
      console.error('Error storing user in localStorage:', error)
    }
  }

  /**
   * Retrieves user data from localStorage
   */
  static getUserFromLocalStorage(): User | null {
    try {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error retrieving user from localStorage:', error)
      return null
    }
  }

  /**
   * Clears user data from localStorage
   */
  static clearUserFromLocalStorage(): void {
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('userRole')
      localStorage.removeItem('isAuthenticated')
    } catch (error) {
      console.error('Error clearing user from localStorage:', error)
    }
  }

  /**
   * Checks if user is authenticated
   */
  static isAuthenticated(): boolean {
    try {
      return localStorage.getItem('isAuthenticated') === 'true'
    } catch (error) {
      return false
    }
  }

  /**
   * Gets user role from localStorage
   */
  static getUserRole(): UserRole | null {
    try {
      return localStorage.getItem('userRole') as UserRole | null
    } catch (error) {
      return null
    }
  }
}

/**
 * Navigation service for role-based routing
 */
export class NavigationService {
  /**
   * Gets the appropriate dashboard route based on user role
   */
  static getDashboardRoute(role: UserRole): string {
    switch (role) {
      case 'ADMIN':
        return '/admin'
      case 'AGENT':
        return '/agent'
      case 'BUILDER':
        return '/builder'
      case 'BUYER':
        return '/buyer'
      default:
        return '/dashboard'
    }
  }

  /**
   * Checks if user has access to a specific route
   */
  static hasRouteAccess(route: string, userRole: UserRole): boolean {
    const roleRoutes = {
      '/admin': ['ADMIN'],
      '/agent': ['AGENT'],
      '/builder': ['BUILDER'],
      '/buyer': ['BUYER'],
      '/dashboard': ['ADMIN', 'AGENT', 'BUILDER', 'BUYER']
    }

    const allowedRoles = roleRoutes[route as keyof typeof roleRoutes] || []
    return allowedRoles.includes(userRole)
  }
}
