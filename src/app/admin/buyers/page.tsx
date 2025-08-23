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

export default function AdminBuyersPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [buyers, setBuyers] = useState<User[]>([]);
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

    // Fetch buyers data
    fetchBuyers();
  }, [user, isAuthenticated, loading, router]);

  const fetchBuyers = async () => {
    try {
      // This would be your actual API call
      // const response = await fetch('/api/admin/buyers');
      // const data = await response.json();
      
      // Mock data for now
      const mockBuyers: User[] = [
        {
          id: '1',
          email: 'buyer1@email.com',
          first_name: 'Alice',
          last_name: 'Johnson',
          phone: '+919876543210',
          role: 'BUYER',
          is_active: true,
          created_at: '2024-01-10T09:00:00Z'
        },
        {
          id: '2',
          email: 'buyer2@email.com',
          first_name: 'Bob',
          last_name: 'Williams',
          phone: '+919876543211',
          role: 'BUYER',
          is_active: true,
          created_at: '2024-01-12T11:30:00Z'
        },
        {
          id: '3',
          email: 'buyer3@email.com',
          first_name: 'Carol',
          last_name: 'Brown',
          phone: '+919876543212',
          role: 'BUYER',
          is_active: false,
          created_at: '2024-01-18T16:45:00Z'
        }
      ];
      
      setBuyers(mockBuyers);
      setDataLoading(false);
    } catch (error) {
      console.error('Error fetching buyers:', error);
      setDataLoading(false);
    }
  };

  const toggleBuyerStatus = async (buyerId: string, currentStatus: boolean) => {
    try {
      // This would be your actual API call
      // await fetch(`/api/admin/buyers/${buyerId}/toggle-status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ is_active: !currentStatus })
      // });
      
      // Update local state
      setBuyers(prev => prev.map(buyer => 
        buyer.id === buyerId 
          ? { ...buyer, is_active: !currentStatus }
          : buyer
      ));
    } catch (error) {
      console.error('Error updating buyer status:', error);
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Buyers</h1>
            <p className="text-gray-600">View and manage all registered buyers on the platform</p>
          </div>

          {/* Buyers Table */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Registered Buyers</h2>
            </div>
            
            {dataLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading buyers...</p>
              </div>
            ) : buyers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No buyers found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buyer
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
                    {buyers.map((buyer) => (
                      <tr key={buyer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-green-600">
                                  {buyer.first_name.charAt(0)}{buyer.last_name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {buyer.first_name} {buyer.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{buyer.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{buyer.email}</div>
                          <div className="text-sm text-gray-500">{buyer.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            buyer.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {buyer.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(buyer.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => toggleBuyerStatus(buyer.id, buyer.is_active)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                              buyer.is_active
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {buyer.is_active ? 'Deactivate' : 'Activate'}
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
