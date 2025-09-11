import { useState, useEffect, useCallback } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

/**
 * User role types for the application
 */
export type UserRole = 'ADMIN' | 'AGENT' | 'BUYER' | 'BUILDER' | null

/**
 * Extended user interface with role information
 */
export interface ExtendedUser extends Omit<User, 'role'> {
  role?: UserRole
  roleData?: any
}

/**
 * Authentication state interface
 */
interface AuthState {
  user: ExtendedUser | null
  session: Session | null
  loading: boolean
  error: AuthError | null
}

/**
 * Custom hook for Supabase authentication with role-based access control
 * Provides user authentication, role management, and session handling
 */
export function useSupabaseAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })

  /**
   * Fetches user role from the simplified users table
   */
  const fetchUserRole = useCallback(async (userId: string): Promise<UserRole> => {
    try {
      if (!supabase) {
        console.error('Supabase client not available')
        return null
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user role:', error)
        return null
      }

      return userData?.role || null
    } catch (error) {
      console.error('Error fetching user role:', error)
      return null
    }
  }, [])

  /**
   * Fetches user profile data from the users table
   */
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      if (!supabase) {
        console.error('Supabase client not available')
        return null
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return userData
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }, [])

  /**
   * Signs in user with email and password
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      if (!supabase) {
        const error = new Error('Database connection not available')
        setAuthState(prev => ({ ...prev, loading: false, error: error as AuthError }))
        return { data: null, error: error as AuthError }
      }

      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        const role = await fetchUserRole(data.user.id)
        const roleData = await fetchUserProfile(data.user.id)

        const extendedUser: ExtendedUser = {
          ...data.user,
          role,
          roleData
        }

        setAuthState({
          user: extendedUser,
          session: data.session,
          loading: false,
          error: null
        })
      }

      return { data, error: null }
    } catch (error) {
      const authError = error as AuthError
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: authError
      }))
      return { data: null, error: authError }
    }
  }, [fetchUserRole, fetchUserProfile])

  /**
   * Signs up new user with email and password
   */
  const signUp = useCallback(async (email: string, password: string, userData: any) => {
    try {
      if (!supabase) {
        const error = new Error('Database connection not available')
        setAuthState(prev => ({ ...prev, loading: false, error: error as AuthError }))
        return { data: null, error: error as AuthError }
      }

      setAuthState(prev => ({ ...prev, loading: true, error: null }))

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      const authError = error as AuthError
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: authError
      }))
      return { data: null, error: authError }
    }
  }, [])

  /**
   * Signs out the current user
   */
  const signOut = useCallback(async () => {
    try {
      if (!supabase) {
        console.error('Supabase client not available')
        return
      }

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null
      })
    } catch (error) {
      const authError = error as AuthError
      setAuthState(prev => ({
        ...prev,
        error: authError
      }))
    }
  }, [])

  /**
   * Assigns a role to a user
   */
  const assignRole = useCallback(async (userId: string, role: UserRole, roleData: any) => {
    if (!role) return { error: new Error('Invalid role') }

    try {
      if (!supabase) {
        return { error: new Error('Database connection not available') }
      }

      const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      // Update local state
      if (authState.user) {
        setAuthState(prev => ({
          ...prev,
          user: {
            ...prev.user!,
            role,
            roleData: data
          }
        }))
      }

      return { data, error: null }
    } catch (error) {
      console.error(`Error assigning ${role} role:`, error)
      return { data: null, error }
    }
  }, [authState.user])

  /**
   * Checks if user has specific role
   */
  const hasRole = useCallback((role: UserRole): boolean => {
    return authState.user?.role === role
  }, [authState.user?.role])

  /**
   * Checks if user has any of the specified roles
   */
  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return roles.includes(authState.user?.role || null)
  }, [authState.user?.role])

  /**
   * Checks if user is admin
   */
  const isAdmin = useCallback((): boolean => {
    return hasRole('ADMIN')
  }, [hasRole])

  /**
   * Checks if user is agent
   */
  const isAgent = useCallback((): boolean => {
    return hasRole('AGENT')
  }, [hasRole])

  /**
   * Checks if user is buyer
   */
  const isBuyer = useCallback((): boolean => {
    return hasRole('BUYER')
  }, [hasRole])

  /**
   * Checks if user is builder
   */
  const isBuilder = useCallback((): boolean => {
    return hasRole('BUILDER')
  }, [hasRole])

  // Initialize auth state
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        if (!supabase) {
          console.error('Supabase client not available')
          setAuthState(prev => ({ ...prev, loading: false }))
          return
        }

        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const role = await fetchUserRole(session.user.id)
          const roleData = await fetchUserProfile(session.user.id)

          const extendedUser: ExtendedUser = {
            ...session.user,
            role,
            roleData
          }

          setAuthState({
            user: extendedUser,
            session,
            loading: false,
            error: null
          })
        } else {
          setAuthState(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    if (!supabase) {
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const role = await fetchUserRole(session.user.id)
          const roleData = await fetchUserProfile(session.user.id)

          const extendedUser: ExtendedUser = {
            ...session.user,
            role,
            roleData
          }

          setAuthState({
            user: extendedUser,
            session,
            loading: false,
            error: null
          })
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error: null
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchUserRole, fetchUserProfile])

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    assignRole,
    hasRole,
    hasAnyRole,
    isAdmin,
    isAgent,
    isBuyer,
    isBuilder
  }
}
