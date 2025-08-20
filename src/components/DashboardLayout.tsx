'use client'

import React from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

/**
 * Dashboard layout component that provides consistent structure
 * Includes Header and Footer with proper spacing for dashboard content
 */
interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  icon?: React.ReactNode
  iconBgColor?: string
}

export function DashboardLayout({ 
  children, 
  title, 
  subtitle, 
  icon, 
  iconBgColor = 'bg-gray-100' 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              {icon && (
                <div className={`w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {icon}
                </div>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              {subtitle && (
                <p className="text-gray-600">{subtitle}</p>
              )}
            </div>
            
            {children}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
