'use client'

import { useState, useEffect } from 'react'
import { Property } from '@/types/Property'
import { DashboardStatsData } from '@/types/DashboardStats'

/**
 * Custom hook for managing property data
 * Implements the Single Responsibility Principle by only handling property data operations
 */
export function usePropertyData() {
  const [properties, setProperties] = useState<Property[]>([])
  const [stats, setStats] = useState<DashboardStatsData>({
    totalProperties: 0,
    occupiedUnits: 0,
    vacantUnits: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
    averageRent: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call with mock data
        const mockProperties: Property[] = [
          {
            id: '1',
            name: 'Sunset Apartments Unit 101',
            address: '123 Sunset Blvd, Los Angeles, CA',
            type: 'apartment',
            status: 'occupied',
            monthlyRent: 2500,
            currentTenant: 'John Smith',
            bedrooms: 2,
            bathrooms: 2,
            squareFootage: 1200,
            yearBuilt: 2015,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-15')
          },
          {
            id: '2',
            name: 'Downtown Loft 205',
            address: '456 Main St, Los Angeles, CA',
            type: 'condo',
            status: 'vacant',
            monthlyRent: 3200,
            bedrooms: 1,
            bathrooms: 1,
            squareFootage: 900,
            yearBuilt: 2020,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-10')
          },
          {
            id: '3',
            name: 'Family Home on Oak Street',
            address: '789 Oak Ave, Los Angeles, CA',
            type: 'house',
            status: 'occupied',
            monthlyRent: 4500,
            currentTenant: 'Sarah Johnson',
            bedrooms: 3,
            bathrooms: 2,
            squareFootage: 1800,
            yearBuilt: 2010,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-20')
          }
        ]

        const mockStats: DashboardStatsData = {
          totalProperties: mockProperties.length,
          occupiedUnits: mockProperties.filter(p => p.status === 'occupied').length,
          vacantUnits: mockProperties.filter(p => p.status === 'vacant').length,
          monthlyRevenue: mockProperties
            .filter(p => p.status === 'occupied')
            .reduce((sum, p) => sum + p.monthlyRent, 0),
          occupancyRate: (mockProperties.filter(p => p.status === 'occupied').length / mockProperties.length) * 100,
          averageRent: mockProperties.reduce((sum, p) => sum + p.monthlyRent, 0) / mockProperties.length
        }

        setProperties(mockProperties)
        setStats(mockStats)
      } catch (error) {
        console.error('Error fetching property data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { properties, stats, isLoading }
}
