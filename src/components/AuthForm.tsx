'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginCredentials, OTPLoginCredentials, RegisterCredentials, OTPVerification, UserRole } from '@/types/Auth'
import { FormInput } from './FormInput'
import { PhoneInput } from './PhoneInput'
import {
  validateEmail,
  validatePassword,
  validateName,
  validateOTP,
  validatePasswordLoginForm,
  validateOTPLoginForm,
  validateRegistrationForm,
  sanitizeInput
} from '@/utils/validation'

/**
 * Authentication form component with tabs for login and register
 * Implements the Single Responsibility Principle by only handling form display and validation
 */

type TabType = 'login' | 'register'
type LoginMethod = 'password' | 'otp'

const USER_ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'buyer', label: 'Buyer', description: 'Looking to buy properties' },
  { value: 'agent', label: 'Agent', description: 'Real estate agent or broker' },
  { value: 'builder', label: 'Builder', description: 'Property developer or builder' },
  { value: 'admin', label: 'Admin', description: 'System administrator' }
]

export function AuthForm() {
  const [activeTab, setActiveTab] = useState<TabType>('login')
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password')
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'buyer' as UserRole
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [showValidation, setShowValidation] = useState(false)

  const { login, loginWithOTP, register, verifyOTP, resendOTP, isLoading, error } = useAuth()

  // Reset validation when switching tabs or login methods
  useEffect(() => {
    setValidationErrors({})
    setTouchedFields(new Set())
    setShowValidation(false)
    
    // Reset phone fields when switching tabs or login methods
    setFormData(prev => ({
      ...prev,
      countryCode: '+91',
      phoneNumber: ''
    }))
  }, [activeTab, loginMethod])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const sanitizedValue = sanitizeInput(value)
    
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }))
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleFieldBlur = (fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName))
    
    // Validate individual field on blur
    let fieldValidation: { isValid: boolean; error: string | null } | null = null
    
    switch (fieldName) {
      case 'name':
        fieldValidation = validateName(formData.name)
        break
      case 'email':
        fieldValidation = validateEmail(formData.email)
        break
      case 'password':
        fieldValidation = validatePassword(formData.password)
        break
      case 'otp':
        fieldValidation = validateOTP(otp)
        break
    }
    
    if (fieldValidation && !fieldValidation.isValid) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: fieldValidation!.error!
      }))
    }
  }

  const validateForm = () => {
    let errors: Record<string, string> = {}
    
    if (activeTab === 'login') {
      if (loginMethod === 'password') {
        const validation = validatePasswordLoginForm({
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
        errors = validation.errors
      } else {
        const validation = validateOTPLoginForm({
          phone: `${formData.countryCode} ${formData.phoneNumber}`,
          role: formData.role
        })
        errors = validation.errors
      }
    } else {
      const validation = validateRegistrationForm({
        name: formData.name,
        email: formData.email,
        phone: `${formData.countryCode} ${formData.phoneNumber}`,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role
      })
      errors = validation.errors
    }
    
    setValidationErrors(errors)
    setShowValidation(true)
    return Object.keys(errors).length === 0
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    const credentials: LoginCredentials = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.role
    }
    
    await login(credentials)
    setShowOTP(true)
  }

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    const credentials: OTPLoginCredentials = {
      phone: `${formData.countryCode} ${formData.phoneNumber}`,
      role: formData.role
    }
    
    await loginWithOTP(credentials)
    setShowOTP(true)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    const credentials: RegisterCredentials = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: `${formData.countryCode} ${formData.phoneNumber}`,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: formData.role
    }
    
    await register(credentials)
    setShowOTP(true)
  }

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const otpValidation = validateOTP(otp)
    if (!otpValidation.isValid) {
      setValidationErrors({ otp: otpValidation.error! })
      return
    }
    
    const verification: OTPVerification = {
      phone: `${formData.countryCode} ${formData.phoneNumber}`,
      otp: otp.trim()
    }
    
    await verifyOTP(verification)
  }

  const handleResendOTP = async () => {
    await resendOTP(`${formData.countryCode} ${formData.phoneNumber}`)
  }

  const handleLoginMethodChange = (method: LoginMethod) => {
    setLoginMethod(method)
    // Reset phone fields when switching login methods
    if (method === 'otp') {
      setFormData(prev => ({
        ...prev,
        countryCode: '+91',
        phoneNumber: ''
      }))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      countryCode: '+91',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      role: 'buyer'
    })
    setOtp('')
    setShowOTP(false)
    setValidationErrors({})
    setTouchedFields(new Set())
    setShowValidation(false)
  }

  if (showOTP) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
          <p className="text-gray-600">Enter the 6-digit code sent to {formData.countryCode} {formData.phoneNumber}</p>
        </div>

        <form onSubmit={handleOTPVerification} className="space-y-6">
          <FormInput
            id="otp"
            name="otp"
            label="OTP Code"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            onBlur={() => handleFieldBlur('otp')}
            placeholder="Enter 6-digit OTP"
            required
            maxLength={6}
            validation={validateOTP(otp)}
            showValidation={touchedFields.has('otp') || showValidation}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isLoading}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Resend
            </button>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="w-full text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to {activeTab === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
            activeTab === 'login'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
            activeTab === 'register'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Register
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'login' ? (
          <div className="space-y-6">
            {/* Login Method Selection */}
            <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => handleLoginMethodChange('password')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  loginMethod === 'password'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => handleLoginMethodChange('otp')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  loginMethod === 'otp'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                OTP Login
              </button>
            </div>

            {/* Password Login Form */}
            {loginMethod === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-6">
                <FormInput
                  id="login-email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => handleFieldBlur('email')}
                  placeholder="Enter your email"
                  required
                  validation={validateEmail(formData.email)}
                  showValidation={touchedFields.has('email') || showValidation}
                />

                <FormInput
                  id="login-password"
                  name="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleFieldBlur('password')}
                  placeholder="Enter your password"
                  required
                  validation={validatePassword(formData.password)}
                  showValidation={touchedFields.has('password') || showValidation}
                />

                <div>
                  <label htmlFor="login-role" className="block text-sm font-medium text-gray-700 mb-2">
                    User Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="login-role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    {USER_ROLES.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label} - {role.description}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* OTP Login Form */}
            {loginMethod === 'otp' && (
              <form onSubmit={handleOTPLogin} className="space-y-6">
                <PhoneInput
                  id="otp-login-phone"
                  name="phone"
                  label="Phone Number"
                  countryCode={formData.countryCode}
                  phoneNumber={formData.phoneNumber}
                  onCountryCodeChange={(countryCode) => setFormData(prev => ({ ...prev, countryCode }))}
                  onPhoneNumberChange={(phoneNumber) => setFormData(prev => ({ ...prev, phoneNumber }))}
                  placeholder="Enter your phone number"
                  required
                />

                <div>
                  <label htmlFor="otp-login-role" className="block text-sm font-medium text-gray-700 mb-2">
                    User Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="otp-login-role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    {USER_ROLES.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label} - {role.description}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <FormInput
              id="register-name"
              name="name"
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={() => handleFieldBlur('name')}
              placeholder="Enter your full name"
              required
              maxLength={50}
              validation={validateName(formData.name)}
              showValidation={touchedFields.has('name') || showValidation}
            />

            <FormInput
              id="register-email"
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={() => handleFieldBlur('email')}
              placeholder="Enter your email"
              required
              validation={validateEmail(formData.email)}
              showValidation={touchedFields.has('email') || showValidation}
            />

            <PhoneInput
              id="register-phone"
              name="phone"
              label="Phone Number"
              countryCode={formData.countryCode}
              phoneNumber={formData.phoneNumber}
              onCountryCodeChange={(countryCode) => setFormData(prev => ({ ...prev, countryCode }))}
              onPhoneNumberChange={(phoneNumber) => setFormData(prev => ({ ...prev, phoneNumber }))}
              placeholder="Enter your phone number"
              required
            />

            <div>
              <label htmlFor="register-role" className="block text-sm font-medium text-gray-700 mb-2">
                User Role <span className="text-red-500">*</span>
              </label>
              <select
                id="register-role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                {USER_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label} - {role.description}
                  </option>
                ))}
              </select>
            </div>

            <FormInput
              id="register-password"
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={() => handleFieldBlur('password')}
              placeholder="Create a password"
              required
              validation={validatePassword(formData.password)}
              showValidation={touchedFields.has('password') || showValidation}
            />

            <FormInput
              id="register-confirm-password"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={() => handleFieldBlur('confirmPassword')}
              placeholder="Confirm your password"
              required
              validation={formData.password === formData.confirmPassword ? 
                { isValid: true, error: null } : 
                { isValid: false, error: 'Passwords do not match' }
              }
              showValidation={touchedFields.has('confirmPassword') || showValidation}
            />

            <button
              type="submit"
              disabled={isLoading || formData.password !== formData.confirmPassword}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Form-level error display */}
        {Object.keys(validationErrors).length > 0 && showValidation && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="font-medium mb-2">Please fix the following errors:</div>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
