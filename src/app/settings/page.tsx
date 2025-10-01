'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  KeyIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  Cog6ToothIcon,
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import authService from '../../lib/authService';
import { Toast } from '../../components/Toast';
import { ScrollArrow } from '@/components/ScrollArrow';

export default function SettingsPage() {
  const { user, userRole, signOut } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword.trim()) {
      setMessage({ type: 'error', text: 'Current password is required' });
      return false;
    }
    
    if (!formData.newPassword.trim()) {
      setMessage({ type: 'error', text: 'New password is required' });
      return false;
    }
    
    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters long' });
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirm password do not match' });
      return false;
    }
    
    if (formData.currentPassword === formData.newPassword) {
      setMessage({ type: 'error', text: 'New password must be different from current password' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      const result = await authService.changePassword(
        user.id,
        formData.currentPassword,
        formData.newPassword
      );
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setIsChangingPassword(false); // Close modal on success
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 py-4 sm:py-6">
        <div className="w-full max-w-none px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Modern Page Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
              <Cog6ToothIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2 sm:mb-3 px-4">
              Settings & Preferences
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Customize your account, security settings, and application preferences
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-16 gap-4 sm:gap-6 max-w-7xl mx-auto">
            
            {/* Profile Quick Access - Medium Tile */}
            <div className="lg:col-span-4 xl:col-span-5 bg-gradient-to-br from-white to-blue-50 rounded-2xl sm:rounded-3xl shadow-xl border border-blue-100 p-4 sm:p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 -translate-y-10 translate-x-10 sm:-translate-y-12 sm:translate-x-12"></div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mr-0 sm:mr-4">
                    <UserIcon className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Profile Management</h2>
                    <p className="text-xs sm:text-sm text-gray-600">Manage your personal information</p>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 bg-white/60 rounded-lg sm:rounded-xl backdrop-blur-sm">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : 'Complete Your Profile'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <div className="mt-2 flex items-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {userRole}
                      </span>
                    </div>
                  </div>
                  
                  <Link
                    href="/profile"
                    className="block w-full p-3 sm:p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Account Security Overview - Large Tile */}
            <div className="lg:col-span-8 xl:col-span-11 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center mr-0 sm:mr-4">
                  <ShieldCheckIcon className="h-6 w-6 sm:h-7 sm:w-7 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Account Security</h2>
                  <p className="text-sm sm:text-base text-gray-600">Manage your account security settings and password</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <KeyIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900">Password Security</h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">Last changed: {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Never'}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3 sm:mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full w-1/3"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Password strength: Weak</p>
                  </div>
                  
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="w-full px-4 py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                  >
                    Change Password
                  </button>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900">Account Status</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Your account is secure</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Email Verified</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Phone Verified</span>
                      <div className={`w-2 h-2 rounded-full ${user.phone ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Account Active</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Scroll Arrow */}
          <ScrollArrow />
        </div>
      </div>

      {/* Password Change Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex items-start justify-between mb-6 sm:mb-8 gap-3">
                <div className="flex items-start flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <KeyIcon className="h-6 w-6 sm:h-7 sm:w-7 text-red-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Change Password</h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600">Update your account password for better security</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors flex-shrink-0"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={formData.currentPassword}
                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-sm sm:text-base"
                        placeholder="Enter your current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                      >
                        {showPasswords.current ? (
                          <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* New Password */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={(e) => handleInputChange('newPassword', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-sm sm:text-base"
                          placeholder="Enter your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                        >
                          {showPasswords.new ? (
                            <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters long
                      </p>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-sm sm:text-base"
                          placeholder="Confirm your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                        >
                          {showPasswords.confirm ? (
                            <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 sm:pt-6 border-t border-gray-100 gap-3 sm:gap-0">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base w-full sm:w-auto"
                  >
                    {isLoading ? 'Changing Password...' : 'Change Password'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast Message */}
      {message && (
        <Toast
          message={message.text}
          type={message.type}
          isVisible={true}
          onClose={() => setMessage(null)}
        />
      )}
    </DashboardLayout>
  );
}
