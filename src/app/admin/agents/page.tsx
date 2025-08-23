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

export default function AdminAgentsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [agents, setAgents] = useState<User[]>([]);
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

    // Fetch agents data
    fetchAgents();
  }, [user, isAuthenticated, loading, router]);

  const fetchAgents = async () => {
    try {
      // This would be your actual API call
      // const response = await fetch('/api/admin/agents');
      // const data = await response.json();
      
      // Mock data for now
      const mockAgents: User[] = [
        {
          id: '1',
          email: 'agent1@aspire.com',
          first_name: 'John',
          last_name: 'Doe',
          phone: '+919876543210',
          role: 'AGENT',
          is_active: true,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          email: 'agent2@aspire.com',
          first_name: 'Jane',
          last_name: 'Smith',
          phone: '+919876543211',
          role: 'AGENT',
          is_active: true,
          created_at: '2024-01-20T14:30:00Z'
        }
      ];
      
      setAgents(mockAgents);
      setDataLoading(false);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setDataLoading(false);
    }
  };

  const toggleAgentStatus = async (agentId: string, currentStatus: boolean) => {
    try {
      // This would be your actual API call
      // await fetch(`/api/admin/agents/${agentId}/toggle-status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ is_active: !currentStatus })
      // });
      
      // Update local state
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, is_active: !currentStatus }
          : agent
      ));
    } catch (error) {
      console.error('Error updating agent status:', error);
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Agents</h1>
            <p className="text-gray-600">View and manage all registered agents on the platform</p>
          </div>

          {/* Agents Table */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Registered Agents</h2>
            </div>
            
            {dataLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading agents...</p>
              </div>
            ) : agents.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No agents found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Agent
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
                    {agents.map((agent) => (
                      <tr key={agent.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {agent.first_name.charAt(0)}{agent.last_name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {agent.first_name} {agent.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{agent.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{agent.email}</div>
                          <div className="text-sm text-gray-500">{agent.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            agent.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {agent.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(agent.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => toggleAgentStatus(agent.id, agent.is_active)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                              agent.is_active
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {agent.is_active ? 'Deactivate' : 'Activate'}
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
