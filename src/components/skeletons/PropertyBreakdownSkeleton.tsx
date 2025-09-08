'use client'

/**
 * PropertyBreakdownSkeleton component that displays a loading state for property breakdown statistics
 * Uses daisyUI skeleton classes for consistent loading animation
 */
export function PropertyBreakdownSkeleton() {
  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
      {/* Section Header */}
      <div className="mb-6">
        <div className="skeleton h-6 w-48"></div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-3">
            {/* Chart/Icon Area */}
            <div className="flex items-center justify-center">
              <div className="skeleton h-16 w-16 rounded-full"></div>
            </div>
            
            {/* Title */}
            <div className="text-center">
              <div className="skeleton h-4 w-24 mx-auto mb-2"></div>
              <div className="skeleton h-6 w-16 mx-auto"></div>
            </div>
            
            {/* Description */}
            <div className="text-center">
              <div className="skeleton h-3 w-32 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * PropertyStatsCardSkeleton for individual statistics cards
 */
export function PropertyStatsCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="space-y-4">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="skeleton h-5 w-32"></div>
          <div className="skeleton h-4 w-4 rounded"></div>
        </div>

        {/* Main Stat */}
        <div className="space-y-2">
          <div className="skeleton h-8 w-20"></div>
          <div className="skeleton h-4 w-24"></div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="skeleton h-2 w-full rounded"></div>
          <div className="skeleton h-3 w-16"></div>
        </div>
      </div>
    </div>
  )
}

/**
 * PropertyStatsGridSkeleton for statistics grid layout
 */
export function PropertyStatsGridSkeleton({ 
  columns = 3, 
  items = 6 
}: { 
  columns?: number; 
  items?: number; 
}) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-4`}>
      {Array.from({ length: items }).map((_, index) => (
        <PropertyStatsCardSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * PropertyBreakdownChartSkeleton for chart visualizations
 */
export function PropertyBreakdownChartSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="space-y-6">
        {/* Chart Header */}
        <div className="space-y-2">
          <div className="skeleton h-6 w-48"></div>
          <div className="skeleton h-4 w-64"></div>
        </div>

        {/* Chart Area */}
        <div className="space-y-4">
          {/* Chart Bars */}
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="skeleton h-4 w-20"></div>
                <div className="flex-1">
                  <div className="skeleton h-6 w-full rounded"></div>
                </div>
                <div className="skeleton h-4 w-12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Legend */}
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="skeleton h-3 w-3 rounded"></div>
              <div className="skeleton h-4 w-16"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * PropertyBreakdownTableSkeleton for tabular data
 */
export function PropertyBreakdownTableSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="space-y-4">
        {/* Table Header */}
        <div className="skeleton h-6 w-40"></div>

        {/* Table */}
        <div className="overflow-hidden">
          <div className="space-y-3">
            {/* Table Header Row */}
            <div className="grid grid-cols-4 gap-4 py-2 border-b">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="skeleton h-4 w-20"></div>
              ))}
            </div>

            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-4 gap-4 py-2">
                {Array.from({ length: 4 }).map((_, colIndex) => (
                  <div key={colIndex} className="skeleton h-4 w-16"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
