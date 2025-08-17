'use client'

import React from 'react'

/**
 * Phone input component with separate country code and phone number fields
 * Implements the Single Responsibility Principle by only handling phone input display
 */

interface PhoneInputProps {
  id: string
  name: string
  label: string
  countryCode: string
  phoneNumber: string
  onCountryCodeChange: (value: string) => void
  onPhoneNumberChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function PhoneInput({
  id,
  name,
  label,
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  placeholder = "Enter phone number",
  required = false,
  disabled = false,
  className = ''
}: PhoneInputProps) {
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to 10 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    onPhoneNumberChange(value)
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="flex space-x-2">
        {/* Country Code Field */}
        <div className="w-20">
          <input
            type="text"
            value={countryCode}
            onChange={(e) => onCountryCodeChange(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center font-medium"
            placeholder="+91"
            disabled={disabled}
            maxLength={5}
          />
        </div>
        
        {/* Phone Number Field */}
        <div className="flex-1">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder={placeholder}
            disabled={disabled}
            maxLength={10}
          />
        </div>
      </div>
      
      {/* Character count for phone numbers */}
      {phoneNumber && (
        <p className="text-xs text-gray-500">
          {phoneNumber.length}/10 digits
        </p>
      )}
    </div>
  )
}
