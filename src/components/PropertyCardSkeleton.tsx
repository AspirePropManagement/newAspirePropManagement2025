'use client'

/**
 * PropertyCardSkeleton component that displays a loading state for property cards
 * Uses daisyUI skeleton classes for consistent loading animation
 */
export function PropertyCardSkeleton() {
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
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
        
        <div className="card-actions justify-end mt-4 pt-4 border-t border-base-300">
          <div className="skeleton h-8 w-24"></div>
          <div className="skeleton h-8 w-16"></div>
        </div>
      </div>
    </div>
  )
}
