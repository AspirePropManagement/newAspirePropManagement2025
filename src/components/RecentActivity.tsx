import React, { useState } from 'react'
import { RecentActivity as RecentActivityType } from '@/lib/dashboardService'

interface RecentActivityProps {
  activities: RecentActivityType[]
  isLoading: boolean
}

/**
 * Recent activity component displaying latest system activities
 * Implements the Single Responsibility Principle by only handling activity display
 */
export default function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  const [showAll, setShowAll] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  if (isLoading) {
    return (
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
          <p className="text-gray-600">Start by adding properties or users to see activity here.</p>
        </div>
      </div>
    )
  }

  // Show only 5 records initially
  const displayedActivities = showAll ? activities : activities.slice(0, 5)
  const hasMoreActivities = activities.length > 5

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )
      case 'property_added':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )
      case 'project_launched':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const toggleShowAll = () => {
    setShowAll(!showAll)
  }

  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        {hasMoreActivities && (
          <span className="text-sm text-gray-500">
            {activities.length} total activities
          </span>
        )}
      </div>
      
      <div className={`space-y-4 ${isExpanded ? 'max-h-96 overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
        {displayedActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            {getActivityIcon(activity.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-600">{activity.description}</p>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatTimestamp(activity.timestamp)}
            </span>
          </div>
        ))}
      </div>

      {/* Show More/Less Toggle */}
      {hasMoreActivities && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={toggleShowAll}
            className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {showAll ? 'Show Less' : `Show ${activities.length - 5} More Activities`}
          </button>
        </div>
      )}

      {/* Scrollable Toggle (for when there are many activities) */}
      {activities.length > 10 && (
        <div className="mt-2">
          <button
            onClick={toggleExpanded}
            className="w-full px-3 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
          >
            {isExpanded ? 'Collapse' : 'Make Scrollable'}
          </button>
        </div>
      )}
    </div>
  )
}
