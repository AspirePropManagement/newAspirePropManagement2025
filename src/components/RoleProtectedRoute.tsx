'use client'

import { useSupabaseUser } from '@/hooks/useSupabaseUser'
import { UserRole } from '@/types/Auth'
import { ReactNode } from 'react'

/**
 * Role-based route protection component
 * Only renders children if user has the required role(s)
 */
interface RoleProtectedRouteProps {
  children: ReactNode
  requiredRoles: UserRole[]
  fallback?: ReactNode
  showUnauthorized?: boolean
}

export function RoleProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallback = null,
  showUnauthorized = true 
}: RoleProtectedRouteProps) {
  const { role, hasAnyRole, loading } = useSupabaseUser()

  // Safety check for requiredRoles
  if (!requiredRoles || !Array.isArray(requiredRoles)) {
    console.error('RoleProtectedRoute: requiredRoles must be an array', requiredRoles);
    return fallback;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!hasAnyRole(requiredRoles)) {
    if (showUnauthorized) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              You need one of the following roles to access this page:
            </p>
            <div className="space-y-2">
              {requiredRoles.map((role) => (
                <div key={role} className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm mr-2">
                  {role}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Your current role: <span className="font-medium">{role || 'None'}</span>
            </p>
          </div>
        </div>
      )
    }
    return fallback
  }

  return <>{children}</>
}

/**
 * Convenience components for specific role checks
 */
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleProtectedRoute requiredRoles={['ADMIN']} fallback={fallback}>
      {children}
    </RoleProtectedRoute>
  )
}

export function AgentOrAdmin({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleProtectedRoute requiredRoles={['AGENT', 'ADMIN']} fallback={fallback}>
      {children}
    </RoleProtectedRoute>
  )
}

export function BuyerOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleProtectedRoute requiredRoles={['BUYER']} fallback={fallback}>
      {children}
    </RoleProtectedRoute>
  )
}
