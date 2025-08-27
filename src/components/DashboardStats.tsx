import React from 'react'
import { DashboardStats as DashboardStatsType } from '@/lib/dashboardService'

interface DashboardStatsProps {
  stats: DashboardStatsType | null
  isLoading: boolean
}

/**
 * Dashboard statistics component displaying key metrics
 * Implements the Single Responsibility Principle by only handling statistics display
 */
export default function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200 animate-pulse">
            <div className="flex items-center">
              <div className="p-2 bg-gray-200 rounded-lg w-10 h-10"></div>
              <div className="ml-3 lg:ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-center text-gray-500">No data available</div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      subtitle: 'All Types Combined',
      icon: (
        <svg className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      subtitle: 'All Registered Users',
      icon: (
        <svg className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Agents',
      value: stats.totalAgents,
      subtitle: 'Property Agents',
      icon: (
        <svg className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Builders',
      value: stats.totalBuilders,
      subtitle: 'Construction Companies',
      icon: (
        <svg className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <div className={`p-2 ${card.bgColor} rounded-lg`}>
              {card.icon}
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-xl lg:text-2xl font-semibold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500">{card.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
