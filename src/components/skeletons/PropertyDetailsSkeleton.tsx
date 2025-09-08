'use client'

/**
 * PropertyDetailsSkeleton component that displays a loading state for property detail pages
 * Uses daisyUI skeleton classes for consistent loading animation
 */
export function PropertyDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm">
          <div className="skeleton h-4 w-16"></div>
          <div className="skeleton h-4 w-1"></div>
          <div className="skeleton h-4 w-20"></div>
          <div className="skeleton h-4 w-1"></div>
          <div className="skeleton h-4 w-24"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Header Skeleton */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="skeleton h-8 w-3/4"></div>
                <div className="skeleton h-5 w-1/2"></div>
              </div>
              <div className="flex space-x-2">
                <div className="skeleton h-10 w-10 rounded-full"></div>
                <div className="skeleton h-10 w-10 rounded-full"></div>
              </div>
            </div>
            
            {/* Price and Key Details Skeleton */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="skeleton h-8 w-32"></div>
              <div className="skeleton h-6 w-24"></div>
              <div className="skeleton h-6 w-20"></div>
            </div>
          </div>

          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <div className="skeleton h-64 md:h-96 w-full rounded-lg"></div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="skeleton h-16 rounded"></div>
              ))}
            </div>
          </div>

          {/* Property Description Skeleton */}
          <div className="space-y-4">
            <div className="skeleton h-6 w-48"></div>
            <div className="space-y-2">
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-3/4"></div>
            </div>
          </div>

          {/* Property Features Skeleton */}
          <div className="space-y-4">
            <div className="skeleton h-6 w-40"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="skeleton h-4 w-4 rounded"></div>
                  <div className="skeleton h-4 w-20"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities Skeleton */}
          <div className="space-y-4">
            <div className="skeleton h-6 w-32"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="skeleton h-5 w-5 rounded"></div>
                  <div className="skeleton h-4 w-16"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card Skeleton */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="space-y-4">
              <div className="skeleton h-6 w-32"></div>
              <div className="flex items-center space-x-3">
                <div className="skeleton h-12 w-12 rounded-full"></div>
                <div className="space-y-2">
                  <div className="skeleton h-4 w-24"></div>
                  <div className="skeleton h-3 w-20"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="skeleton h-10 w-full"></div>
                <div className="skeleton h-10 w-full"></div>
              </div>
            </div>
          </div>

          {/* Property Stats Skeleton */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="space-y-4">
              <div className="skeleton h-6 w-28"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="skeleton h-4 w-20"></div>
                    <div className="skeleton h-4 w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Location Map Skeleton */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="space-y-4">
              <div className="skeleton h-6 w-24"></div>
              <div className="skeleton h-48 w-full rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * PropertyDetailsHeaderSkeleton for property header section
 */
export function PropertyDetailsHeaderSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="skeleton h-8 w-3/4"></div>
          <div className="skeleton h-5 w-1/2"></div>
        </div>
        <div className="flex space-x-2">
          <div className="skeleton h-10 w-10 rounded-full"></div>
          <div className="skeleton h-10 w-10 rounded-full"></div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        <div className="skeleton h-8 w-32"></div>
        <div className="skeleton h-6 w-24"></div>
        <div className="skeleton h-6 w-20"></div>
      </div>
    </div>
  )
}

/**
 * PropertyContactCardSkeleton for contact information
 */
export function PropertyContactCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="space-y-4">
        <div className="skeleton h-6 w-32"></div>
        <div className="flex items-center space-x-3">
          <div className="skeleton h-12 w-12 rounded-full"></div>
          <div className="space-y-2">
            <div className="skeleton h-4 w-24"></div>
            <div className="skeleton h-3 w-20"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="skeleton h-10 w-full"></div>
          <div className="skeleton h-10 w-full"></div>
        </div>
      </div>
    </div>
  )
}
