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
            seller_name: 'John Smith',
            submission_date: '2024-01-01',
            seller_email: 'john@example.com',
            seller_contact_no: '1234567890',
            property_type: 'apartment',
            society_name: 'Sunset Apartments',
            bhk_type: '2_bhk',
            square_feet: 1200,
            location: '123 Sunset Blvd, Los Angeles, CA',
            flat_no: '101',
            expected_price: 500000,
            negotiable: true,
            possession_status: 'ready_to_move',
            age_of_property: '5 years',
            floor_no: 5,
            total_floors: 10,
            facing: 'north',
            parking: 'covered',
            furnished_status: 'semi_furnished',
            visit_details: 'Available for viewing',
            has_amenities: true,
            status: 'available',
            created_at: '2024-01-01',
            updated_at: '2024-01-15',
            created_by: 'admin'
          } as ResaleProperty
        ]

        const mockStats: DashboardStatsData = {
          totalProperties: mockProperties.length,
          occupiedUnits: mockProperties.filter(p => p.status === 'occupied').length,
          vacantUnits: mockProperties.filter(p => p.status === 'vacant').length,
          monthlyRevenue: 0, // No monthly rent in resale properties
          occupancyRate: (mockProperties.filter(p => p.status === 'occupied').length / mockProperties.length) * 100,
          averageRent: 0 // No monthly rent in resale properties
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
