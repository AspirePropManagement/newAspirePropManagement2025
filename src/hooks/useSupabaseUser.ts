import { useSupabaseAuth } from './useSupabaseAuth'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type User = Database['public']['Tables']['users']['Row']

type UserRole = 'ADMIN' | 'AGENT' | 'BUYER' | 'BUILDER'

interface UserProfile {
  user: User | null
  role: UserRole | null
  loading: boolean
  error: string | null
  // Role check helpers
  isAdmin: () => boolean
  isAgent: () => boolean
  isBuyer: () => boolean
  isBuilder: () => boolean
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  // Permission helpers
  canManageUsers: () => boolean
  canManageProperties: () => boolean
  canManageRoles: () => boolean
}

export function useSupabaseUser(): UserProfile {
  const { user: authUser } = useSupabaseAuth()
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authUser) {
      setUser(null)
      setRole(null)
      setLoading(false)
      return
    }

    async function fetchUserProfile() {
      try {
        setLoading(true)
        setError(null)

        // Fetch user profile from the simplified users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser!.id)
          .single()

        if (userError) {
          console.error('Error fetching user profile:', userError)
          setError('Failed to fetch user profile. Please try signing in again.')
          setLoading(false)
          return
        }

        if (!userData) {
          setError('User profile not found. Please contact support.')
          setLoading(false)
          return
        }

        // Check if user has a role, if not set a default one
        if (!userData.role) {
          // Update user with default role
          const { error: updateError } = await supabase
            .from('users')
            .update({ role: 'BUYER' })
            .eq('id', authUser!.id)

          if (updateError) {
            console.error('Error updating user role:', updateError)
            setError('Failed to set user role. Please contact support.')
            setLoading(false)
            return
          }

          // Set the updated user data
          userData.role = 'BUYER'
        }

        setUser(userData)
        setRole(userData.role)

      } catch (err) {
        console.error('Error fetching user profile:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch user profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [authUser])

  // Helper functions for role checks
  const isAdmin = () => role === 'ADMIN'
  const isAgent = () => role === 'AGENT'
  const isBuyer = () => role === 'BUYER'
  const isBuilder = () => role === 'BUILDER'
  const hasRole = (checkRole: UserRole) => role === checkRole
  const hasAnyRole = (checkRoles: UserRole[]) => role ? checkRoles.includes(role) : false

  // Helper functions for permissions
  const canManageUsers = (): boolean => {
    return role === 'ADMIN'
  }

  const canManageProperties = (): boolean => {
    return role === 'ADMIN' || role === 'AGENT' || role === 'BUILDER'
  }

  const canManageRoles = (): boolean => {
    return role === 'ADMIN'
  }

  return {
    user,
    role,
    loading,
    error,
    // Role check helpers
    isAdmin,
    isAgent,
    isBuyer,
    isBuilder,
    hasRole,
    hasAnyRole,
    // Permission helpers
    canManageUsers,
    canManageProperties,
    canManageRoles
  }
}
