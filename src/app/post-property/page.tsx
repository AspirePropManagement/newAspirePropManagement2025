'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { PropertyForm } from '@/components/PropertyForm';
import { PropertyFormSkeleton } from '@/components/skeletons';
import { ScrollArrow } from '@/components/ScrollArrow';
import { 
  createResaleProperty, 
  createRentalProperty, 
  createNewProject,
  PropertyFormData
} from '@/lib/propertyService';

export default function PostPropertyPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Property form states
  const [activeTab, setActiveTab] = useState('resale');
  
  // Separate step states for each property type tab
  const [stepStates, setStepStates] = useState({
    resale: 1,
    rental: 1,
    new_project: 1
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Get current step for active tab
  const currentStep = stepStates[activeTab as keyof typeof stepStates];
  
  const router = useRouter();
  const { user, isAuthenticated, login, register } = useAuth();

  const handleNext = () => {
    if (currentStep < 5) {
      setStepStates(prev => ({
        ...prev,
        [activeTab]: currentStep + 1
      }));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setStepStates(prev => ({
        ...prev,
        [activeTab]: currentStep - 1
      }));
    }
  };

  const handleStepChange = (step: number) => {
    setStepStates(prev => ({
      ...prev,
      [activeTab]: step
    }));
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Each property type is its own form. Start the selected type fresh at step 1;
    // combined with the key={activeTab} on <PropertyForm>, this resets the form's
    // internal field state on switch so one tab's values can never leak into another
    // tab's submission (which previously caused New Project inserts to fail on
    // columns like furnishing_type/society_name that new_projects doesn't have).
    setStepStates(prev => ({ ...prev, [tabId]: 1 }));
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        // Login
        const result = await login(email, password);
        
        if (result.success) {
          setSuccess('Login successful! You can now post your property.');
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        // Sign up
        const result = await register({
          email,
          password,
          first_name: '',
          last_name: '',
          phone: '',
          role: 'BUYER'
        });
        
        if (result.success) {
          setSuccess('Account created successfully! You can now post your property.');
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


  const handleSubmit = async (formData: PropertyFormData) => {
    if (!user) {
      setSubmitError('You must be logged in to submit a property. Please login first.');
      return;
    }
    
    // Double-check localStorage for user ID
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setSubmitError('User session expired. Please login again.');
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser.id) {
        setSubmitError('Invalid user session. Please login again.');
        return;
      }
    } catch (error) {
      setSubmitError('Error reading user session. Please login again.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      let result;
      
      switch (activeTab) {
        case 'resale':
          result = await createResaleProperty(formData as any, user.id);
          break;
        case 'rental':
          result = await createRentalProperty(formData as any, user.id);
          break;
        case 'new_project':
          result = await createNewProject(formData as any, user.id);
          break;
        default:
          throw new Error('Invalid property type');
      }

      if (result.success) {
        setSubmitSuccess(true);
        console.log('Property submitted successfully:', result.data);
        
        // Reset form and show success message
        setTimeout(() => {
          setStepStates({
            resale: 1,
            rental: 1,
            new_project: 1
          });
          setSubmitSuccess(false);
        }, 2000);
      } else {
        setSubmitError(result.error || 'Failed to submit property');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setStepStates({
      resale: 1,
      rental: 1,
      new_project: 1
    });
  };

  const getPropertyType = (tabId: string) => {
    switch (tabId) {
      case 'resale':
        return 'Resale Property';
      case 'rental':
        return 'Rental Property';
      case 'new_project':
        return 'New Project';
      default:
        return 'Property';
    }
  };

  // Show login form if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          {/* Header - Mobile Responsive */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Post Your Property
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {isLogin ? 'Sign in to post your property' : 'Create an account to post your property'}
            </p>
          </div>

          {/* Auth Form Card - Mobile Responsive */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
            <form onSubmit={handleAuthSubmit} className="space-y-4 sm:space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
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
                    setError('');
                    setSuccess('');
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

          {/* Scroll Arrow */}
          <ScrollArrow />
        </div>
      </div>
    );
  }

  // Show property form if user is authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Mobile Responsive */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Post Your Property
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            List your property and reach thousands of potential buyers and renters across our platform
          </p>
        </div>

        {/* Property Type Tabs - Mobile Responsive */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 mb-6 sm:mb-8 overflow-hidden">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-0 px-2 sm:px-4 overflow-x-auto" aria-label="Tabs">
              {[
                { id: 'resale', name: 'Resale', icon: '🏠', gradient: 'from-blue-500 to-indigo-500' },
                { id: 'rental', name: 'Rental', icon: '🔑', gradient: 'from-green-500 to-emerald-500' },
                { id: 'new_project', name: 'New Project', icon: '🏗️', gradient: 'from-purple-500 to-pink-500' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`group relative flex-1 min-w-[80px] sm:min-w-0 py-3 sm:py-4 px-1 sm:px-2 text-center transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {activeTab === tab.id && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-t-lg sm:rounded-t-xl shadow-lg`}></div>
                  )}
                  <div className="relative z-10 flex flex-col items-center space-y-1">
                    <span className="text-base sm:text-lg group-hover:scale-110 transition-transform duration-300">{tab.icon}</span>
                    <span className="font-semibold text-xs sm:text-xs whitespace-nowrap">{tab.name}</span>
                  </div>
                  {activeTab !== tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 rounded-t-lg sm:rounded-t-xl transition-opacity duration-300"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Property Form - Mobile Responsive */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {isSubmitting ? (
            <div className="p-4 sm:p-6 md:p-8">
              <PropertyFormSkeleton />
            </div>
          ) : (
            <div className="p-4 sm:p-6 md:p-8">
              <PropertyForm
                key={activeTab}
                propertyType={activeTab as 'resale' | 'rental' | 'new_project'}
                currentStep={currentStep}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={isSubmitting}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            </div>
          )}

          {/* Success Message - Mobile Responsive */}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 m-4 sm:m-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm sm:text-base font-medium text-green-800">
                    Property Posted Successfully!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Your {getPropertyType(activeTab).toLowerCase()} has been submitted and is under review.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message - Mobile Responsive */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4 sm:m-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm sm:text-base font-medium text-red-800">
                    Error Submitting Property
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{submitError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scroll Arrow */}
        <ScrollArrow />
      </div>
    </div>
  );
}
