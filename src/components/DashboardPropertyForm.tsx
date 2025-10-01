'use client';

import React, { useState } from 'react';
import { PropertyForm } from './PropertyForm';
import { PropertyFormSkeleton } from './skeletons';
import PropertyListingsTable from './PropertyListingsTable';
import { 
  createResaleProperty, 
  createRentalProperty, 
  createNewProject,
  PropertyFormData
} from '@/lib/propertyService';
import { useAuth } from '@/hooks/useAuth';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DashboardPropertyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Dashboard Property Form Component
 * Provides an inline property posting form within the dashboard
 * Implements the Single Responsibility Principle by handling only property posting
 */
export default function DashboardPropertyForm({ isOpen, onClose, onSuccess }: DashboardPropertyFormProps) {
  const { user } = useAuth();
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
    // Reset error and success states when switching tabs
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleSubmit = async (formData: PropertyFormData) => {
    if (!user) {
      setSubmitError('You must be logged in to submit a property. Please login again.');
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
          onSuccess?.();
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
    setSubmitError(null);
    setSubmitSuccess(false);
    onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Header - Mobile Responsive */}
        <div className="flex items-center justify-between p-4 sm:p-6 md:p-8 bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">Post Your Property</h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base md:text-lg truncate">Add a new property to the platform</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="group p-2 sm:p-3 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex-shrink-0 ml-2"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>

        {/* Property Type Tabs - Mobile Responsive */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <nav className="flex space-x-0 px-2 sm:px-4 overflow-x-auto" aria-label="Tabs">
            {[
              { id: 'resale', name: 'Resale', icon: '🏠', gradient: 'from-blue-500 to-indigo-500' },
              { id: 'rental', name: 'Rental', icon: '🔑', gradient: 'from-green-500 to-emerald-500' },
              { id: 'new_project', name: 'New Project', icon: '🏗️', gradient: 'from-purple-500 to-pink-500' },
              { id: 'listings', name: 'Listings', icon: '📋', gradient: 'from-orange-500 to-red-500' }
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
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 opacity-0 group-hover:opacity-100 rounded-t-lg sm:rounded-t-xl transition-opacity duration-300"></div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Property Form - Mobile Responsive */}
        <div className="overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-200px)] bg-gradient-to-br from-white to-gray-50 custom-scrollbar">
          {isSubmitting ? (
            <div className="p-4 sm:p-6 md:p-8">
              <PropertyFormSkeleton />
            </div>
          ) : activeTab === 'listings' ? (
            <div className="p-4 sm:p-6">
              <PropertyListingsTable />
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              <PropertyForm
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
      </div>
    </div>
  );
}
