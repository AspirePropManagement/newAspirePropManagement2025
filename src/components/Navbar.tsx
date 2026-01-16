'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'


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

export default function Navbar() {
  const { user, userRole, isAuthenticated, loading, signOut } = useAuth()
  const router = useRouter()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [favoriteCount, setFavoriteCount] = useState(0)

  // Get favorite count from localStorage
  useEffect(() => {
    const updateFavoriteCount = () => {
      const favorites = localStorage.getItem('favoriteProperties');
      const favoriteIds = favorites ? JSON.parse(favorites) : [];
      setFavoriteCount(favoriteIds.length);
    };

    updateFavoriteCount();
    
    // Listen for storage changes
    window.addEventListener('storage', updateFavoriteCount);
    window.addEventListener('favoritesUpdated', updateFavoriteCount);
    
    return () => {
      window.removeEventListener('storage', updateFavoriteCount);
      window.removeEventListener('favoritesUpdated', updateFavoriteCount);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      // Also prevent scrolling on the html element
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Restore scrolling when menu is closed
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle profile dropdown toggle
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Handle role-based navigation
  const handleRoleNavigation = () => {
    if (!userRole) return
    
    // Close the profile dropdown
    setIsProfileOpen(false)
    
    // Role-based routing to specific dashboards
    let dashboardRoute = '/dashboard';
    switch (userRole) {
      case 'ADMIN':
        dashboardRoute = '/admin';
        break;
      case 'AGENT':
        dashboardRoute = '/agent';
        break;
      case 'BUILDER':
        dashboardRoute = '/builder';
        break;
      case 'BUYER':
        dashboardRoute = '/buyer';
        break;
      default:
        dashboardRoute = '/dashboard';
    }
    
    router.push(dashboardRoute);
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
    <div className="navbar bg-white shadow-lg border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section - Left Side */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1 lg:flex-none">
            {/* Bar chart/skyline icon */}
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
                         {/* Logo Text */}
             <div className="flex flex-col min-w-0">
               <h1 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold truncate">
                 <span className="text-gray-800">ASPIRE PROP MANAGEMENT</span>
               </h1>
               <p className="text-[10px] sm:text-xs text-gray-500 -mt-1 hidden sm:block">NO ONE TARGETS YOUR NEED BETTER</p>
             </div>
          </div>

                     {/* Desktop Navigation Menu */}
           <nav className="hidden lg:flex items-center space-x-6 ml-8 flex-shrink-0">
             <Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors text-sm font-medium">
               Home
             </Link>
                          <Link href="/properties-listing" className="text-gray-700 hover:text-orange-500 transition-colors text-sm font-medium">
                Properties
              </Link>
             <Link href="/why-us" className="text-gray-700 hover:text-orange-500 transition-colors text-sm font-medium">
               Why Us?
             </Link>
            <Link href="/blog" className="text-gray-700 hover:text-orange-500 transition-colors text-sm font-medium">
              Blog
            </Link>
             <Link href="/services" className="text-gray-700 hover:text-orange-500 transition-colors text-sm font-medium">
               Services
             </Link>
             <Link href="/contact" className="text-gray-700 hover:text-orange-500 transition-colors text-sm font-medium">
               Enquiry
             </Link>
            {/* <div className="flex items-center space-x-2">
              <Link href="/post-property" className="text-gray-700 hover:text-orange-500 transition-colors text-sm font-medium">
                Post Property
              </Link>
              <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                FREE
              </span>
            </div> */}
           </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Contact & User Info - Right Side */}
          <div className="hidden lg:flex items-center space-x-6">
                         {/* Toll Free Number */}
             <div className="text-right">
               <p className="text-xs text-gray-600 font-medium">Toll Free Number</p>
               <p className="text-xs font-bold text-gray-800">+91 92262 54182</p>
             </div>
            
            {/* Icons */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => {
                  console.log('Heart icon clicked! Navigating to favorites page');
                  window.location.href = '/favorites';
                }}
                className="relative w-8 h-8 text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center"
                title="My Favorites"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
                {favoriteCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] leading-none rounded-full min-w-[16px] h-[16px] flex items-center justify-center font-bold shadow-sm border border-white">
                    {favoriteCount > 9 ? '9+' : favoriteCount}
                  </span>
                )}
              </button>
              
                             {/* User Profile Section */}
               {isAuthenticated && user ? (
                 <div className="flex items-center space-x-3">
                   <div className="relative">
                     <button 
                       onClick={toggleProfile}
                       className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors"
                     >
                       {/* User Avatar */}
                       <span className="text-sm font-bold text-white">
                         {user.first_name?.charAt(0).toUpperCase() || 
                          user.email?.charAt(0).toUpperCase() || 'U'}
                       </span>
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
                               {userRole === 'ADMIN' && (
                                 <Link 
                                   href="/admin/settings" 
                                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                   onClick={() => setIsProfileOpen(false)}
                                 >
                                   Settings & Profile
                                 </Link>
                               )}
                             </div>
                           )}
                          
                                                     {/* Sign Out */}
                           <div className="py-2 border-t border-gray-100">
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
      
             {/* Mobile Menu Overlay */}
       {isMobileMenuOpen && (
         <div 
           className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
           onClick={closeMobileMenu}
           style={{ touchAction: 'none' }}
         />
       )}

              {/* Mobile Navigation Menu */}
       <div className={`lg:hidden fixed top-0 left-0 w-80 max-w-[85vw] h-full bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out flex flex-col ${
         isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
       }`} style={{ willChange: 'transform', touchAction: 'pan-y' }}>
         {/* Mobile Menu Header */}
         <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
           <div className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
               <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
               </svg>
             </div>
             <div>
               <h2 className="text-lg font-bold text-gray-800">ASPIRE PROP MANAGEMENT</h2>
               <p className="text-xs text-gray-500">NO ONE TARGETS YOUR NEED BETTER</p>
             </div>
           </div>
           <button
             onClick={closeMobileMenu}
             className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
           >
             <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
         </div>

         <div className="flex-1 overflow-y-auto px-4 py-6" style={{ 
           WebkitOverflowScrolling: 'touch',
           overscrollBehavior: 'contain',
           minHeight: 0,
           paddingBottom: '100px'
         }}>
           <div className="space-y-4">
                      {/* Mobile Navigation Links */}
           <nav className="space-y-2">
             <Link 
               href="/" 
               className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors font-medium"
               onClick={closeMobileMenu}
             >
               <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
               </svg>
               Home
             </Link>
                           <Link 
                href="/properties-listing" 
                className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                onClick={closeMobileMenu}
              >
               <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
               </svg>
               Properties
             </Link>
             <Link 
               href="/favorites" 
               className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors font-medium"
               onClick={closeMobileMenu}
             >
               <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
               </svg>
               <span>My Favorites</span>
               {favoriteCount > 0 && (
                 <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                   {favoriteCount > 9 ? '9+' : favoriteCount}
                 </span>
               )}
             </Link>
             <Link href="/why-us" className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors font-medium">
               <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
               </svg>
               Why Us?
             </Link>
            <Link href="/blog" className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors font-medium">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Blog
            </Link>
                           <Link href="/services" className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors font-medium">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Services
              </Link>
             <Link href="/contact" className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors font-medium">
               <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
               Enquiry
             </Link>
            {/**
             * <Link 
             *   href="/post-property" 
             *   className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors font-medium"
             *   onClick={closeMobileMenu}
             * >
             *   <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             *     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
             *   </svg>
             *   <span>Post Property</span>
             *   <span className="ml-auto bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
             *     FREE
             *   </span>
             * </Link>
             */}
           </nav>

                     {/* Mobile Contact Info */}
           <div className="pt-4 border-t border-gray-200">
             <div className="text-center p-4 bg-gray-50 rounded-lg">
               <svg className="w-8 h-8 text-orange-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
               </svg>
               <p className="text-xs text-gray-600 font-medium">Toll Free Number</p>
               <p className="text-lg font-bold text-gray-800">+91 92262 54182</p>
             </div>
           </div>

           {/* Mobile User Actions */}
           {isAuthenticated && user ? (
             <div className="pt-4 border-t border-gray-200 space-y-3 pb-4">
               <button
                 onClick={() => {
                   handleRoleNavigation()
                   closeMobileMenu()
                 }}
                 className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center"
               >
                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                 </svg>
                 Go to Dashboard
               </button>
               <button
                 onClick={() => {
                   signOut()
                   closeMobileMenu()
                   router.push('/auth')
                 }}
                 className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center"
               >
                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                 </svg>
                 Sign Out
               </button>
             </div>
           ) : (
             <div className="pt-4 border-t border-gray-200 pb-4">
               <Link 
                 href="/auth" 
                 className="block w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center flex items-center justify-center"
                 onClick={closeMobileMenu}
               >
                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                 </svg>
                 Sign In
               </Link>
             </div>
           )}
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
