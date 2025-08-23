import React from 'react';
import { User } from '@/types/User';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string, isActive: boolean) => void;
  isAdmin: boolean;
}

/**
 * UserCard component displays user information with action buttons
 */
export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  onToggleStatus,
  isAdmin
}) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'AGENT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BUYER':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'BUILDER':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {user.first_name} {user.last_name}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}>
              {user.role}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(user.is_active)}`}>
              {user.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <span>{user.email}</span>
            </div>
            
            {user.phone && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{user.phone}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => onEdit(user)}
            className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
          >
            Edit
          </button>
          
          <button
            onClick={() => onToggleStatus(user.id, !user.is_active)}
            className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200 ${
              user.is_active
                ? 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300'
                : 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300'
            }`}
          >
            {user.is_active ? 'Deactivate' : 'Activate'}
          </button>
          
          <button
            onClick={() => onDelete(user.id)}
            className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
