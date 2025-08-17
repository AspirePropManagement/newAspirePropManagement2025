/**
 * Property entity representing a real estate property
 * Implements the Single Responsibility Principle by only defining property data structure
 */
export interface Property {
  id: string
  name: string
  address: string
  type: PropertyType
  status: PropertyStatus
  monthlyRent: number
  currentTenant?: string
  bedrooms?: number
  bathrooms?: number
  squareFootage?: number
  yearBuilt?: number
  createdAt: Date
  updatedAt: Date
}

export type PropertyType = 'apartment' | 'house' | 'condo' | 'townhouse' | 'commercial'
export type PropertyStatus = 'occupied' | 'vacant' | 'maintenance' | 'reserved'
