'use client'

import { useAuth } from '@/hooks/useAuth'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import Link from 'next/link'

/**
 * Demo page showcasing the multi-role authentication system
 * Demonstrates the complete user flow from landing to authentication
 */
export default function DemoPage() {
  const { user, isAuthenticated, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading demo...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <Navbar />
      
      {/* Demo Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Demo Introduction */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Multi-Role Authentication Demo
            </h1>
            <p className="text-xl text-gray-600">
              Experience our comprehensive authentication system with role-based access control
            </p>
          </div>

          {isAuthenticated && user ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Welcome to the Demo!
                </h2>
                <p className="text-xl text-gray-600">
                  You are successfully authenticated as a {user.role}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Role</h3>
                  <p className="text-blue-700">{user.role}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Your Email</h3>
                  <p className="text-green-700">{user.email}</p>
                </div>
              </div>

              <div className="text-center">
                <Link 
                  href="/dashboard" 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🔐</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Authentication Required
                </h2>
                <p className="text-xl text-gray-600">
                  Please sign in to access the demo features
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">New User?</h3>
                  <p className="text-blue-700">Create an account and choose your role</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Existing User?</h3>
                  <p className="text-green-700">Sign in with your credentials</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/auth" 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth?mode=signup" 
                  className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}

          {/* Demo Features */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="text-3xl mb-3">👤</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Registration</h3>
              <p className="text-gray-600 text-sm">Create accounts with role selection</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="text-3xl mb-3">🔑</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Login</h3>
              <p className="text-gray-600 text-sm">Password-protected authentication</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Role-Based Access</h3>
              <p className="text-gray-600 text-sm">Different dashboards for each role</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
