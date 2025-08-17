'use client'

import { useState, useEffect } from 'react'
import { PropertyDashboard } from '@/components/PropertyDashboard'
import { Header } from '@/components/Header'
import { HeaderSkeleton } from '@/components/HeaderSkeleton'

/**
 * Main page component that serves as the application entry point
 * Implements the Single Responsibility Principle by only handling page composition
 */
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200">
        <HeaderSkeleton />
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="skeleton h-8 w-64"></div>
              <div className="skeleton h-4 w-32"></div>
            </div>
            
            <div className="stats shadow w-full">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="stat">
                  <div className="skeleton h-12 w-12 rounded-full"></div>
                  <div className="skeleton h-4 w-24"></div>
                  <div className="skeleton h-8 w-20"></div>
                  <div className="skeleton h-3 w-32"></div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((index) => (
                <div key={index} className="card bg-base-100 shadow-lg">
                  <div className="card-body p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="skeleton h-6 w-48"></div>
                      <div className="skeleton h-6 w-16 rounded-full"></div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="skeleton h-4 w-20 mr-2"></div>
                        <div className="skeleton h-4 w-32"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="skeleton h-4 w-16 mr-2"></div>
                        <div className="skeleton h-4 w-24"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="skeleton h-4 w-16 mr-2"></div>
                        <div className="skeleton h-4 w-20"></div>
                      </div>
                      <div className="flex items-center">
                        <div className="skeleton h-4 w-20 mr-2"></div>
                        <div className="skeleton h-4 w-24"></div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4 pt-4">
                      <div className="skeleton h-8 w-24"></div>
                      <div className="skeleton h-8 w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <PropertyDashboard />
      </div>
    </div>
  )
}
