'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  ShieldCheckIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import authService from '@/lib/authService';
import { Toast } from '@/components/Toast';
import { ScrollArrow } from '@/components/ScrollArrow';

export default function ProfilePage() {
  const { user, userRole, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || ''
  });
  const [agentData, setAgentData] = useState({ firm_name: '', rera_id: '' });
  const [loadingAgentData, setLoadingAgentData] = useState(false);
  
  // Password change form state
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Check URL parameters for password change modal
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('changePassword') === 'true') {
      setIsChangingPassword(true);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Load agent profile if applicable
  React.useEffect(() => {
    const loadAgent = async () => {
      if (!user || userRole !== 'AGENT' || !supabase) return;
      setLoadingAgentData(true);
      const { data, error } = await supabase
        .from('agent_profiles')
        .select('firm_name, rera_id')
        .eq('user_id', user.id)
        .single();
      if (!error && data) {
        setAgentData({ firm_name: data.firm_name || '', rera_id: data.rera_id || '' });
      }
      setLoadingAgentData(false);
    };
    loadAgent();
  }, [user, userRole]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user || !supabase) {
      setIsEditing(false);
      return;
    }

    // Update basic user profile
    await supabase
      .from('users')
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone
      })
      .eq('id', user.id);

    // If agent, upsert agent profile details
    if (userRole === 'AGENT') {
      await supabase
        .from('agent_profiles')
        .upsert({
          user_id: user.id,
          firm_name: agentData.firm_name,
          rera_id: agentData.rera_id
        }, { onConflict: 'user_id' });
    }

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
  };

  const handleSignOut = () => {
    localStorage.clear();
    signOut();
  };

  // Password change handlers
  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordFormData(prev => ({
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

  const validatePasswordForm = () => {
    if (!passwordFormData.currentPassword.trim()) {
      setMessage({ type: 'error', text: 'Current password is required' });
      return false;
    }
    
    if (!passwordFormData.newPassword.trim()) {
      setMessage({ type: 'error', text: 'New password is required' });
      return false;
    }
    
    if (passwordFormData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters long' });
      return false;
    }
    
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirm password do not match' });
      return false;
    }
    
    if (passwordFormData.currentPassword === passwordFormData.newPassword) {
      setMessage({ type: 'error', text: 'New password must be different from current password' });
      return false;
    }
    
    return true;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    if (!user) {
      setMessage({ type: 'error', text: 'User not found' });
      return;
    }
    
    setIsLoadingPassword(true);
    setMessage(null);
    
    try {
      const result = await authService.changePassword(
        user.id,
        passwordFormData.currentPassword,
        passwordFormData.newPassword
      );
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordFormData({
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
      setIsLoadingPassword(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6 sm:py-8">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Please log in to view your profile</h1>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 sm:py-6">
        <div className="w-full max-w-none px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Modern Page Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
              <UserIcon className="h-6 w-6 sm:h-7 sm:h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2 sm:mb-3 px-4">
              Profile Management
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Manage your account settings, security preferences, and personal information
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-16 gap-4 sm:gap-6 max-w-7xl mx-auto">
            
            {/* Profile Avatar & Quick Info - Large Tile */}
            <div className="lg:col-span-4 xl:col-span-5 bg-gradient-to-br from-white to-blue-50 rounded-2xl sm:rounded-3xl shadow-xl border border-blue-100 p-4 sm:p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                    <span className="text-white font-bold text-xl sm:text-2xl">
                      {user.first_name?.charAt(0).toUpperCase() || 
                       user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 px-2">
                    {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : 'Complete Your Profile'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-2 truncate max-w-full px-2">{user.email}</p>
                  <div className="flex items-center flex-wrap justify-center gap-2 sm:space-x-4">
                    <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium rounded-full">
                      {userRole || 'Unknown'}
                    </span>
                    <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-medium rounded-full">
                      Active
                    </span>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-white/60 rounded-lg sm:rounded-xl backdrop-blur-sm">
                    <span className="text-xs sm:text-sm text-gray-600 flex items-center">
                      <EnvelopeIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Email Verified
                    </span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-white/60 rounded-lg sm:rounded-xl backdrop-blur-sm">
                    <span className="text-xs sm:text-sm text-gray-600 flex items-center">
                      <PhoneIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Phone {user.phone ? 'Verified' : 'Not Added'}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${user.phone ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-white/60 rounded-lg sm:rounded-xl backdrop-blur-sm">
                    <span className="text-xs sm:text-sm text-gray-600">Member Since</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      }) : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information - Large Tile */}
            <div className="lg:col-span-8 xl:col-span-11 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                    <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                    Personal Information
                  </h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base w-full sm:w-auto"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-sm sm:text-base"
                      placeholder="Enter your first name"
                        />
                      ) : (
                    <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                      <span className="text-gray-900 font-medium text-sm sm:text-base">{user.first_name || 'Not provided'}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-sm sm:text-base"
                      placeholder="Enter your last name"
                        />
                      ) : (
                    <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                      <span className="text-gray-900 font-medium text-sm sm:text-base">{user.last_name || 'Not provided'}</span>
                    </div>
                  )}
                  </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 rounded-lg sm:rounded-xl border border-gray-200 cursor-not-allowed">
                    <span className="text-gray-900 font-medium text-sm sm:text-base break-all">{user.email || 'No email address'}</span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-start sm:items-center">
                    <svg className="w-3 h-3 mr-1 mt-0.5 sm:mt-0 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Email address cannot be changed for security reasons
                  </p>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-sm sm:text-base"
                      placeholder="Enter your phone number"
                      />
                    ) : (
                    <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                      <span className="text-gray-900 font-medium text-sm sm:text-base">{user.phone || 'Not provided'}</span>
                    </div>
                    )}
                  </div>

                  {/* Agent specific fields */}
                  {userRole === 'AGENT' && (
                  <>
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                          Firm Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={agentData.firm_name}
                            onChange={(e) => setAgentData(prev => ({ ...prev, firm_name: e.target.value }))}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-sm sm:text-base"
                          placeholder="Enter firm name"
                          />
                        ) : (
                        <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                          <span className="text-gray-900 font-medium text-sm sm:text-base">{agentData.firm_name || 'Not provided'}</span>
                        </div>
                        )}
                      </div>
                    
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                          RERA ID/Number
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={agentData.rera_id}
                            onChange={(e) => setAgentData(prev => ({ ...prev, rera_id: e.target.value }))}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white text-sm sm:text-base"
                          placeholder="Enter RERA ID"
                          />
                        ) : (
                        <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                          <span className="text-gray-900 font-medium text-sm sm:text-base">{agentData.rera_id || 'Not provided'}</span>
                        </div>
                        )}
                    </div>
                  </>
                  )}
              </div>

                  {isEditing && (
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 pt-6 sm:pt-8 border-t border-gray-100 mt-6 sm:mt-8">
                      <button
                        onClick={handleSaveProfile}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base w-full sm:w-auto"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
              </div>

            {/* Account Security - Medium Tile */}
            <div className="lg:col-span-12 xl:col-span-16 bg-gradient-to-br from-white to-green-50 rounded-2xl sm:rounded-3xl shadow-xl border border-green-100 p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mr-0 sm:mr-4">
                  <ShieldCheckIcon className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Account Security</h2>
                  <p className="text-sm sm:text-base text-gray-600">Protect your account with strong security measures</p>
                </div>
                </div>

              <div className="max-w-2xl">
                <div className="bg-white/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-100 hover:shadow-lg transition-all duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 sm:gap-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <KeyIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">Password</p>
                        <p className="text-xs sm:text-sm text-gray-500">Last changed: Never</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm shadow-md hover:shadow-lg w-full sm:w-auto"
                    >
                      Change Password
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full w-1/3"></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Password strength: Weak</p>
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

              <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordFormData.currentPassword}
                        onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
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
                          value={passwordFormData.newPassword}
                          onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
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
                          value={passwordFormData.confirmPassword}
                          onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
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
                    disabled={isLoadingPassword}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base w-full sm:w-auto"
                  >
                    {isLoadingPassword ? 'Changing Password...' : 'Change Password'}
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
