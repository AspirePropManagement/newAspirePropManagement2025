'use client'

import { AuthForm } from '@/components/AuthForm'

/**
 * Authentication page that displays login and register forms
 * Implements the Single Responsibility Principle by only handling page composition
 */

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Aspire Prop
          </h1>
          <p className="text-gray-600">
            Sign in with password or OTP, or create a new account with role-based access
          </p>
        </div>

        {/* Authentication Form */}
        <AuthForm />

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          <p className="mt-2 text-xs">
            OTP will be sent to your registered phone number for verification
          </p>
          <p className="mt-1 text-xs">
            Choose between traditional password login or secure OTP-based login
          </p>
        </div>
      </div>
    </div>
  )
}
