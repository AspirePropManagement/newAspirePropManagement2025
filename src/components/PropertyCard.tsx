'use client'

import { Property } from '@/types/Property'

interface PropertyCardProps {
  property: Property
}

/**
 * PropertyCard component that displays individual property information
 * Implements the Single Responsibility Principle by only handling property display
 */
export function PropertyCard({ property }: PropertyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'occupied':
        return 'badge-success'
      case 'vacant':
        return 'badge-error'
      case 'maintenance':
        return 'badge-warning'
      default:
        return 'badge-neutral'
    }
  }

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="card-body p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="card-title text-lg text-base-content">{property.name}</h3>
          <span className={`badge ${getStatusColor(property.status)}`}>
            {property.status}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center text-sm text-base-content/70">
            <span className="w-20 font-medium">Address:</span>
            <span>{property.address}</span>
          </div>
          
          <div className="flex items-center text-sm text-base-content/70">
            <span className="w-20 font-medium">Type:</span>
            <span>{property.type}</span>
          </div>
          
          <div className="flex items-center text-sm text-base-content/70">
            <span className="w-20 font-medium">Rent:</span>
            <span className="font-semibold text-success">${property.monthlyRent}</span>
          </div>
          
          <div className="flex items-center text-sm text-base-content/70">
            <span className="w-20 font-medium">Tenant:</span>
            <span>{property.currentTenant || 'None'}</span>
          </div>
        </div>
        
        <div className="card-actions justify-end mt-4 pt-4 border-t border-base-300">
          <button className="btn btn-primary btn-sm">View Details</button>
          <button className="btn btn-ghost btn-sm">Edit</button>
        </div>
      </div>
    </div>
  )
}
