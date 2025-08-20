'use client'

import { useAuth } from '@/hooks/useAuth'
import { NavigationService } from '@/lib/authService'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Main dashboard page that displays user information and provides navigation
 * to role-specific dashboards
 */
export default function DashboardPage() {
  const { user, userRole, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // Redirect to role-specific dashboard if user is authenticated
  useEffect(() => {
    if (isAuthenticated && userRole && !loading) {
      const dashboardRoute = NavigationService.getDashboardRoute(userRole)
      router.push(dashboardRoute)
    }
  }, [isAuthenticated, userRole, loading, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to access your dashboard
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8">
            <button
              onClick={() => router.push('/auth')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show user info and role selection if authenticated but no role
  if (!userRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.first_name || 'User'}!</h1>
            <p className="mt-2 text-sm text-gray-600">
              Your account is being set up. Please wait for role assignment.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8">
            <div className="text-center text-gray-600">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Setting up your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // This should not be reached due to the redirect above, but just in case
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
