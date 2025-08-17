'use client'

import React, { useState } from 'react'
import { ValidationResult } from '@/utils/validation'

/**
 * Reusable form input component with validation and enhanced features
 * Implements the Single Responsibility Principle by only handling input display and validation
 */

interface FormInputProps {
  id: string
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'tel'
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  validation?: ValidationResult
  showValidation?: boolean
  maxLength?: number
  className?: string
}

export function FormInput({
  id,
  name,
  label,
  type,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  validation,
  showValidation = false,
  maxLength,
  className = ''
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // For phone fields, just pass through the value without validation
    if (type === 'tel') {
      // Allow free typing for phone numbers
      // The country code will be handled separately
    }

    // Call the original onChange
    onChange(e)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const getInputType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password'
    }
    return type
  }

  const getInputClassName = () => {
    const baseClasses = 'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-offset-0 transition-colors'
    
    let borderClasses = 'border-gray-300 focus:border-transparent'
    let focusClasses = 'focus:ring-orange-500'
    
    if (validation && showValidation && !validation.isValid) {
      borderClasses = 'border-red-300 focus:border-transparent'
      focusClasses = 'focus:ring-red-500'
    } else if (isFocused) {
      borderClasses = 'border-orange-300 focus:border-transparent'
    }
    
    if (disabled) {
      borderClasses = 'border-gray-200 bg-gray-50'
      focusClasses = ''
    }
    
    return `${baseClasses} ${borderClasses} ${focusClasses} ${className}`.trim()
  }

  const shouldShowError = validation && showValidation && !validation.isValid
  const shouldShowSuccess = validation && showValidation && validation.isValid && value.length > 0

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type === 'tel' ? 'text' : getInputType()}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          maxLength={type === 'tel' ? 15 : maxLength}
          className={getInputClassName()}
          autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'off'}
        />
        
        {/* Password visibility toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
        
        {/* Validation icons */}
        {shouldShowError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {shouldShowSuccess && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {shouldShowError && (
        <p className="text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {validation.error}
        </p>
      )}
      
      {/* Success message */}
      {shouldShowSuccess && (
        <p className="text-sm text-green-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Looks good!
        </p>
      )}
      
      {/* Character count for phone numbers */}
      {type === 'tel' && value && (
        <p className="text-xs text-gray-500">
          {value.replace(/\D/g, '').length}/10 digits
        </p>
      )}
    </div>
  )
}
