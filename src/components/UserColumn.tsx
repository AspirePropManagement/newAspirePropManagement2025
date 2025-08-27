import React, { useState } from 'react'
import { UserInfo } from '@/lib/dashboardService'

interface UserColumnProps {
  title: string
  users: UserInfo[]
  count: number
  isLoading: boolean
  color: string
  icon: string
}

/**
 * User column component displaying users by role with pagination
 * Implements the Single Responsibility Principle by only handling user display by role
 */
export default function UserColumn({ title, users, count, isLoading, color, icon }: UserColumnProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 5

  // Calculate pagination
  const totalPages = Math.ceil(users.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = users.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <span className={`text-2xl font-bold ${color}`}>0</span>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span className={`text-2xl font-bold ${color}`}>{count}</span>
      </div>
      
      <div className="space-y-3">
        {currentUsers && currentUsers.length > 0 ? (
          currentUsers.map((user) => (
            <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg">{icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <div className="text-3xl mb-2">{icon}</div>
            <p className="text-sm text-gray-600">No {title.toLowerCase()} registered yet</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {users.length > usersPerPage && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(endIndex, users.length)} of {users.length}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      currentPage === page
                        ? `bg-${color.replace('text-', '')} text-white`
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
