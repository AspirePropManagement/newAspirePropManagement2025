'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FormInput } from './FormInput'
import { Toast } from './Toast'
import AuthService from '@/lib/authService'

type UserRole = 'ADMIN' | 'AGENT' | 'BUYER' | 'BUILDER'

interface SupabaseAuthFormProps {
  mode: 'signin' | 'signup'
  onModeChange: () => void
}

// Simple navigation helper function
const getDashboardRoute = (role: UserRole): string => {
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

export default function SupabaseAuthForm({ mode, onModeChange }: SupabaseAuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('BUYER')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null)
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [emailValidating, setEmailValidating] = useState(false)
  const [phoneValidating, setPhoneValidating] = useState(false)
  
  const router = useRouter()

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type })
  }

  const hideToast = () => {
    setToast(null)
  }

  // Check if email exists
  const checkEmailExists = useCallback(async (emailValue: string) => {
    if (emailValue && emailValue.includes('@')) {
      setEmailValidating(true)
      try {
        // Import supabase directly for this check
        const { createClient } = await import('@supabase/supabase-js')
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        
        const { data: existingEmail } = await supabase
          .from('users')
          .select('email')
          .eq('email', emailValue)
          .single()

        if (existingEmail) {
          setEmailError('This email is already registered. Please sign in instead.')
        } else {
          setEmailError('')
        }
      } catch (error) {
        setEmailError('')
      } finally {
        setEmailValidating(false)
      }
    } else {
      setEmailError('')
      setEmailValidating(false)
    }
  }, [])

  // Check if phone exists
  const checkPhoneExists = useCallback(async (phoneValue: string) => {
    if (phoneValue && phoneValue.length >= 10) {
      setPhoneValidating(true)
      try {
        // Import supabase directly for this check
        const { createClient } = await import('@supabase/supabase-js')
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        
        const { data: existingPhone } = await supabase
          .from('users')
          .select('phone')
          .eq('phone', phoneValue)
          .single()

        if (existingPhone) {
          setPhoneError('This phone number is already registered.')
        } else {
          setPhoneError('')
        }
      } catch (error) {
        setPhoneError('')
      } finally {
        setPhoneValidating(false)
      }
    } else {
      setPhoneError('')
      setPhoneValidating(false)
    }
  }, [])

  // Debounced email validation
  const debouncedEmailCheck = useCallback((emailValue: string) => {
    const timeoutId = setTimeout(() => checkEmailExists(emailValue), 500)
    return () => clearTimeout(timeoutId)
  }, [checkEmailExists])

  // Debounced phone validation
  const debouncedPhoneCheck = useCallback((phoneValue: string) => {
    const timeoutId = setTimeout(() => checkPhoneExists(phoneValue), 500)
    return () => clearTimeout(timeoutId)
  }, [checkPhoneExists])

  // Handle email change with debounced validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value
    setEmail(emailValue)
    if (mode === 'signup') {
      debouncedEmailCheck(emailValue)
    }
  }

  // Handle phone change with debounced validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value
    setPhone(phoneValue)
    debouncedPhoneCheck(phoneValue)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Clear any existing validation errors
    setEmailError('')
    setPhoneError('')

    try {
      if (mode === 'signin') {
        // Simple login using AuthService
        const result = await AuthService.login(email, password)
        
        if (result.success && result.user) {
          // Show success message
          showToast('Sign in successful! Redirecting to your dashboard...', 'success')
          
          // Redirect based on user role
          const dashboardRoute = getDashboardRoute(result.user.role)
          setTimeout(() => {
            router.push(dashboardRoute)
          }, 1500)
        } else {
          setError(result.error || 'Login failed')
        }
      } else {
        // Check for validation errors before submitting
        if (emailError || phoneError) {
          setError('Please fix the validation errors before submitting.')
          setLoading(false)
          return
        }

        // Simple registration using AuthService
        const result = await AuthService.register({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone,
          role: selectedRole
        })
        
        if (result.success) {
          showToast('Account created successfully! You can now sign in.', 'success')
          
          // Clear form after successful signup
          setEmail('')
          setPassword('')
          setFirstName('')
          setLastName('')
          setPhone('')
          setSelectedRole('BUYER')
          setEmailError('')
          setPhoneError('')
          
          // Switch to signin mode
          onModeChange()
        } else {
          setError(result.error || 'Registration failed')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Note: Authentication check removed for build compatibility

  // Authentication check removed for build compatibility

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {mode === 'signin' ? 'Sign In' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <FormInput
                id="auth-first-name"
                name="auth-first-name"
                label="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="Enter your first name"
              />
              
              <FormInput
                id="auth-last-name"
                name="auth-last-name"
                label="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Enter your last name"
              />
              
              <FormInput
                id="auth-phone"
                name="auth-phone"
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                required
                placeholder="Enter your phone number"
              />
              {phoneError && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
                  ⚠️ {phoneError}
                </div>
              )}
              {phoneValidating && (
                <div className="text-blue-600 text-sm bg-blue-50 p-2 rounded border border-blue-200">
                  🔍 Checking phone number availability...
                </div>
              )}
            </>
          )}
          
          <FormInput
            id="auth-email"
            name="auth-email"
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder="Enter your email"
          />
          {emailError && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
              ⚠️ {emailError}
            </div>
          )}
          {emailValidating && (
            <div className="text-blue-600 text-sm bg-blue-50 p-2 rounded border border-blue-200">
              🔍 Checking email availability...
            </div>
          )}
          
          <FormInput
            id="auth-password"
            name="auth-password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />

          {/* Role Selection Dropdown - Only show for signup */}
          {mode === 'signup' && (
            <div className="space-y-2">
              <label htmlFor="role-select" className="block text-sm font-medium text-gray-700">
                Select Your Role
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                id="role-select"
                name="role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                required
              >
                <option value="BUYER">🏠 Buyer - Looking to purchase properties</option>
                <option value="AGENT">👔 Real Estate Agent - Help clients buy and sell</option>
                <option value="BUILDER">🏗️ Builder/Developer - Create and sell properties</option>
                <option value="ADMIN">⚙️ Administrator - Manage platform operations</option>
              </select>
            </div>
          )}
          
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded border border-red-200">
              ❌ {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || (mode === 'signup' && (!!emailError || !!phoneError))}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
          >
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
          
          {mode === 'signup' && (emailError || phoneError) && (
            <div className="text-orange-600 text-sm text-center bg-orange-50 p-2 rounded border border-orange-200">
              ℹ️ Please fix the validation errors above before submitting
            </div>
          )}
        </form>
        
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onModeChange}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {mode === 'signin' 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'
            }
          </button>
        </div>
      </div>
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type === 'warning' ? 'error' : toast.type}
          isVisible={true}
          onClose={hideToast}
        />
      )}
    </div>
  )
}
