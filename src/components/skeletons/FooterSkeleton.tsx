'use client'

/**
 * FooterSkeleton component that displays a loading state for the footer
 * Uses daisyUI skeleton classes for consistent loading animation
 */
export function FooterSkeleton() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info Skeleton */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="skeleton h-12 w-12 rounded-xl"></div>
              <div>
                <div className="skeleton h-6 w-32 mb-2"></div>
                <div className="skeleton h-4 w-48"></div>
              </div>
            </div>
            <div className="space-y-2 mb-6">
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-3/4"></div>
              <div className="skeleton h-4 w-1/2"></div>
            </div>
            
            {/* Social Media Links Skeleton */}
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="skeleton h-10 w-10 rounded-lg"></div>
              ))}
            </div>
          </div>

          {/* Quick Links Skeleton */}
          <div>
            <div className="skeleton h-6 w-24 mb-6"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="skeleton h-4 w-32"></div>
              ))}
            </div>
          </div>

          {/* Services Skeleton */}
          <div>
            <div className="skeleton h-6 w-20 mb-6"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="skeleton h-4 w-28"></div>
              ))}
            </div>
          </div>

          {/* Contact Info Skeleton */}
          <div>
            <div className="skeleton h-6 w-24 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="space-y-2">
                  <div className="skeleton h-4 w-12"></div>
                  <div className="skeleton h-4 w-32"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Signup Skeleton */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="skeleton h-6 w-32 mx-auto mb-4"></div>
            <div className="skeleton h-4 w-64 mx-auto mb-6"></div>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="skeleton h-12 flex-1"></div>
              <div className="skeleton h-12 w-24"></div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Skeleton */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="skeleton h-4 w-64 mb-4 lg:mb-0"></div>
            <div className="flex space-x-6">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="skeleton h-4 w-20"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
