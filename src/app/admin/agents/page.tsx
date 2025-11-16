'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { UserTableRow } from '@/components/UserTableRow';
import { UserTableHeader } from '@/components/UserTableHeader';
import { UserEditModal } from '@/components/UserEditModal';
import { InlinePreloader } from '@/components/Preloader';
import { Pagination } from '@/components/Pagination';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardPropertyForm from '@/components/DashboardPropertyForm';
import { UserDetailsModal } from '@/components/UserDetailsModal';
import { MinimalUserRow } from '@/components/MinimalUserRow';
import { RejectionModal } from '@/components/RejectionModal';
import { ToastContainer } from '@/components/ToastContainer';
import { ScrollArrow } from '@/components/ScrollArrow';
import { useToast } from '@/hooks/useToast';
import { User } from '@/types/User';
import { UserUpdateData } from '@/types/User';
import { getPendingUsersByRole, approveUser, rejectUser } from '@/lib/userService';

/**
 * Admin Agents page - displays all agent users with admin management capabilities
 * Includes tabs for active agents and pending approvals with click-to-view details
 */
export default function AdminAgentsPage() {
  const { users, loading, error, updateUser, deleteUser, toggleUserStatus, refreshUsers } = useUserManagement('AGENT');
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('pending'); // Default to pending
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  
  // Pagination for pending users
  const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
  const [pendingPageSize, setPendingPageSize] = useState(10);
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [rejectionUser, setRejectionUser] = useState<User | null>(null);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  
  // Pagination and filtering for active users
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch pending users
  const fetchPendingUsers = async () => {
    try {
      setPendingLoading(true);
      const pending = await getPendingUsersByRole('AGENT');
      setPendingUsers(pending);
    } catch (err) {
      console.error('Error fetching pending agents:', err);
    } finally {
      setPendingLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  // Filter ACTIVE users (exclude pending) based on search and status
  const filteredActiveUsers = useMemo(() => {
    return users.filter(user => {
      // Only show approved/active users (exclude pending)
      if (user.status === 'PENDING') return false;
      
      const matchesSearch = searchQuery === '' || 
        user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && user.is_active) ||
        (statusFilter === 'inactive' && !user.is_active);
      
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  // Paginate filtered users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredActiveUsers.slice(startIndex, endIndex);
  }, [filteredActiveUsers, currentPage, pageSize]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredActiveUsers.length / pageSize);

  // Paginate pending users
  const paginatedPendingUsers = useMemo(() => {
    const startIndex = (pendingCurrentPage - 1) * pendingPageSize;
    const endIndex = startIndex + pendingPageSize;
    return pendingUsers.slice(startIndex, endIndex);
  }, [pendingUsers, pendingCurrentPage, pendingPageSize]);

  const pendingTotalPages = Math.ceil(pendingUsers.length / pendingPageSize);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Reset pending pagination when tab changes
  useEffect(() => {
    if (activeTab === 'pending') {
      setPendingCurrentPage(1);
    } else {
      setCurrentPage(1);
    }
  }, [activeTab]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      await toggleUserStatus(userId, isActive);
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Failed to update user status. Please try again.');
    }
  };

  const handleSaveEdit = async (userId: string, userData: UserUpdateData) => {
    try {
      await updateUser(userId, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
      throw error;
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      await approveUser(userId);
      await fetchPendingUsers();
      await refreshUsers();
      showSuccess('Agent approved successfully!');
    } catch (error) {
      console.error('Error approving user:', error);
      showError('Failed to approve user. Please try again.');
    }
  };

  const handleReject = async (userId: string) => {
    const user = pendingUsers.find(u => u.id === userId) || users.find(u => u.id === userId);
    if (user) {
      setRejectionUser(user);
      setIsRejectionModalOpen(true);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectionUser) return;
    
    try {
      await rejectUser(rejectionUser.id, reason || undefined);
      await fetchPendingUsers();
      showSuccess('Agent rejected successfully.');
    } catch (error) {
      console.error('Error rejecting user:', error);
      showError('Failed to reject user. Please try again.');
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handlePendingPageChange = (page: number) => {
    setPendingCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePendingPageSizeChange = (size: number) => {
    setPendingPageSize(size);
    setPendingCurrentPage(1);
  };

  if (loading) {
    return (
      <DashboardLayout onPostPropertyClick={() => setShowPropertyForm(true)}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Agent Management</h1>
            <p className="text-gray-600 mt-2">Manage all agent accounts in the system</p>
          </div>
          <InlinePreloader text="Fetching agents..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout onPostPropertyClick={() => setShowPropertyForm(true)}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Agents</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Agent Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage all agent accounts in the system</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4 sm:mb-6">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Approvals ({pendingUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Agents ({filteredActiveUsers.length})
            </button>
          </nav>
        </div>

        {activeTab === 'pending' ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">Agents Waiting for Approval</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Click on any row to view details, or use quick approve/reject actions</p>
            </div>
            {pendingLoading ? (
              <div className="p-6">
                <InlinePreloader text="Loading pending agents..." />
              </div>
            ) : pendingUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">✅</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
                <p className="text-gray-600">All agent registrations have been reviewed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        User
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Role
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Phone
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Joined
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedPendingUsers.map((user) => (
                      <tr 
                    key={user.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleUserClick(user)}
                      >
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-xs sm:text-sm font-medium text-gray-700">
                                  {user.first_name?.[0] || user.email[0].toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-2 sm:ml-4 min-w-0">
                              <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                {user.first_name && user.last_name
                                  ? `${user.first_name} ${user.last_name}`
                                  : 'N/A'}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {user.role}
                          </span>
                        </td>
                        
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </td>
                        
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {user.phone || 'N/A'}
                        </td>
                        
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </td>
                        
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(user.id);
                              }}
                              className="inline-flex items-center px-3 py-1.5 sm:px-2 sm:py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                            >
                              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="hidden sm:inline">Approve</span>
                              <span className="sm:hidden">✓</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReject(user.id);
                              }}
                              className="inline-flex items-center px-3 py-1.5 sm:px-2 sm:py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                            >
                              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span className="hidden sm:inline">Reject</span>
                              <span className="sm:hidden">✗</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination for Pending Users */}
            {!pendingLoading && pendingUsers.length > 0 && (
              <Pagination
                currentPage={pendingCurrentPage}
                totalPages={pendingTotalPages}
                totalItems={pendingUsers.length}
                pageSize={pendingPageSize}
                onPageChange={handlePendingPageChange}
                onPageSizeChange={handlePendingPageSizeChange}
              />
            )}
          </div>
        ) : (
          <>
            <UserTableHeader
              title="Active Agents"
              totalUsers={filteredActiveUsers.length}
              onSearch={handleSearch}
              onFilterStatus={handleStatusFilter}
            />

            {filteredActiveUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👨‍💼</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {users.length === 0 ? 'No Agents Found' : 'No Active Agents Match Your Search'}
                </h2>
                <p className="text-gray-600">
                  {users.length === 0 
                    ? 'There are currently no approved agent accounts in the system.'
                    : 'Try adjusting your search criteria or filters.'
                  }
                </p>
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        User
                      </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Role
                      </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Phone
                      </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Joined
                      </th>
                        <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedUsers.map((user) => (
                      <UserTableRow
                        key={user.id}
                        user={user}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                        onClick={handleUserClick}
                      />
                    ))}
                  </tbody>
                </table>
                </div>
                
                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredActiveUsers.length}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedUser(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        showApprovalActions={selectedUser?.status === 'PENDING'}
      />

      <UserEditModal
        user={editingUser}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={handleSaveEdit}
      />
      
      {/* Dashboard Property Form Modal */}
      <DashboardPropertyForm
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
        onSuccess={() => {
          setShowPropertyForm(false);
        }}
      />

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={isRejectionModalOpen}
        onClose={() => {
          setIsRejectionModalOpen(false);
          setRejectionUser(null);
        }}
        onReject={handleRejectConfirm}
        userName={rejectionUser ? `${rejectionUser.first_name || ''} ${rejectionUser.last_name || ''}`.trim() || rejectionUser.email : ''}
        userRole={rejectionUser?.role || ''}
      />

      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
      />

      {/* Scroll Arrow */}
      <ScrollArrow />
    </DashboardLayout>
  );
}