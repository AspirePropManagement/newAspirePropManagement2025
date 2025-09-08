'use client'

/**
 * PropertyAmenitiesSkeleton component that displays a loading state for property amenities
 * Uses daisyUI skeleton classes for consistent loading animation
 */
export function PropertyAmenitiesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="skeleton h-6 w-40"></div>
        <div className="skeleton h-4 w-64"></div>
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="skeleton h-5 w-5 rounded"></div>
            <div className="skeleton h-4 w-20"></div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      <div className="text-center">
        <div className="skeleton h-10 w-32 mx-auto rounded-lg"></div>
      </div>
    </div>
  )
}

/**
 * PropertyAmenitiesCardSkeleton for individual amenity cards
 */
export function PropertyAmenitiesCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="skeleton h-6 w-32"></div>
          <div className="skeleton h-4 w-16"></div>
        </div>

        {/* Amenities List */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="skeleton h-4 w-4 rounded"></div>
              <div className="skeleton h-4 w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * PropertyAmenitiesListSkeleton for simple amenities list
 */
export function PropertyAmenitiesListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="skeleton h-4 w-4 rounded"></div>
          <div className="skeleton h-4 w-28"></div>
        </div>
      ))}
    </div>
  )
}

/**
 * PropertyAmenitiesGridSkeleton for grid layout amenities
 */
export function PropertyAmenitiesGridSkeleton({ 
  columns = 4, 
  items = 12 
}: { 
  columns?: number; 
  items?: number; 
}) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-4`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
          <div className="skeleton h-4 w-4 rounded"></div>
          <div className="skeleton h-4 w-16"></div>
        </div>
      ))}
    </div>
  )
}

/**
 * PropertyAmenitiesSectionSkeleton for full amenities section
 */
export function PropertyAmenitiesSectionSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="space-y-6">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="skeleton h-6 w-48"></div>
          <div className="skeleton h-4 w-72"></div>
        </div>

        {/* Amenities Categories */}
        <div className="space-y-6">
          {/* Basic Amenities */}
          <div className="space-y-3">
            <div className="skeleton h-5 w-32 border-b pb-1"></div>
            <PropertyAmenitiesGridSkeleton columns={4} items={8} />
          </div>

          {/* Premium Amenities */}
          <div className="space-y-3">
            <div className="skeleton h-5 w-36 border-b pb-1"></div>
            <PropertyAmenitiesGridSkeleton columns={4} items={6} />
          </div>

          {/* Security Amenities */}
          <div className="space-y-3">
            <div className="skeleton h-5 w-40 border-b pb-1"></div>
            <PropertyAmenitiesGridSkeleton columns={4} items={4} />
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center pt-4">
          <div className="skeleton h-10 w-32 mx-auto rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}
