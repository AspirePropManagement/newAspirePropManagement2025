import { useState, useEffect } from 'react'
import { getDashboardStats, getPropertyAnalytics, DashboardStats } from '@/lib/dashboardService'

/**
 * Custom hook for managing dashboard data
 * Implements the Single Responsibility Principle by only handling dashboard data operations
 */
export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch dashboard statistics and analytics in parallel
        const [statsData, analyticsData] = await Promise.all([
          getDashboardStats(),
          getPropertyAnalytics()
        ])

        setStats(statsData)
        setAnalytics(analyticsData)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const refreshData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [statsData, analyticsData] = await Promise.all([
        getDashboardStats(),
        getPropertyAnalytics()
      ])

      setStats(statsData)
      setAnalytics(analyticsData)
    } catch (err) {
      console.error('Error refreshing dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    stats,
    analytics,
    isLoading,
    error,
    refreshData
  }
}
