'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/Header'
import { ProtectedRoute } from '@/components/ProtectedRoute'

/**
 * Profile page component for authenticated users
 * Implements the Single Responsibility Principle by only handling profile display and management
 */

const getRoleDisplayName = (role: string) => {
  const roleMap: Record<string, string> = {
    buyer: 'Property Buyer',
    agent: 'Real Estate Agent',
    builder: 'Property Builder',
    admin: 'System Administrator'
  }
  return roleMap[role] || role
}

const getRoleBadgeColor = (role: string) => {
  const colorMap: Record<string, string> = {
    buyer: 'bg-blue-100 text-blue-800',
    agent: 'bg-green-100 text-green-800',
    builder: 'bg-purple-100 text-purple-800',
    admin: 'bg-red-100 text-red-800'
  }
  return colorMap[role] || 'bg-gray-100 text-gray-800'
}

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-base-200">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body p-6">
                <div className="space-y-6">
                  {/* Profile Picture Section */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                      <p className="text-gray-600">{user?.email}</p>
                      <p className="text-gray-600">{user?.phone}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRoleBadgeColor(user?.role || '')}`}>
                        {getRoleDisplayName(user?.role || '')}
                      </span>
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${user?.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className="text-sm text-gray-700">
                        {user?.isVerified ? 'Phone Verified' : 'Phone Verification Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={user?.name || ''}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={user?.phone || ''}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          User Role
                        </label>
                        <input
                          type="text"
                          value={getRoleDisplayName(user?.role || '')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Member Since
                        </label>
                        <input
                          type="text"
                          value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Updated
                        </label>
                        <input
                          type="text"
                          value={user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : ''}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                    <div className="flex space-x-4">
                      <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors">
                        Edit Profile
                      </button>
                      <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
