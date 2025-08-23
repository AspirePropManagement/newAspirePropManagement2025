'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { PropertyForm } from '@/components/PropertyForm';
import { 
  HomeIcon, 
  KeyIcon, 
  BuildingOfficeIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { 
  createResaleProperty, 
  createRentalProperty, 
  createNewProject,
  PropertyFormData
} from '@/lib/propertyService';
import { useAuth } from '@/hooks/useAuth';

export default function PropertiesPage() {
  const [activeTab, setActiveTab] = useState('resale');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const { user } = useAuth();

  const tabs = [
    { id: 'resale', name: 'Resale Properties', icon: HomeIcon, color: 'from-blue-500 to-blue-600' },
    { id: 'rental', name: 'Rental Properties', icon: KeyIcon, color: 'from-green-500 to-green-600' },
    { id: 'new_project', name: 'New Projects', icon: BuildingOfficeIcon, color: 'from-purple-500 to-purple-600' },
    { id: 'listing', name: 'Property Listing', icon: ChartBarIcon, color: 'from-indigo-500 to-indigo-600' }
  ];

  const steps = [
    { id: 1, name: 'Basic Information', description: 'Property details and contact info' },
    { id: 2, name: 'Property Details', description: 'Specifications and details' },
    { id: 3, name: 'Images & Documents', description: 'Upload photos and documents' },
    { id: 4, name: 'Amenities', description: 'Select property amenities' },
    { id: 5, name: 'Review & Submit', description: 'Final review and submission' }
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
          setCurrentStep(1);
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
    setCurrentStep(1);
  };

  const getPropertyType = (tabId: string) => {
    switch (tabId) {
      case 'resale': return 'resale';
      case 'rental': return 'rental';
      case 'new_project': return 'new_project';
      default: return 'resale';
    }
  };

  // Fetch properties for listing tab
  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Fetch properties from all three tables
      const [resaleResponse, rentalResponse, newProjectResponse] = await Promise.all([
        fetch('/api/properties/resale'),
        fetch('/api/properties/rental'),
        fetch('/api/properties/new-projects')
      ]);

      const resaleProperties = resaleResponse.ok ? await resaleResponse.json() : [];
      const rentalProperties = rentalResponse.ok ? await rentalResponse.json() : [];
      const newProjectProperties = newProjectResponse.ok ? await newProjectResponse.json() : [];

      // Combine and format all properties into a unified format
      const allProperties = [
        ...resaleProperties.map((prop: any) => ({
          id: prop.id,
          type: 'Resale',
          title: `${prop.bhk_type || ''} ${prop.property_type || ''} - ${prop.society_name || 'Independent'}`.trim(),
          location: prop.location || 'Not specified',
          price: prop.asking_price ? `₹${prop.asking_price.toLocaleString()}` : 'Price not specified',
          status: prop.status || 'Available',
          created_at: prop.created_at,
          seller: prop.seller_name || 'Unknown',
          property_type: prop.property_type || 'Not specified',
          bhk_type: prop.bhk_type || 'Not specified',
          square_feet: prop.square_feet,
          furnishing_type: prop.furnishing_type || 'Not specified',
          source_table: 'resale_properties'
        })),
        ...rentalProperties.map((prop: any) => ({
          id: prop.id,
          type: 'Rental',
          title: `${prop.bhk_type || ''} ${prop.property_type || ''} - ${prop.society_name || 'Independent'}`.trim(),
          location: prop.location || 'Not specified',
          price: prop.monthly_rent ? `₹${prop.monthly_rent.toLocaleString()}/month` : 'Rent not specified',
          status: prop.status || 'Available',
          created_at: prop.created_at,
          seller: prop.owner_name || 'Unknown',
          property_type: prop.property_type || 'Not specified',
          bhk_type: prop.bhk_type || 'Not specified',
          square_feet: prop.square_feet,
          furnishing_type: prop.furnishing_type || 'Not specified',
          source_table: 'rental_properties'
        })),
        ...newProjectProperties.map((prop: any) => ({
          id: prop.id,
          type: 'New Project',
          title: prop.project_name || `${prop.property_type || 'Property'} Project`,
          location: prop.location || 'Not specified',
          price: prop.starting_price ? `₹${prop.starting_price.toLocaleString()}` : 'Price not specified',
          status: prop.construction_status || 'Under Construction',
          created_at: prop.created_at,
          seller: prop.builder_name || 'Unknown',
          property_type: prop.property_type || 'Not specified',
          bhk_type: prop.bhk_type || 'Not specified',
          square_feet: prop.square_feet,
          furnishing_type: 'Not applicable',
          source_table: 'new_projects'
        }))
      ];

      // Sort all properties by creation date (newest first)
      allProperties.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setProperties(allProperties);
      setTotalPages(Math.ceil(allProperties.length / itemsPerPage));
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Fallback to empty array if API fails
      setProperties([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Load properties when listing tab is selected
  useEffect(() => {
    if (activeTab === 'listing') {
      fetchProperties();
    }
  }, [activeTab]);

  // Get current page properties
  const getCurrentPageProperties = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return properties.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Property Management
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Add and manage your properties with comprehensive image uploads and detailed information
            </p>
          </div>

          {/* Property Type Tabs - Centered and Colorful */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full max-w-md sm:max-w-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setCurrentStep(1);
                      setSubmitError(null);
                      setSubmitSuccess(false);
                    }}
                    className={`flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 w-full sm:w-auto ${
                      isActive
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-sm sm:text-base">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeline Steps - Only show when not on listing tab */}
          {activeTab !== 'listing' && (
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        currentStep >= step.id
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 bg-gray-100 text-gray-400'
                      }`}>
                        {currentStep > step.id ? (
                          <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                        ) : (
                          <span className="font-semibold text-sm sm:text-base">{step.id}</span>
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p className={`text-xs sm:text-sm font-medium ${
                          currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {step.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 hidden sm:block">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-0.5 h-8 sm:h-0.5 sm:w-full mx-0 sm:mx-4 transition-all duration-300 ${
                        currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success/Error Messages - Only show when not on listing tab */}
          {activeTab !== 'listing' && submitSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                </div>
                <div className="ml-2 sm:ml-3">
                  <p className="text-xs sm:text-sm font-medium text-green-800">
                    Property submitted successfully! Redirecting to step 1...
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'listing' && submitError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2 sm:ml-3">
                  <p className="text-xs sm:text-sm font-medium text-red-800">
                    {submitError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Container - Full Width - Only show when not on listing tab */}
          {activeTab !== 'listing' && (
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {currentStep === 1 && `Add ${tabs.find(t => t.id === activeTab)?.name.slice(0, -1)}`}
                  {currentStep === 2 && 'Property Specifications'}
                  {currentStep === 3 && 'Images & Documents'}
                  {currentStep === 4 && 'Amenities'}
                  {currentStep === 5 && 'Review & Submit'}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.description}
                </p>
              </div>

              {/* Property Form */}
              <PropertyForm
                propertyType={getPropertyType(activeTab)}
                currentStep={currentStep}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={isSubmitting}
              />

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 space-y-4 sm:space-y-0">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>

                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  <span className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                    Step {currentStep} of {steps.length}
                  </span>
                  
                  {currentStep < 5 && (
                    <button
                      onClick={handleNext}
                      className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                    >
                      Next
                      <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 inline ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Property Listing Tab Content */}
          {activeTab === 'listing' && (
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Property Listing</h2>
                  <p className="text-sm sm:text-base text-gray-600">View and manage all properties in the system</p>
                </div>
                <button
                  onClick={fetchProperties}
                  disabled={loading}
                  className="mt-3 sm:mt-0 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>

              {/* Property Summary Stats */}
              {properties.length > 0 && (
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {properties.filter(p => p.type === 'Resale').length}
                    </div>
                    <div className="text-sm text-blue-800">Resale Properties</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {properties.filter(p => p.type === 'Rental').length}
                    </div>
                    <div className="text-sm text-green-800">Rental Properties</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {properties.filter(p => p.type === 'New Project').length}
                    </div>
                    <div className="text-sm text-purple-800">New Projects</div>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600">Loading properties...</span>
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding your first property.</p>
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab('resale')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Property
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Seller
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getCurrentPageProperties().map((property) => (
                          <tr key={`${property.source_table}-${property.id}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900 mb-1">{property.title}</div>
                              <div className="text-xs text-gray-500">
                                {property.bhk_type !== 'Not specified' && `${property.bhk_type} • `}
                                {property.square_feet && `${property.square_feet} sq ft • `}
                                {property.furnishing_type !== 'Not specified' && property.furnishing_type !== 'Not applicable' && property.furnishing_type}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                property.type === 'Resale' ? 'bg-blue-100 text-blue-800' :
                                property.type === 'Rental' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {property.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {property.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {property.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                property.status === 'Available' ? 'bg-green-100 text-green-800' :
                                property.status === 'Under Construction' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {property.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {property.seller}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(property.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                              <button className="text-green-600 hover:text-green-900 mr-3">Edit</button>
                              <button className="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="lg:hidden space-y-4">
                    {getCurrentPageProperties().map((property) => (
                      <div key={`${property.source_table}-${property.id}`} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">{property.title}</h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                property.type === 'Resale' ? 'bg-blue-100 text-blue-800' :
                                property.type === 'Rental' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {property.type}
                              </span>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                property.status === 'Available' ? 'bg-green-100 text-green-800' :
                                property.status === 'Under Construction' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {property.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          {property.bhk_type !== 'Not specified' && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">BHK Type:</span>
                              <span className="text-gray-900">{property.bhk_type}</span>
                            </div>
                          )}
                          {property.square_feet && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Area:</span>
                              <span className="text-gray-900">{property.square_feet} sq ft</span>
                            </div>
                          )}
                          {property.furnishing_type !== 'Not specified' && property.furnishing_type !== 'Not applicable' && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Furnishing:</span>
                              <span className="text-gray-900">{property.furnishing_type}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-500">Location:</span>
                            <span className="text-gray-900">{property.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Price:</span>
                            <span className="text-gray-900 font-medium">{property.price}</span>
                            {property.type === 'Rental' && <span className="text-xs text-gray-500">/month</span>}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Seller:</span>
                            <span className="text-gray-900">{property.seller}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Date:</span>
                            <span className="text-gray-900">{new Date(property.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200">
                          <button className="text-xs text-blue-600 hover:text-blue-900 font-medium">View</button>
                          <button className="text-xs text-green-600 hover:text-green-900 font-medium">Edit</button>
                          <button className="text-xs text-red-600 hover:text-red-900 font-medium">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
                      <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, properties.length)} of {properties.length} results
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          }`}
                        >
                          Previous
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              currentPage === page
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === totalPages
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

