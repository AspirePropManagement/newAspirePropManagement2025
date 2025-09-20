'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('BUYER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Role-specific fields
  const [agentFirmName, setAgentFirmName] = useState('');
  const [agentReraId, setAgentReraId] = useState('');
  const [ownerPropertiesCount, setOwnerPropertiesCount] = useState('');
  const [ownerPrimaryLocation, setOwnerPrimaryLocation] = useState('');
  const [builderCompanyName, setBuilderCompanyName] = useState('');
  const [builderReraId, setBuilderReraId] = useState('');
  const [builderYearsExperience, setBuilderYearsExperience] = useState('');
  const router = useRouter();
  const { login, register } = useAuth();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setRole('BUYER');
    setError('');
    setSuccess('');
    // Reset role-specific fields
    setAgentFirmName('');
    setAgentReraId('');
    setOwnerPropertiesCount('');
    setOwnerPrimaryLocation('');
    setBuilderCompanyName('');
    setBuilderReraId('');
    setBuilderYearsExperience('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Login
        const result = await login(email, password);
        
        if (result.success) {
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        // Sign up
        const signupData: any = {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          role: role
        };

        // Add role-specific data
        if (role === 'AGENT') {
          signupData.agent_profile = {
            firm_name: agentFirmName,
            rera_id: agentReraId
          };
        } else if (role === 'OWNER') {
          signupData.owner_profile = {
            properties_count: parseInt(ownerPropertiesCount) || 0,
            primary_location: ownerPrimaryLocation
          };
        } else if (role === 'BUILDER') {
          signupData.builder_profile = {
            company_name: builderCompanyName,
            rera_id: builderReraId,
            years_of_experience: parseInt(builderYearsExperience) || 0
          };
        }

        const result = await register(signupData);
        
        if (result.success) {
          setSuccess('Account created successfully! Redirecting to dashboard...');
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Aspire Property Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Role Selection - Only for signup and at the top */}
            {!isLogin && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Your Role <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('BUYER')}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      role === 'BUYER'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">🏠 Buyer</div>
                    <div className="text-xs text-gray-500">Looking to buy properties</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setRole('AGENT')}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      role === 'AGENT'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">👔 Agent</div>
                    <div className="text-xs text-gray-500">Real estate agent</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setRole('BUILDER')}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      role === 'BUILDER'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">🏗️ Builder</div>
                    <div className="text-xs text-gray-500">Property developer</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setRole('OWNER')}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      role === 'OWNER'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">🏡 Owner</div>
                    <div className="text-xs text-gray-500">Property owner</div>
                  </button>
                </div>
              </div>
            )}

            {/* First Name and Last Name - First row for signup */}
            {!isLogin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required={!isLogin}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required={!isLogin}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                    placeholder="Last name"
                  />
                </div>
              </div>
            )}

            {/* Email Field - Below first name and last name for signup */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                placeholder="Enter your email"
              />
            </div>

            {/* Additional fields for signup */}
            {!isLogin && (
              <>
                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required={!isLogin}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Role-specific fields */}
                {role === 'AGENT' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="agentFirmName" className="block text-sm font-medium text-gray-700 mb-2">
                          Firm Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="agentFirmName"
                          name="agentFirmName"
                          type="text"
                          required
                          value={agentFirmName}
                          onChange={(e) => setAgentFirmName(e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                          placeholder="Enter firm name"
                        />
                      </div>
                      <div>
                        <label htmlFor="agentReraId" className="block text-sm font-medium text-gray-700 mb-2">
                          RERA ID/Number
                        </label>
                        <input
                          id="agentReraId"
                          name="agentReraId"
                          type="text"
                          value={agentReraId}
                          onChange={(e) => setAgentReraId(e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                          placeholder="Enter RERA ID/Number"
                        />
                      </div>
                    </div>
                  </>
                )}

                {role === 'OWNER' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="ownerPropertiesCount" className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Properties Owned
                        </label>
                        <input
                          id="ownerPropertiesCount"
                          name="ownerPropertiesCount"
                          type="number"
                          min="0"
                          value={ownerPropertiesCount}
                          onChange={(e) => setOwnerPropertiesCount(e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                          placeholder="Enter number of properties"
                        />
                      </div>
                      <div>
                        <label htmlFor="ownerPrimaryLocation" className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Location of Properties
                        </label>
                        <input
                          id="ownerPrimaryLocation"
                          name="ownerPrimaryLocation"
                          type="text"
                          value={ownerPrimaryLocation}
                          onChange={(e) => setOwnerPrimaryLocation(e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                          placeholder="Enter primary location"
                        />
                      </div>
                    </div>
                  </>
                )}

                {role === 'BUILDER' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="builderCompanyName" className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="builderCompanyName"
                          name="builderCompanyName"
                          type="text"
                          required
                          value={builderCompanyName}
                          onChange={(e) => setBuilderCompanyName(e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <label htmlFor="builderReraId" className="block text-sm font-medium text-gray-700 mb-2">
                          RERA ID/Number
                        </label>
                        <input
                          id="builderReraId"
                          name="builderReraId"
                          type="text"
                          value={builderReraId}
                          onChange={(e) => setBuilderReraId(e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                          placeholder="Enter RERA ID/Number"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="builderYearsExperience" className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                      </label>
                      <input
                        id="builderYearsExperience"
                        name="builderYearsExperience"
                        type="number"
                        min="0"
                        value={builderYearsExperience}
                        onChange={(e) => setBuilderYearsExperience(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                        placeholder="Enter years of experience"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle between Login and Sign Up */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  resetForm();
                }}
                className="ml-1 text-blue-600 hover:text-blue-500 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500 px-2">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
