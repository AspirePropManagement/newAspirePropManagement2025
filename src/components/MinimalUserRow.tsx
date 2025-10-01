import React from 'react';
import { User } from '@/types/User';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MinimalUserRowProps {
  user: User;
  onClick: (user: User) => void;
  onApprove?: (userId: string) => void;
  onReject?: (userId: string) => void;
  showApprovalActions?: boolean;
}

/**
 * Minimal user row component for compact display in tables
 * Shows essential user info with click to view details
 */
export const MinimalUserRow: React.FC<MinimalUserRowProps> = ({
  user,
  onClick,
  onApprove,
  onReject,
  showApprovalActions = false,
}) => {
  const getStatusBadge = (status?: string, isActive?: boolean) => {
    if (status === 'PENDING') {
      return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
    }
    if (status === 'REJECTED') {
      return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
    }
    if (status === 'APPROVED') {
      return isActive 
        ? <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
        : <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Inactive</span>;
    }
    return isActive 
      ? <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
      : <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't trigger row click if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick(user);
  };

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApprove) {
      onApprove(user.id);
    }
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReject) {
      onReject(user.id);
    }
  };

  return (
    <div 
      onClick={handleRowClick}
      className="p-3 sm:p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              {user.first_name?.[0] || user.email[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : 'N/A'}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
              {getStatusBadge(user.status, user.is_active)}
              <span className="text-xs text-gray-400">
                Joined: {formatDate(user.created_at)}
              </span>
            </div>
          </div>
        </div>
        
        {showApprovalActions && user.status === 'PENDING' && (
          <div className="flex items-center justify-end sm:justify-start space-x-2 flex-shrink-0">
            <button
              onClick={handleApprove}
              className="inline-flex items-center px-3 py-1.5 sm:px-2 sm:py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <CheckIcon className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Approve</span>
              <span className="sm:hidden">✓</span>
            </button>
            <button
              onClick={handleReject}
              className="inline-flex items-center px-3 py-1.5 sm:px-2 sm:py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              <XMarkIcon className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Reject</span>
              <span className="sm:hidden">✗</span>
            </button>
          </div>
        )}
        
        {!showApprovalActions && (
          <div className="text-xs text-gray-400 flex-shrink-0">
            <span className="hidden sm:inline">Click to view details</span>
            <span className="sm:hidden">Click for details</span>
          </div>
        )}
      </div>
    </div>
  );
};
