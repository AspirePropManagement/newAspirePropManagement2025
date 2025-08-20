'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { NavigationService, type UserRole } from '@/lib/authService'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
  fallback?: React.ReactNode
}

/**
 * Authentication guard component that protects routes based on user authentication and role
 * Redirects unauthenticated users to login and unauthorized users to appropriate dashboard
 */
export default function AuthGuard({ 
  children, 
  requiredRole, 
  fallback 
}: AuthGuardProps) {
  const { user, userRole, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (loading) return

    if (!isAuthenticated || !user) {
      // User not authenticated, redirect to login
      router.push('/auth')
      return
    }

    if (requiredRole) {
      // Check if user has required role
      let hasAccess = false
      
      if (Array.isArray(requiredRole)) {
        hasAccess = requiredRole.includes(userRole!)
      } else {
        hasAccess = userRole === requiredRole
      }

      if (!hasAccess) {
        // User doesn't have required role, redirect to their dashboard
        const dashboardRoute = NavigationService.getDashboardRoute(userRole!)
        router.push(dashboardRoute)
        return
      }
    }

    // User is authenticated and authorized
    setIsAuthorized(true)
  }, [isAuthenticated, user, userRole, loading, requiredRole, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show fallback while redirecting
  if (!isAuthorized) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  // User is authenticated and authorized, show protected content
  return <>{children}</>
}

/**
 * Higher-order component for role-based route protection
 * @param Component - The component to wrap
 * @param requiredRole - Required role(s) for access
 * @param redirectTo - Optional redirect path if access denied
 */
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: UserRole | UserRole[],
  redirectTo?: string
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard requiredRole={requiredRole} fallback={redirectTo}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}

/**
 * Specific role-based guards for common use cases
 */
export function AdminGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="ADMIN" fallback={fallback}>
      {children}
    </AuthGuard>
  )
}

export function AgentGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="AGENT" fallback={fallback}>
      {children}
    </AuthGuard>
  )
}

export function BuyerGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="BUYER" fallback={fallback}>
      {children}
    </AuthGuard>
  )
}

export function BuilderGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="BUILDER" fallback={fallback}>
      {children}
    </AuthGuard>
  )
}

export function StaffGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <AuthGuard requiredRole={['ADMIN', 'AGENT']} fallback={fallback}>
      {children}
    </AuthGuard>
  )
}
