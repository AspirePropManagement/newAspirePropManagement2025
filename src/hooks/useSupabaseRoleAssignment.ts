import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type User = Database['public']['Tables']['users']['Row']
type UserRole = 'admin' | 'agent' | 'buyer' | 'builder'

interface RoleAssignmentData {
  admin?: {
    admin_level?: 'super_admin' | 'admin' | 'moderator'
    permissions?: any
    can_manage_users?: boolean
    can_manage_properties?: boolean
    can_manage_roles?: boolean
  }
  agent?: {
    license_number?: string
    specialization?: string[]
    experience_years?: number
    commission_rate?: number
    is_verified?: boolean
  }
  buyer?: {
    budget_min?: number
    budget_max?: number
    preferred_locations?: string[]
    property_types?: string[]
    bedrooms_min?: number
    bathrooms_min?: number
  }
  builder?: {
    company_name?: string
    license_number?: string
    specialization?: string[]
    experience_years?: number
    is_verified?: boolean
  }
}

export function useSupabaseRoleAssignment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Assign a role to a user
   */
  const assignRole = async (
    userId: string,
    role: UserRole,
    roleData: RoleAssignmentData[UserRole] = {}
  ) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: roleError } = await supabase
        .rpc('update_user_role', {
          target_user_id: userId,
          new_role: role,
          role_data: roleData
        })

      if (roleError) throw roleError

      return { success: data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign role'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Create a new user profile in the users table
   */
  const createUserProfile = async (userData: {
    id: string
    email: string
    full_name: string
    phone?: string
    avatar_url?: string
  }) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user profile'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Get all users with their roles (admin only)
   */
  const getAllUsersWithRoles = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .rpc('get_all_users_with_roles')

      if (error) throw error

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Check if a user has a specific permission
   */
  const checkPermission = async (userId: string, permission: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .rpc('check_user_permission', {
          user_uuid: userId,
          permission_name: permission
        })

      if (error) throw error

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check permission'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Get user's current role
   */
  const getUserRole = async (userId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .rpc('get_user_role', {
          user_uuid: userId
        })

      if (error) throw error

      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user role'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Complete user onboarding process
   */
  const completeUserOnboarding = async (
    userId: string,
    role: UserRole,
    profileData: any
  ) => {
    try {
      setLoading(true)
      setError(null)

      // First, create the user profile if it doesn't exist
      const userProfile = await createUserProfile({
        id: userId,
        email: profileData.email,
        full_name: profileData.full_name,
        phone: profileData.phone,
        avatar_url: profileData.avatar_url
      })

      if (userProfile.error) throw new Error(userProfile.error)

      // Then assign the role
      const roleAssignment = await assignRole(userId, role, profileData.roleData || {})

      if (roleAssignment.error) throw new Error(roleAssignment.error)

      return { success: true, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete onboarding'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    assignRole,
    createUserProfile,
    getAllUsersWithRoles,
    checkPermission,
    getUserRole,
    completeUserOnboarding
  }
}
