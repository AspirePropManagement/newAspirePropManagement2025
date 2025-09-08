'use client'

/**
 * PropertyImageGallerySkeleton component that displays a loading state for property image galleries
 * Uses daisyUI skeleton classes for consistent loading animation
 */
export function PropertyImageGallerySkeleton() {
  return (
    <div className="w-full">
      {/* Main Image Skeleton */}
      <div className="relative w-full h-64 md:h-96 lg:h-[500px] mb-4">
        <div className="skeleton w-full h-full rounded-lg"></div>
        
        {/* Image Counter Skeleton */}
        <div className="absolute bottom-4 right-4">
          <div className="skeleton h-8 w-16 rounded-full"></div>
        </div>
        
        {/* Navigation Arrows Skeleton */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <div className="skeleton h-10 w-10 rounded-full"></div>
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="skeleton h-10 w-10 rounded-full"></div>
        </div>
      </div>

      {/* Thumbnail Grid Skeleton */}
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
          <div key={index} className="relative">
            <div className="skeleton w-full h-16 md:h-20 rounded-lg"></div>
            {index === 0 && (
              <div className="absolute inset-0 bg-primary bg-opacity-20 rounded-lg"></div>
            )}
          </div>
        ))}
      </div>

      {/* View All Images Button Skeleton */}
      <div className="mt-4 text-center">
        <div className="skeleton h-10 w-32 mx-auto rounded-lg"></div>
      </div>
    </div>
  )
}

/**
 * PropertyImageCarouselSkeleton for carousel-style image displays
 */
export function PropertyImageCarouselSkeleton() {
  return (
    <div className="w-full">
      {/* Carousel Container */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg">
        <div className="skeleton w-full h-full"></div>
        
        {/* Dots Indicator Skeleton */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {[1, 2, 3, 4].map((index) => (
            <div 
              key={index} 
              className={`skeleton h-2 w-2 rounded-full ${
                index === 0 ? 'bg-primary' : ''
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * PropertyImageGridSkeleton for grid-style image displays
 */
export function PropertyImageGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Main Image */}
      <div className="md:col-span-2 lg:col-span-2">
        <div className="skeleton w-full h-64 md:h-80 rounded-lg"></div>
      </div>
      
      {/* Side Images */}
      <div className="space-y-4">
        <div className="skeleton w-full h-32 rounded-lg"></div>
        <div className="skeleton w-full h-32 rounded-lg"></div>
        <div className="skeleton w-full h-32 rounded-lg"></div>
      </div>
    </div>
  )
}
