'use client'

import { DashboardStatsData } from '@/types/DashboardStats'

interface DashboardStatsProps {
  stats: DashboardStatsData
}

/**
 * DashboardStats component that displays key performance metrics
 * Implements the Single Responsibility Principle by only handling statistics display
 */
export function DashboardStats({ stats }: DashboardStatsProps) {
  const statItems = [
    {
      label: 'Total Properties',
      value: stats.totalProperties,
      change: '+2.5%',
      changeType: 'positive' as const,
      icon: '🏠'
    },
    {
      label: 'Occupied Units',
      value: stats.occupiedUnits,
      change: '+1.2%',
      changeType: 'positive' as const,
      icon: '✅'
    },
    {
      label: 'Vacant Units',
      value: stats.vacantUnits,
      change: '-0.8%',
      changeType: 'negative' as const,
      icon: '❌'
    },
    {
      label: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      change: '+5.3%',
      changeType: 'positive' as const,
      icon: '💰'
    }
  ]

  return (
    <div className="stats shadow w-full">
      {statItems.map((item, index) => (
        <div key={index} className="stat">
          <div className="stat-figure text-primary text-4xl">{item.icon}</div>
          <div className="stat-title">{item.label}</div>
          <div className="stat-value text-primary">{item.value}</div>
          <div className="stat-desc">
            <span className={`${
              item.changeType === 'positive' ? 'text-success' : 'text-error'
            }`}>
              {item.change}
            </span> from last month
          </div>
        </div>
      ))}
    </div>
  )
}
