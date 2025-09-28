import React, { useState, useEffect } from 'react';
import { User } from '@/types/User';
import { XMarkIcon, CheckIcon, XMarkIcon as RejectIcon, UserIcon, BuildingOfficeIcon, HomeIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (userId: string) => void;
  onReject?: (userId: string) => void;
  showApprovalActions?: boolean;
}

interface AgentProfile {
  firm_name?: string;
  rera_id?: string;
  rera_number?: string;
  website_url?: string;
  logo_url?: string;
  verified?: boolean;
}

interface BuilderProfile {
  company_name?: string;
  rera_id?: string;
  rera_number?: string;
  years_of_experience?: number;
  projects_completed?: number;
  website_url?: string;
  logo_url?: string;
  verified?: boolean;
}

interface OwnerProfile {
  properties_count?: number;
  primary_location?: string;
  city?: string;
  verified?: boolean;
}

/**
 * Enhanced modal to display complete user information with beautiful styling
 * Shows user profile data and optional approval actions for pending users
 */
export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
  onApprove,
  onReject,
  showApprovalActions = false,
}) => {
  const [profileData, setProfileData] = useState<AgentProfile | BuilderProfile | OwnerProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch profile data when user changes
  useEffect(() => {
    if (!user || !supabase) return;

    const fetchProfileData = async () => {
      setProfileLoading(true);
      try {
        let data = null;
        if (user.role === 'AGENT') {
          const { data: agentData } = await supabase
            .from('agent_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
          data = agentData;
        } else if (user.role === 'BUILDER') {
          const { data: builderData } = await supabase
            .from('builder_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
          data = builderData;
        } else if (user.role === 'OWNER') {
          const { data: ownerData } = await supabase
            .from('owner_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();
          data = ownerData;
        }
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (!isOpen || !user) return null;

  const getStatusBadge = (status?: string, isActive?: boolean) => {
    if (status === 'PENDING') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200 shadow-sm">
          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
          Pending Approval
        </span>
      );
    }
    if (status === 'REJECTED') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200 shadow-sm">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          Rejected
        </span>
      );
    }
    if (status === 'APPROVED') {
      return isActive ? (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Active
        </span>
      ) : (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200 shadow-sm">
          <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
          Inactive
        </span>
      );
    }
    return isActive ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200 shadow-sm">
        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
        Inactive
      </span>
    );
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200';
      case 'AGENT':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200';
      case 'BUYER':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'BUILDER':
        return 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200';
      case 'OWNER':
        return 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'AGENT':
        return <UserIcon className="h-5 w-5" />;
      case 'BUILDER':
        return <BuildingOfficeIcon className="h-5 w-5" />;
      case 'OWNER':
        return <HomeIcon className="h-5 w-5" />;
      default:
        return <UserIcon className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const InfoRow = ({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) => (
    <div className={`flex justify-between items-center py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-sm ${
      highlight ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100' : 'bg-gray-50 hover:bg-gray-100'
    }`}>
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-blue-800' : 'text-gray-900'}`}>
        {value || 'N/A'}
      </span>
    </div>
  );

  const renderProfileSection = () => {
    if (profileLoading) {
      return (
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Loading profile data...</span>
          </div>
        </div>
      );
    }

    if (!profileData) {
      return (
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-2">📄</div>
            <div className="text-sm text-gray-600">No additional profile data available</div>
          </div>
        </div>
      );
    }

    if (user.role === 'AGENT') {
      const agentProfile = profileData as AgentProfile;
      return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-2 mb-4">
            <UserIcon className="h-6 w-6 text-blue-600" />
            <h5 className="text-lg font-semibold text-blue-800">Agent Profile</h5>
            {agentProfile.verified && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Verified
              </span>
            )}
          </div>
          <div className="space-y-2">
            <InfoRow label="Firm Name" value={agentProfile.firm_name || ''} highlight />
            <InfoRow label="RERA ID" value={agentProfile.rera_id || ''} />
            <InfoRow label="RERA Number" value={agentProfile.rera_number || ''} />
            <InfoRow label="Website" value={agentProfile.website_url || ''} />
          </div>
        </div>
      );
    }

    if (user.role === 'BUILDER') {
      const builderProfile = profileData as BuilderProfile;
      return (
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center space-x-2 mb-4">
            <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
            <h5 className="text-lg font-semibold text-purple-800">Builder Profile</h5>
            {builderProfile.verified && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Verified
              </span>
            )}
          </div>
          <div className="space-y-2">
            <InfoRow label="Company Name" value={builderProfile.company_name || ''} highlight />
            <InfoRow label="RERA ID" value={builderProfile.rera_id || ''} />
            <InfoRow label="RERA Number" value={builderProfile.rera_number || ''} />
            <InfoRow label="Years of Experience" value={builderProfile.years_of_experience || 0} />
            <InfoRow label="Projects Completed" value={builderProfile.projects_completed || 0} />
            <InfoRow label="Website" value={builderProfile.website_url || ''} />
          </div>
        </div>
      );
    }

    if (user.role === 'OWNER') {
      const ownerProfile = profileData as OwnerProfile;
      return (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center space-x-2 mb-4">
            <HomeIcon className="h-6 w-6 text-orange-600" />
            <h5 className="text-lg font-semibold text-orange-800">Owner Profile</h5>
            {ownerProfile.verified && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Verified
              </span>
            )}
          </div>
          <div className="space-y-2">
            <InfoRow label="Properties Count" value={ownerProfile.properties_count || 0} highlight />
            <InfoRow label="Primary Location" value={ownerProfile.primary_location || ''} />
            <InfoRow label="City" value={ownerProfile.city || ''} />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-4xl shadow-2xl rounded-2xl border border-gray-200 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {user.first_name?.[0] || user.email[0].toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold">User Profile Details</h3>
                <p className="text-blue-100 text-sm">Complete information and profile data</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 focus:outline-none transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-20"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* User Header */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 mb-6 border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {user.first_name?.[0] || user.email[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-gray-900 mb-1">
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : 'N/A'}
                </h4>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border shadow-sm ${getRoleBadgeColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    <span className="ml-2">{user.role}</span>
                  </span>
                  {getStatusBadge(user.status, user.is_active)}
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information Table */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-3 border-b border-gray-200">
              <h5 className="text-lg font-semibold text-gray-800">Basic Information</h5>
            </div>
            <div className="p-4 space-y-2">
              <InfoRow label="First Name" value={user.first_name || ''} />
              <InfoRow label="Last Name" value={user.last_name || ''} />
              <InfoRow label="Email Address" value={user.email} highlight />
              <InfoRow label="Phone Number" value={user.phone || ''} />
              <InfoRow label="User Role" value={user.role} />
              <InfoRow label="Account Status" value={user.is_active ? 'Active' : 'Inactive'} />
              <InfoRow label="Approval Status" value={user.status || 'N/A'} />
              <InfoRow label="Registration Date" value={formatDate(user.created_at)} />
              <InfoRow label="Last Updated" value={formatDate(user.updated_at)} />
            </div>
          </div>

          {/* Profile Data Section */}
          {renderProfileSection()}

          {/* Status Reason (if rejected) */}
          {user.status === 'REJECTED' && user.status_reason && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200 mb-6">
              <h5 className="text-lg font-semibold text-red-800 mb-3">Rejection Details</h5>
              <div className="bg-white rounded-lg p-4 border border-red-100">
                <p className="text-sm text-red-700">{user.status_reason}</p>
              </div>
            </div>
          )}

          {/* Approval Actions */}
          {showApprovalActions && user.status === 'PENDING' && onApprove && onReject && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-lg font-semibold text-yellow-800">Pending Approval</h5>
                  <p className="text-sm text-yellow-700">Review this user's registration and take action</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      onApprove(user.id);
                      onClose();
                    }}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <CheckIcon className="h-5 w-5 mr-2" />
                    Approve User
                  </button>
                  <button
                    onClick={() => {
                      onReject(user.id);
                      onClose();
                    }}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <RejectIcon className="h-5 w-5 mr-2" />
                    Reject User
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-gray-600 to-slate-600 text-white rounded-lg hover:from-gray-700 hover:to-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-md transform hover:scale-105 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};