'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { authService, NavigationService } from '@/lib/authService'

interface SupabaseContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, firstName: string, lastName: string, phone: string, role: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

interface SupabaseProviderProps {
  children: ReactNode
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )

      return () => subscription.unsubscribe()
    }

    getSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // Use the authentication service to validate credentials
      const authResult = await authService.validateCredentials(email, password)
      
      if (!authResult.success) {
        return { error: { message: authResult.error } }
      }

      if (authResult.user && authResult.role) {
        // Create user session
        await authService.createUserSession(authResult.user)
        
        // Store role in localStorage for immediate access
        if (typeof window !== 'undefined') {
          localStorage.setItem('userRole', authResult.role)
        }
      }

      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone: string, role: string) => {
    try {
      // First, check if email already exists
      const { data: existingEmail, error: emailCheckError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single()

      if (existingEmail) {
        return { error: { message: 'Email address is already registered. Please use a different email or sign in instead.' } }
      }

      // Check if phone number already exists
      const { data: existingPhone, error: phoneCheckError } = await supabase
        .from('users')
        .select('phone')
        .eq('phone', phone)
        .single()

      if (existingPhone) {
        return { error: { message: 'Phone number is already registered. Please use a different phone number or sign in instead.' } }
      }

      // If both checks pass, create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Then, create the user profile in our users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: email,
            password_hash: '', // This will be handled by Supabase Auth
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            role: role.toUpperCase() as 'ADMIN' | 'AGENT' | 'BUYER' | 'BUILDER',
            is_active: true
          })

        if (profileError) throw profileError
      }

      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      // Clear user session data
      await authService.clearUserSession()
      
      // Sign out from Supabase Auth
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error.message)
      }
      
      setUser(null)
      setSession(null)
      
      // Redirect to home page after sign out
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Error during sign out:', error)
    }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}
