'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminBuildersPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [builders, setBuilders] = useState<User[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (loading) return; // Wait for auth to load
    
    if (!isAuthenticated || !user) {
      router.push('/auth');
      return;
    }

    if (user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    // Fetch builders data
    fetchBuilders();
  }, [user, isAuthenticated, loading, router]);

  const fetchBuilders = async () => {
    try {
      // This would be your actual API call
      // const response = await fetch('/api/admin/builders');
      // const data = await response.json();
      
      // Mock data for now
      const mockBuilders: User[] = [
        {
          id: '1',
          email: 'builder1@company.com',
          first_name: 'Mike',
          last_name: 'Construction',
          phone: '+919876543215',
          role: 'BUILDER',
          is_active: true,
          created_at: '2024-01-05T08:00:00Z'
        },
        {
          id: '2',
          email: 'builder2@company.com',
          first_name: 'Sarah',
          last_name: 'Developers',
          phone: '+919876543216',
          role: 'BUILDER',
          is_active: true,
          created_at: '2024-01-08T10:15:00Z'
        },
        {
          id: '3',
          email: 'builder3@company.com',
          first_name: 'David',
          last_name: 'Builders',
          phone: '+919876543217',
          role: 'BUILDER',
          is_active: false,
          created_at: '2024-01-15T14:20:00Z'
        }
      ];
      
      setBuilders(mockBuilders);
      setDataLoading(false);
    } catch (error) {
      console.error('Error fetching builders:', error);
      setDataLoading(false);
    }
  };

  const toggleBuilderStatus = async (builderId: string, currentStatus: boolean) => {
    try {
      // This would be your actual API call
      // await fetch(`/api/admin/builders/${builderId}/toggle-status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ is_active: !currentStatus })
      // });
      
      // Update local state
      setBuilders(prev => prev.map(builder => 
        builder.id === builderId 
          ? { ...builder, is_active: !currentStatus }
          : builder
      ));
    } catch (error) {
      console.error('Error updating builder status:', error);
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    router.push('/auth');
    return null;
  }

  // Redirect to dashboard if not admin
  if (user.role !== 'ADMIN') {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Builders</h1>
            <p className="text-gray-600">View and manage all registered builders on the platform</p>
          </div>

          {/* Builders Table */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Registered Builders</h2>
            </div>
            
            {dataLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading builders...</p>
              </div>
            ) : builders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No builders found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Builder
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {builders.map((builder) => (
                      <tr key={builder.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-purple-600">
                                  {builder.first_name.charAt(0)}{builder.last_name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {builder.first_name} {builder.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{builder.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{builder.email}</div>
                          <div className="text-sm text-gray-500">{builder.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            builder.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {builder.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(builder.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => toggleBuilderStatus(builder.id, builder.is_active)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                              builder.is_active
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {builder.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}
