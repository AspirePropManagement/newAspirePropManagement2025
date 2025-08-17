'use client'

/**
 * DashboardStatsSkeleton component that displays a loading state for dashboard statistics
 * Uses daisyUI skeleton classes for consistent loading animation
 */
export function DashboardStatsSkeleton() {
  return (
    <div className="stats shadow w-full">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="stat">
          <div className="skeleton h-12 w-12 rounded-full"></div>
          <div className="skeleton h-4 w-24"></div>
          <div className="skeleton h-8 w-20"></div>
          <div className="skeleton h-3 w-32"></div>
        </div>
      ))}
    </div>
  )
}
