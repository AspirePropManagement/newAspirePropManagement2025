'use client'

/**
 * RecentActivitySkeleton component that displays a loading state for recent activity feeds
 * Uses daisyUI skeleton classes for consistent loading animation
 */
export function RecentActivitySkeleton() {
  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
      {/* Section Header */}
      <div className="mb-6">
        <div className="skeleton h-6 w-40"></div>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
            {/* Avatar */}
            <div className="skeleton h-10 w-10 rounded-full flex-shrink-0"></div>
            
            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="space-y-1">
                <div className="skeleton h-4 w-3/4"></div>
                <div className="skeleton h-3 w-1/2"></div>
              </div>
              
              {/* Timestamp */}
              <div className="skeleton h-3 w-20"></div>
            </div>
            
            {/* Action Icon */}
            <div className="skeleton h-5 w-5 rounded"></div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-6">
        <div className="skeleton h-10 w-32 mx-auto rounded-lg"></div>
      </div>
    </div>
  )
}

/**
 * ActivityItemSkeleton for individual activity items
 */
export function ActivityItemSkeleton() {
  return (
    <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
      {/* Avatar */}
      <div className="skeleton h-10 w-10 rounded-full flex-shrink-0"></div>
      
      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="space-y-1">
          <div className="skeleton h-4 w-3/4"></div>
          <div className="skeleton h-3 w-1/2"></div>
        </div>
        
        {/* Timestamp */}
        <div className="skeleton h-3 w-20"></div>
      </div>
      
      {/* Action Icon */}
      <div className="skeleton h-5 w-5 rounded"></div>
    </div>
  )
}

/**
 * ActivityTimelineSkeleton for timeline-style activity display
 */
export function ActivityTimelineSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="relative">
          {/* Timeline Line */}
          {index < 3 && (
            <div className="absolute left-5 top-10 w-0.5 h-16 bg-gray-200"></div>
          )}
          
          {/* Timeline Item */}
          <div className="flex items-start space-x-4">
            {/* Timeline Dot */}
            <div className="skeleton h-10 w-10 rounded-full flex-shrink-0"></div>
            
            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="space-y-1">
                <div className="skeleton h-4 w-2/3"></div>
                <div className="skeleton h-3 w-1/2"></div>
              </div>
              
              {/* Timestamp */}
              <div className="skeleton h-3 w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * ActivityCardSkeleton for activity cards
 */
export function ActivityCardSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="space-y-3">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="skeleton h-5 w-32"></div>
          <div className="skeleton h-4 w-16"></div>
        </div>
        
        {/* Card Content */}
        <div className="space-y-2">
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-3/4"></div>
        </div>
        
        {/* Card Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="skeleton h-3 w-20"></div>
          <div className="skeleton h-6 w-16"></div>
        </div>
      </div>
    </div>
  )
}

/**
 * ActivityFeedSkeleton for activity feed containers
 */
export function ActivityFeedSkeleton({ 
  items = 5, 
  showHeader = true 
}: { 
  items?: number; 
  showHeader?: boolean; 
}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="skeleton h-6 w-40"></div>
          <div className="skeleton h-8 w-24 rounded-lg"></div>
        </div>
      )}

      {/* Activity Items */}
      <div className="space-y-3">
        {Array.from({ length: items }).map((_, index) => (
          <ActivityItemSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
