'use client'

import React from 'react'

/**
 * Preloader component for authentication state
 * Shows a loading animation while determining user authentication status
 */
interface PreloaderProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Preloader({ message = 'Loading...', size = 'md' }: PreloaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className={`animate-spin rounded-full border-b-2 border-orange-500 ${sizeClasses[size]}`}></div>
      {message && (
        <p className={`mt-4 text-gray-600 ${textSizes[size]} font-medium`}>
          {message}
        </p>
      )}
    </div>
  )
}

/**
 * Full screen preloader for page-level loading states
 */
export function FullScreenPreloader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 text-lg font-medium">{message}</p>
      </div>
    </div>
  )
}
