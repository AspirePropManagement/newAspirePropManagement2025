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
  ChartBarIcon,
  PlusIcon
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
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  
  const { user } = useAuth();

  // Role-specific welcome messages and descriptions
  const getRoleSpecificContent = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return {
          title: 'Property Management',
          subtitle: 'Manage all properties across the platform with comprehensive analytics and control',
          welcomeMessage: 'Welcome to the Property Management Center. You have full access to manage all properties, view analytics, and oversee the entire property ecosystem.'
        };
      case 'AGENT':
        return {
          title: 'Property Management',
          subtitle: 'List and manage properties for your clients with professional tools',
          welcomeMessage: 'Welcome to your Property Management Dashboard. List new properties, manage your listings, and help clients find their perfect home.'
        };
      case 'BUILDER':
        return {
          title: 'Project Management',
          subtitle: 'Create and manage your construction projects and property developments',
          welcomeMessage: 'Welcome to your Project Management Center. Showcase your construction projects, manage timelines, and attract potential buyers.'
        };
      case 'BUYER':
        return {
          title: 'Property Search',
          subtitle: 'Browse and save properties that match your requirements',
          welcomeMessage: 'Welcome to your Property Search Dashboard. Browse available properties, save your favorites, and find your dream home.'
        };
      default:
        return {
          title: 'Property Management',
          subtitle: 'Add and manage your properties with comprehensive image uploads and detailed information',
          welcomeMessage: 'Welcome to the Property Management Dashboard.'
        };
    }
  };

  const roleContent = getRoleSpecificContent(user?.role || '');

  const tabs = [
    { id: 'resale', name: 'Resale Properties', icon: HomeIcon, color: 'from-blue-500 to-blue-600' },
    { id: 'rental', name: 'Rental Properties', icon: KeyIcon, color: 'from-green-500 to-green-600' },
    { id: 'new_project', name: 'New Projects', icon: BuildingOfficeIcon, color: 'from-purple-500 to-purple-600' },
    { id: 'listing', name: 'Property Listing', icon: ChartBarIcon, color: 'from-indigo-500 to-indigo-600' }
  ];

  // Filter tabs based on user role
  const getRoleSpecificTabs = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return tabs; // Admin sees all tabs
      case 'AGENT':
        return tabs.filter(tab => tab.id !== 'new_project'); // Agents don't create new projects
      case 'BUILDER':
        return tabs.filter(tab => tab.id === 'new_project' || tab.id === 'listing'); // Builders focus on new projects
      case 'BUYER':
        return [tabs[3]]; // Buyers only see the listing tab
      default:
        return tabs;
    }
  };

  const roleSpecificTabs = getRoleSpecificTabs(user?.role || '');

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

  // Fetch properties for listing tab with role-based filtering
  const fetchProperties = async () => {
    setLoading(true);
    try {
      let resaleProperties = [];
      let rentalProperties = [];
      let newProjectProperties = [];

      if (user?.role === 'ADMIN') {
        // Admin can see all properties from all users
        const [resaleResponse, rentalResponse, newProjectResponse] = await Promise.all([
          fetch('/api/properties/resale'),
          fetch('/api/properties/rental'),
          fetch('/api/properties/new-projects')
        ]);

        resaleProperties = resaleResponse.ok ? await resaleResponse.json() : [];
        rentalProperties = rentalResponse.ok ? await rentalResponse.json() : [];
        newProjectProperties = newProjectResponse.ok ? await newProjectResponse.json() : [];
      } else {
        // Other roles can only see their own properties
        const userId = user?.id;
        if (!userId) {
          throw new Error('User ID not found');
        }

        const [resaleResponse, rentalResponse, newProjectResponse] = await Promise.all([
          fetch(`/api/properties/resale?userId=${userId}`),
          fetch(`/api/properties/rental?userId=${userId}`),
          fetch(`/api/properties/new-projects?userId=${userId}`)
        ]);

        resaleProperties = resaleResponse.ok ? await resaleResponse.json() : [];
        rentalProperties = rentalResponse.ok ? await rentalResponse.json() : [];
        newProjectProperties = newProjectResponse.ok ? await newProjectResponse.json() : [];
      }

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
          source_table: 'resale_properties',
          user_id: prop.created_by || prop.user_id || prop.seller_id || prop.owner_id || prop.builder_id,
          // Store original database fields for editing
          seller_name: prop.seller_name,
          created_by: prop.created_by,
          asking_price: prop.asking_price,
          society_name: prop.society_name,
          flat_no: prop.flat_no,
          wing_no: prop.wing_no,
          floor_no: prop.floor_no,
          facing: prop.facing,
          parking_type: prop.parking_type,
          property_age: prop.property_age,
          is_negotiable: prop.is_negotiable,
          has_amenities: prop.has_amenities,
          notes: prop.notes
        })),
        ...rentalProperties.map((prop: any) => ({
          id: prop.id,
          type: 'Rental',
          title: `${prop.bhk_type || ''} ${prop.property_type || ''} - ${prop.society_name || 'Independent'}`.trim(),
          location: prop.location || 'Not specified',
          price: prop.rent_amount ? `₹${prop.rent_amount.toLocaleString()}/month` : 'Rent not specified',
          status: prop.status || 'Available',
          created_at: prop.created_at,
          seller: prop.owner_name || 'Unknown',
          property_type: prop.property_type || 'Not specified',
          bhk_type: prop.bhk_type || 'Not specified',
          square_feet: prop.square_feet,
          furnishing_type: prop.furnishing_type || 'Not specified',
          source_table: 'rental_properties',
          user_id: prop.created_by || prop.user_id || prop.seller_id || prop.owner_id || prop.builder_id,
          // Store original database fields for editing
          owner_name: prop.owner_name,
          created_by: prop.created_by,
          rent_amount: prop.rent_amount,
          deposit_amount: prop.deposit_amount,
          rent_negotiable: prop.rent_negotiable,
          deposit_negotiable: prop.deposit_negotiable,
          allowed_for_family: prop.allowed_for_family,
          allowed_for_bachelor: prop.allowed_for_bachelor,
          allowed_for_anyone: prop.allowed_for_anyone,
          pets_allowed: prop.pets_allowed,
          immediate_possession: prop.immediate_possession,
          available_from_date: prop.available_from_date,
          visit_details: prop.visit_details
        })),
        ...newProjectProperties.map((prop: any) => ({
          id: prop.id,
          type: 'New Project',
          title: prop.project_name || `${prop.property_type || 'Property'} Project`,
          location: prop.project_location || 'Not specified',
          price: prop.starting_price ? `₹${prop.starting_price.toLocaleString()}` : 'Price not specified',
          status: prop.construction_status || 'Under Construction',
          created_at: prop.created_at,
          seller: prop.builder_name || 'Unknown',
          property_type: prop.property_type || 'Not specified',
          bhk_type: prop.bhk_type || 'Not specified',
          square_feet: prop.square_feet,
          furnishing_type: 'Not applicable',
          source_table: 'new_projects',
          user_id: prop.created_by || prop.user_id || prop.seller_id || prop.owner_id || prop.builder_id,
          // Store original database fields for editing
          project_name: prop.project_name,
          created_by: prop.created_by,
          project_location: prop.project_location,
          project_type: prop.project_type,
          construction_type: prop.construction_type,
          crafted_by: prop.crafted_by,
          rooms_per_floor: prop.rooms_per_floor,
          cp_sables: prop.cp_sables,
          other_notes: prop.other_notes,
          contact_name_1: prop.contact_name_1,
          contact_number_1: prop.contact_number_1,
          contact_name_2: prop.contact_name_2,
          contact_number_2: prop.contact_number_2,
          is_govt_approved: prop.is_govt_approved,
          is_rera_approved: prop.is_rera_approved,
          loan_available: prop.loan_available,
          social_media_marketing_allowed: prop.social_media_marketing_allowed,
          important_notes: prop.important_notes,
          units_available_for_sale: prop.units_available_for_sale,
          rera_number: prop.rera_number,
          project_conversion_rate: prop.project_conversion_rate
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

  const openPropertyModal = (property: any) => {
    // Debug: Log the actual property object to see what fields are available
    console.log('=== PROPERTY OBJECT DEBUG ===');
    console.log('Full property object:', property);
    console.log('All available fields:', Object.keys(property));
    console.log('Sample field values:');
    console.log('- seller_name:', property.seller_name);
    console.log('- asking_price:', property.asking_price);
    console.log('- location:', property.location);
    console.log('- bhk_type:', property.bhk_type);
    console.log('- square_feet:', property.square_feet);
    console.log('- furnishing_type:', property.furnishing_type);
    console.log('- property_type:', property.property_type);
    console.log('- society_name:', property.society_name);
    console.log('- flat_no:', property.flat_no);
    console.log('- wing_no:', property.wing_no);
    console.log('- floor_no:', property.floor_no);
    console.log('- created_by:', property.created_by);
    console.log('- user_id:', property.user_id);
    console.log('=== END DEBUG ===');
    
    setSelectedProperty(property);
    setIsModalOpen(true);
    setIsEditing(false);
    setEditFormData({});
  };

  // Check if user can edit/delete this property
  const canEditProperty = (property: any) => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    return property.user_id === user.id;
  };

  const closePropertyModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
    setIsEditing(false);
    setEditFormData({});
  };

  const handleEditProperty = (property: any) => {
    // Debug: Log all available fields in the property
    console.log('Property object for editing:', property);
    console.log('Available fields:', Object.keys(property));
    
    // Initialize edit form data with current property values
    // Using the correct field names from the database schema
    setEditFormData({
      seller_name: property.seller_name || '',
      asking_price: property.asking_price || '',
      location: property.location || '',
      bhk_type: property.bhk_type || '',
      square_feet: property.square_feet || '',
      furnishing_type: property.furnishing_type || '',
      property_type: property.property_type || '',
      society_name: property.society_name || '',
      flat_no: property.flat_no || '',
      wing_no: property.wing_no || '',
      floor_no: property.floor_no || '',
      facing: property.facing || '',
      parking_type: property.parking_type || '',
      property_age: property.property_age || '',
      is_negotiable: property.is_negotiable || false,
      has_amenities: property.has_amenities || false,
      notes: property.notes || ''
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedProperty) return;

    try {
      // Filter out empty values and only send fields that have data
      const filteredData = Object.fromEntries(
        Object.entries(editFormData).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
      );

      console.log('Sending update data:', filteredData);
      console.log('Property type:', selectedProperty.source_table);

      // Determine the API endpoint based on the property type
      let endpoint = '';
      switch (selectedProperty.source_table) {
        case 'resale_properties':
          endpoint = `/api/properties/resale/${selectedProperty.id}`;
          break;
        case 'rental_properties':
          endpoint = `/api/properties/rental/${selectedProperty.id}`;
          break;
        case 'new_projects':
          endpoint = `/api/properties/new-projects/${selectedProperty.id}`;
          break;
        default:
          throw new Error('Unknown property type');
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredData),
      });

      if (response.ok) {
        // Exit edit mode
        setIsEditing(false);
        setEditFormData({});
        
        // Refresh the properties list
        fetchProperties();
        
        // Show success message
        alert('✅ Property updated successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating property:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again.';
      alert(`❌ Failed to update property: ${errorMessage}`);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
  };

  const handleDeleteProperty = async (property: any) => {
    const propertyName = property.seller_name ? `${property.seller_name}'s Property` : 'Property Details';
    
    if (!confirm(`Are you sure you want to delete "${propertyName}"?\n\nThis action cannot be undone and will permanently remove the property from the system.`)) {
      return;
    }

    try {
      // Show loading state
      const deleteButton = document.querySelector(`button[onclick*="handleDeleteProperty"]`);
      if (deleteButton) {
        deleteButton.textContent = 'Deleting...';
        deleteButton.setAttribute('disabled', 'true');
      }

      // Determine the API endpoint based on the property type
      let endpoint = '';
      switch (property.source_table) {
        case 'resale_properties':
          endpoint = `/api/properties/resale/${property.id}`;
          break;
        case 'rental_properties':
          endpoint = `/api/properties/rental/${property.id}`;
          break;
        case 'new_projects':
          endpoint = `/api/properties/new-projects/${property.id}`;
          break;
        default:
          throw new Error('Unknown property type');
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Close the modal
        closePropertyModal();
        
        // Refresh the properties list
        fetchProperties();
        
        // Show success message
        alert(`✅ "${propertyName}" has been deleted successfully!`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      const errorMessage = error instanceof Error ? error.message : 'Please try again.';
      alert(`❌ Failed to delete property: ${errorMessage}`);
    } finally {
      // Reset button state
      const deleteButton = document.querySelector(`button[onclick*="handleDeleteProperty"]`);
      if (deleteButton) {
        deleteButton.textContent = 'Delete Property';
        deleteButton.removeAttribute('disabled');
      }
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closePropertyModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              {roleContent.title}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              {roleContent.subtitle}
            </p>
            {roleContent.welcomeMessage && (
              <p className="text-sm text-gray-600 mt-2 max-w-2xl mx-auto">{roleContent.welcomeMessage}</p>
            )}
          </div>

          {/* Role-Specific Welcome Banner */}
          <div className="mb-6 sm:mb-8">
            {user?.role === 'ADMIN' && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-blue-900">Admin Dashboard</h3>
                    <p className="text-blue-700">You have full access to manage all properties, users, and system analytics.</p>
                  </div>
                </div>
              </div>
            )}

            {user?.role === 'AGENT' && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-green-900">Agent Portal</h3>
                    <p className="text-green-700">List properties for your clients and manage your professional portfolio.</p>
                  </div>
                </div>
              </div>
            )}

            {user?.role === 'BUILDER' && (
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-purple-900">Builder Portal</h3>
                    <p className="text-purple-700">Showcase your construction projects and attract potential buyers.</p>
                  </div>
                </div>
              </div>
            )}

            {user?.role === 'BUYER' && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-orange-900">Property Search</h3>
                    <p className="text-orange-700">Browse available properties and find your perfect home.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Property Type Tabs - Centered and Colorful */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full max-w-md sm:max-w-none">
              {roleSpecificTabs.map((tab) => {
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
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                        {user?.role === 'ADMIN' ? 'All Properties (System View)' : 
                         user?.role === 'BUYER' ? 'Property Search' : 
                         'My Property Listing'}
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600">
                        {user?.role === 'ADMIN' 
                          ? 'View and manage all properties from all users in the system' 
                          : user?.role === 'BUYER' 
                          ? 'Search and browse available properties' 
                          : 'View and manage your own property listings'
                        }
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0">
                      {user?.role !== 'BUYER' && (
                        <button
                          onClick={() => setActiveTab('resale')}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                          <PlusIcon className="w-4 h-4" />
                          <span>Add Property</span>
                        </button>
                      )}
                      <button
                        onClick={fetchProperties}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                      >
                        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                      </button>
                    </div>
                                    </div>

                  {/* Role-Based Property Information Banner */}
                  <div className="mb-6">
                    {user?.role === 'ADMIN' ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span className="text-blue-800 font-medium">Admin View: You can see all properties from all users in the system.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-green-800 font-medium">
                            {user?.role === 'AGENT' && 'Agent View: You can see only your own property listings.'}
                            {user?.role === 'BUILDER' && 'Builder View: You can see only your own construction projects.'}
                            {user?.role === 'BUYER' && 'Buyer View: You can browse all available properties in the system.'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Search and Filter Interface for Buyers */}
                  {user?.role === 'BUYER' && (
                    <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">All Types</option>
                            <option value="resale">Resale</option>
                            <option value="rental">Rental</option>
                            <option value="new_project">New Project</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">BHK Type</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">All BHK</option>
                            <option value="1">1 BHK</option>
                            <option value="2">2 BHK</option>
                            <option value="3">3 BHK</option>
                            <option value="4+">4+ BHK</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Any Price</option>
                            <option value="0-500000">Under ₹5 Lakhs</option>
                            <option value="500000-1000000">₹5-10 Lakhs</option>
                            <option value="1000000-2000000">₹10-20 Lakhs</option>
                            <option value="2000000+">Above ₹20 Lakhs</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                          <input 
                            type="text" 
                            placeholder="Enter location"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                          Search Properties
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Property Summary Stats */}
                  {properties.length > 0 && (
                    <div className="mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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
                      
                      {/* Role-specific summary information */}
                      {user?.role === 'ADMIN' && (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-indigo-800 mb-2">System Overview</div>
                            <div className="text-sm text-indigo-700">
                              Total Properties: {properties.length} | 
                              Total Users: {new Set(properties.map(p => p.user_id)).size} | 
                              Active Listings: {properties.filter(p => p.status === 'Available').length}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {user?.role !== 'ADMIN' && user?.role !== 'BUYER' && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-amber-800 mb-2">Your Portfolio Summary</div>
                            <div className="text-sm text-amber-700">
                              Total Properties: {properties.length} | 
                              Available: {properties.filter(p => p.status === 'Available').length} | 
                              Last Updated: {properties.length > 0 ? new Date(Math.max(...properties.map(p => new Date(p.created_at).getTime()))).toLocaleDateString() : 'Never'}
                            </div>
                          </div>
                        </div>
                      )}
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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {user?.role === 'ADMIN' ? 'No properties found in the system' : 'No properties found'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {user?.role === 'ADMIN' 
                      ? 'No properties have been added to the system yet.' 
                      : user?.role === 'BUYER'
                      ? 'No properties match your search criteria.'
                      : 'Get started by adding your first property.'
                    }
                  </p>
                  {user?.role !== 'BUYER' && (
                    <div className="mt-6">
                      <button
                        onClick={() => setActiveTab('resale')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Add Property
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Desktop Table - Minimal */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getCurrentPageProperties().map((property) => (
                          <tr 
                            key={`${property.source_table}-${property.id}`} 
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => openPropertyModal(property)}
                          >
                            <td className="px-4 py-4">
                              <div className="text-sm font-medium text-gray-900">
                          {property.seller_name ? `${property.seller_name}'s Property` : 'Property Details'}
                        </div>
                              <div className="text-xs text-gray-500">{property.location}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                property.type === 'Resale' ? 'bg-blue-100 text-blue-800' :
                                property.type === 'Rental' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {property.type}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {property.price}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                property.status === 'Available' ? 'bg-green-100 text-green-800' :
                                property.status === 'Under Construction' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {property.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(property.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards - Minimal */}
                  <div className="lg:hidden space-y-3">
                    {getCurrentPageProperties().map((property) => (
                      <div 
                        key={`${property.source_table}-${property.id}`} 
                        className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 cursor-pointer transition-all shadow-sm hover:shadow-md"
                        onClick={() => openPropertyModal(property)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">
                          {property.seller_name ? `${property.seller_name}'s Property` : 'Property Details'}
                        </h3>
                            <p className="text-xs text-gray-500">{property.location}</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            property.type === 'Resale' ? 'bg-blue-100 text-blue-800' :
                            property.type === 'Rental' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {property.type}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900">{property.price}</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            property.status === 'Available' ? 'bg-green-100 text-green-800' :
                            property.status === 'Under Construction' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {property.status}
                          </span>
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

      {/* Property Detail Modal */}
      {isModalOpen && selectedProperty && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={closePropertyModal}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>
              <button
                onClick={closePropertyModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Property Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedProperty.seller_name ? `${selectedProperty.seller_name}'s Property` : 'Property Details'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedProperty.type === 'Resale' ? 'bg-blue-100 text-blue-800' :
                      selectedProperty.type === 'Rental' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {selectedProperty.type}
                    </span>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedProperty.status === 'Available' ? 'bg-green-100 text-green-800' :
                      selectedProperty.status === 'Under Construction' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedProperty.status}
                    </span>
                  </div>
                </div>
                <p className="text-lg text-gray-600">{selectedProperty.location}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ₹{selectedProperty.asking_price || 'Price not set'}
                </p>
              </div>

              {/* Property Details Table */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">Property Details</h4>
                
                <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Property Information Section */}
                      <tr className="bg-gray-50">
                        <td colSpan={2} className="px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 border-b border-gray-200">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Property Information
                          </div>
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">Seller Name</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editFormData.seller_name || ''}
                              onChange={(e) => setEditFormData({...editFormData, seller_name: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            selectedProperty.seller_name || 'N/A'
                          )}
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">Asking Price</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editFormData.asking_price || ''}
                              onChange={(e) => setEditFormData({...editFormData, asking_price: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            `₹${selectedProperty.asking_price || 'N/A'}`
                          )}
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">Location</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editFormData.location || ''}
                              onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            selectedProperty.location || 'N/A'
                          )}
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">BHK Type</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <select
                              value={editFormData.bhk_type || ''}
                              onChange={(e) => setEditFormData({...editFormData, bhk_type: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="">Select BHK Type</option>
                              <option value="1_rk_1_bhk">1 RK/1 BHK</option>
                              <option value="2_bhk">2 BHK</option>
                              <option value="3_bhk">3 BHK</option>
                              <option value="4_bhk">4 BHK</option>
                              <option value="5_bhk">5 BHK</option>
                              <option value="5_plus_bhk">5+ BHK</option>
                            </select>
                          ) : (
                            selectedProperty.bhk_type || 'N/A'
                          )}
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">Area (sq ft)</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <div className="flex items-center">
                              <input
                                type="number"
                                value={editFormData.square_feet || ''}
                                onChange={(e) => setEditFormData({...editFormData, square_feet: e.target.value})}
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-500">sq ft</span>
                            </div>
                          ) : (
                            selectedProperty.square_feet ? `${selectedProperty.square_feet} sq ft` : 'N/A'
                          )}
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">Furnishing</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <select
                              value={editFormData.furnishing_type || ''}
                              onChange={(e) => setEditFormData({...editFormData, furnishing_type: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="">Select Furnishing</option>
                              <option value="fully_furnished">Fully Furnished</option>
                              <option value="semi_furnished">Semi-Furnished</option>
                              <option value="un_furnished">Unfurnished</option>
                            </select>
                          ) : (
                            selectedProperty.furnishing_type || 'N/A'
                          )}
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">Property Type</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <select
                              value={editFormData.property_type || ''}
                              onChange={(e) => setEditFormData({...editFormData, property_type: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="">Select Property Type</option>
                              <option value="apartment">Apartment</option>
                              <option value="gated_community_villa_or_bungalow">Gated Community/Villa/Bungalow</option>
                              <option value="independent_house">Independent House</option>
                            </select>
                          ) : (
                            selectedProperty.property_type || 'N/A'
                          )}
                        </td>
                      </tr>
                      
                      {/* Temporarily hidden Description field for testing
                      {selectedProperty.description && (
                        <tr className="hover:bg-blue-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">Description</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {isEditing ? (
                              <textarea
                                value={editFormData.description || ''}
                                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                rows={2}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                              />
                            ) : (
                              selectedProperty.description
                            )}
                          </td>
                        </tr>
                      )}
                      */}
                      
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">Society Name</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editFormData.society_name || ''}
                              onChange={(e) => setEditFormData({...editFormData, society_name: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            selectedProperty.society_name || 'N/A'
                          )}
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">Flat No</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editFormData.flat_no || ''}
                              onChange={(e) => setEditFormData({...editFormData, flat_no: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            selectedProperty.flat_no || 'N/A'
                          )}
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">Wing No</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editFormData.wing_no || ''}
                              onChange={(e) => setEditFormData({...editFormData, wing_no: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            selectedProperty.wing_no || 'N/A'
                          )}
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">Floor No</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editFormData.floor_no || ''}
                              onChange={(e) => setEditFormData({...editFormData, floor_no: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            selectedProperty.floor_no || 'N/A'
                          )}
                        </td>
                      </tr>
                      
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">Listing Type</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{selectedProperty.type}</td>
                      </tr>
                      
                      {/* Contact & Ownership Section */}
                      <tr className="bg-gray-50">
                        <td colSpan={2} className="px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 border-b border-gray-200">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Contact & Ownership
                          </div>
                        </td>
                      </tr>
                      
                      {/* Temporarily hidden Seller field for testing
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">Seller/Owner</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editFormData.seller || ''}
                              onChange={(e) => setEditFormData({...editFormData, seller: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          ) : (
                            selectedProperty.seller
                          )}
                        </td>
                      </tr>
                      */}
                      
                      {user?.role === 'ADMIN' && (
                        <tr className="hover:bg-blue-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">Created By</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {selectedProperty.user_id ? (
                              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                {selectedProperty.user_id}
                              </span>
                            ) : (
                              'Not available'
                            )}
                          </td>
                        </tr>
                      )}
                      
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">Listed Date</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{new Date(selectedProperty.created_at).toLocaleDateString()}</td>
                      </tr>
                      
                      <tr className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 w-1/3 border-r border-gray-100">Source Table</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{selectedProperty.source_table}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>



              {/* Actions Section */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Actions</h4>
                <div className="flex flex-wrap gap-3">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                      >
                        Cancel Edit
                      </button>
                    </>
                  ) : user?.role === 'BUYER' ? (
                    <>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Save Property
                      </button>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                        Contact Seller
                      </button>
                      <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                        Schedule Viewing
                      </button>
                    </>
                  ) : canEditProperty(selectedProperty) ? (
                    <>
                      <button 
                        onClick={() => handleEditProperty(selectedProperty)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Edit Property
                      </button>
                      <button 
                        onClick={() => handleDeleteProperty(selectedProperty)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Delete Property
                      </button>
                    </>
                  ) : (
                    <div className="text-gray-500 text-sm italic">
                      You can only edit properties that you own.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={closePropertyModal}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

