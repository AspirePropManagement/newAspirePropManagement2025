'use client'

/**
 * HeaderSkeleton component that displays a loading state for the header
 * Uses daisyUI skeleton classes for consistent loading animation
 */
export function HeaderSkeleton() {
  return (
    <div className="navbar bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center">
          {/* Logo Section Skeleton */}
          <div className="flex items-center space-x-3">
            <div className="skeleton h-8 w-8 rounded-lg"></div>
            <div className="flex flex-col space-y-2">
              <div className="skeleton h-6 w-48"></div>
              <div className="skeleton h-3 w-32"></div>
            </div>
          </div>

          {/* Navigation Menu Skeleton */}
          <nav className="hidden md:flex items-center space-x-8 ml-8">
            <div className="skeleton h-4 w-16"></div>
            <div className="skeleton h-4 w-20"></div>
            <div className="flex items-center space-x-2">
              <div className="skeleton h-4 w-24"></div>
              <div className="skeleton h-5 w-12 rounded-full"></div>
            </div>
          </nav>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Contact Info Skeleton */}
          <div className="flex items-center space-x-6">
            <div className="text-right hidden md:block">
              <div className="skeleton h-3 w-24 mb-1"></div>
              <div className="skeleton h-4 w-32"></div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="skeleton h-8 w-8 rounded-full"></div>
              <div className="skeleton h-8 w-8 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
