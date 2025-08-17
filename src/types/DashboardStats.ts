/**
 * Dashboard statistics data structure
 * Implements the Single Responsibility Principle by only defining statistics data structure
 */
export interface DashboardStatsData {
  totalProperties: number
  occupiedUnits: number
  vacantUnits: number
  monthlyRevenue: number
  occupancyRate: number
  averageRent: number
}
