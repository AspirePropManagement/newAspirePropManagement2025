'use client'

import { PropertyCard } from './PropertyCard'
import { DashboardStats } from './DashboardStats'
import { usePropertyData } from '@/hooks/usePropertyData'
import { DashboardStatsSkeleton } from './DashboardStatsSkeleton'
import { PropertyCardSkeleton } from './PropertyCardSkeleton'

/**
 * PropertyDashboard component that displays the main dashboard view
 * Implements the Single Responsibility Principle by only handling dashboard composition
 */
export function PropertyDashboard() {
  const { properties, stats, isLoading } = usePropertyData()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="skeleton h-8 w-64"></div>
          <div className="skeleton h-4 w-32"></div>
        </div>
        
        <DashboardStatsSkeleton />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Property Dashboard</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <DashboardStats stats={stats} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  )
}
