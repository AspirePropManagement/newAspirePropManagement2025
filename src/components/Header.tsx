'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { NavigationService } from '@/lib/authService'

/**
 * Header component that displays the application navigation
 * Implements the Single Responsibility Principle by only handling header display
 * Enhanced to properly handle authentication state and user profile display
 */

const getRoleDisplayName = (role: string) => {
  const roleMap: Record<string, string> = {
    BUYER: 'Property Buyer',
    AGENT: 'Real Estate Agent',
    BUILDER: 'Property Builder',
    ADMIN: 'System Administrator'
  }
  return roleMap[role] || role
}

const getRoleBadgeColor = (role: string) => {
  const colorMap: Record<string, string> = {
    BUYER: 'bg-blue-100 text-blue-800',
    AGENT: 'bg-green-100 text-green-800',
    BUILDER: 'bg-purple-100 text-purple-800',
    ADMIN: 'bg-red-100 text-red-800'
  }
  return colorMap[role] || 'bg-gray-100 text-gray-800'
}

export function Header() {
  const { user, userRole, isAuthenticated, loading, signOut } = useAuth()
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Handle profile dropdown toggle
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  // Handle role-based navigation
  const handleRoleNavigation = () => {
    if (!userRole) return
    
    const dashboardRoute = NavigationService.getDashboardRoute(userRole)
    router.push(dashboardRoute)
  }

  if (loading) {
    return (
      <div className="navbar bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="ml-3 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="navbar bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center">
          {/* Logo Section - Left Side */}
          <div className="flex items-center space-x-3">
            {/* Bar chart/skyline icon */}
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
            {/* Logo Text */}
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">
                <span className="text-gray-800">ASPIRE</span>
                <span className="text-orange-500">PROP MANAGEMENT</span>
              </h1>
              <p className="text-xs text-gray-500 -mt-1">NO ONE TARGETS YOUR NEED BETTER</p>
            </div>
          </div>

          {/* Navigation Menu - Left Side (after logo) */}
          <nav className="hidden md:flex items-center space-x-8 ml-8">
            <Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
              Home
            </Link>
            <Link href="/properties" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
              Properties
            </Link>
            <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
              Why Us?
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
              Services
            </a>
            <div className="flex items-center space-x-2">
              <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                Post Property
              </a>
              <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                FREE
              </span>
            </div>
          </nav>

          {/* Spacer to push contact info to the right */}
          <div className="flex-1"></div>

          {/* Contact & User Info - Right Side */}
          <div className="flex items-center space-x-6">
            {/* Toll Free Number */}
            <div className="text-right">
              <p className="text-xs text-gray-600 font-medium">Toll Free Number</p>
              <p className="text-sm font-bold text-gray-800">+91 8080 190190</p>
            </div>
            
            {/* Icons */}
            <div className="flex items-center space-x-3">
              <button className="w-8 h-8 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
              </button>
              
              {/* User Profile Section */}
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  {/* Dashboard Button */}
                  {userRole && (
                    <button
                      onClick={handleRoleNavigation}
                      className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition-colors font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                      </svg>
                      <span className="hidden sm:block">Dashboard</span>
                    </button>
                  )}
                  
                  <div className="relative">
                    <button 
                      onClick={toggleProfile}
                      className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                    >
                      {/* User Avatar */}
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {user.first_name?.charAt(0).toUpperCase() || 
                           user.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      
                      {/* Username */}
                      <span className="text-sm font-medium text-gray-700 hidden sm:block">
                        {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email || 'User'}
                      </span>
                      
                      {/* Dropdown Arrow */}
                      <svg className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="py-3">
                          {/* User Info Header */}
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">
                              {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {user.email || 'No email'}
                            </p>
                            {userRole && (
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getRoleBadgeColor(userRole)}`}>
                                {getRoleDisplayName(userRole)}
                              </span>
                            )}
                          </div>
                          
                          {/* Navigation Links */}
                          {userRole && (
                            <div className="py-2">
                              <button
                                onClick={handleRoleNavigation}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                Go to Dashboard
                              </button>
                            </div>
                          )}
                          
                          {/* Profile & Sign Out */}
                          <div className="py-2 border-t border-gray-100">
                            <Link 
                              href="/profile" 
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              Profile Settings
                            </Link>
                            <button 
                              onClick={() => {
                                signOut()
                                setIsProfileOpen(false)
                                router.push('/auth')
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Sign In Button for Unauthenticated Users */
                <Link 
                  href="/auth" 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Click outside to close profile dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  )
}
