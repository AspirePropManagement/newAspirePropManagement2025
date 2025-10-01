'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  BuildingOfficeIcon,
  HomeIcon,
  KeyIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

interface PropertyListingsTableProps {
  onClose?: () => void;
}

interface PropertyData {
  id: string;
  type: 'resale' | 'rental' | 'new_project';
  title: string;
  location: string;
  price: number;
  bhkType?: string;
  status: string;
  createdAt: string;
  [key: string]: any;
}

/**
 * PropertyListingsTable component for displaying all property listings
 * Organized by tabs for different property types with detailed view functionality
 */
export default function PropertyListingsTable({ onClose }: PropertyListingsTableProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'resale' | 'rental' | 'new_project'>('resale');
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch properties based on active tab
  const fetchProperties = async (propertyType: 'resale' | 'rental' | 'new_project') => {
    if (!user || !supabase) return;
    
    setLoading(true);
    try {
      let query;
      let tableName;
      
      switch (propertyType) {
        case 'resale':
          tableName = 'resale_properties';
          query = supabase
            .from('resale_properties')
            .select('*')
            .eq('created_by', user.id)
            .order('created_at', { ascending: false });
          break;
        case 'rental':
          tableName = 'rental_properties';
          query = supabase
            .from('rental_properties')
            .select('*')
            .eq('created_by', user.id)
            .order('created_at', { ascending: false });
          break;
        case 'new_project':
          tableName = 'new_projects';
          query = supabase
            .from('new_projects')
            .select('*')
            .eq('created_by', user.id)
            .order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Transform data to common format
      const transformedData: PropertyData[] = (data || []).map(item => ({
        id: item.id,
        type: propertyType,
        title: getPropertyTitle(item, propertyType),
        location: getPropertyLocation(item, propertyType),
        price: getPropertyPrice(item, propertyType),
        bhkType: getPropertyBHK(item, propertyType),
        status: item.status || 'active',
        createdAt: item.created_at,
        ...item
      }));

      setProperties(transformedData);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to extract data from different property types
  const getPropertyTitle = (item: any, type: string) => {
    switch (type) {
      case 'resale':
        return item.society_name || `${item.bhk_type?.replace('_', ' ').toUpperCase()} ${item.property_type?.replace('_', ' ')}` || 'Resale Property';
      case 'rental':
        return item.society_name || `${item.bhk_type?.replace('_', ' ').toUpperCase()} ${item.property_type?.replace('_', ' ')}` || 'Rental Property';
      case 'new_project':
        return item.project_name || 'New Project';
      default:
        return 'Property';
    }
  };

  const getPropertyLocation = (item: any, type: string) => {
    switch (type) {
      case 'new_project':
        return item.project_location || 'Location not specified';
      default:
        return item.location || 'Location not specified';
    }
  };

  const getPropertyPrice = (item: any, type: string) => {
    switch (type) {
      case 'resale':
        return item.asking_price || 0;
      case 'rental':
        return item.rent_amount || 0;
      case 'new_project':
        return item.min_price || 0;
      default:
        return 0;
    }
  };

  const getPropertyBHK = (item: any, type: string) => {
    if (type === 'new_project') return 'N/A';
    return item.bhk_type?.replace('_', ' ').toUpperCase() || 'N/A';
  };

  // Format price for display
  const formatPrice = (price: number, type: string) => {
    if (!price) return 'Price on request';
    
    const suffix = type === 'rental' ? '/month' : '';
    
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr${suffix}`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lacs${suffix}`;
    } else {
      return `₹${price.toLocaleString()}${suffix}`;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Handle row click to show details
  const handleRowClick = (property: PropertyData) => {
    setSelectedProperty(property);
    setShowDetailModal(true);
  };

  useEffect(() => {
    fetchProperties(activeTab);
  }, [activeTab, user]);

  const tabs = [
    { id: 'resale', name: 'Resale', icon: HomeIcon, gradient: 'from-blue-500 to-indigo-500' },
    { id: 'rental', name: 'Rental', icon: KeyIcon, gradient: 'from-green-500 to-emerald-500' },
    { id: 'new_project', name: 'New Projects', icon: BuildingOfficeIcon, gradient: 'from-purple-500 to-pink-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <span className="text-sm sm:text-lg">📋</span>
          </div>
          <div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900">Property Listings</h3>
            <p className="text-sm sm:text-base text-gray-600">Manage all your property listings</p>
          </div>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Total: {properties.length} properties
        </div>
      </div>

      {/* Property Type Tabs - Mobile Responsive */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`group relative flex-1 min-w-0 py-3 sm:py-4 px-2 sm:px-4 text-center transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {activeTab === tab.id && (
                <div className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} shadow-lg`}></div>
              )}
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">{tab.name}</span>
              </div>
              {activeTab !== tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HomeIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No {tabs.find(t => t.id === activeTab)?.name} Properties</h4>
            <p className="text-gray-600">You haven&apos;t listed any {activeTab} properties yet.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">BHK</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Listed</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {properties.map((property) => (
                    <tr 
                      key={property.id}
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors duration-200"
                      onClick={() => handleRowClick(property)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                            <HomeIcon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 line-clamp-1">{property.title}</div>
                            <div className="text-xs text-gray-500 capitalize">{property.type.replace('_', ' ')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900 line-clamp-1">{property.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{property.bhkType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <CurrencyRupeeIcon className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-600">
                            {formatPrice(property.price, property.type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          property.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : property.status === 'sold' || property.status === 'rented'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatDate(property.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(property);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement edit functionality
                            }}
                            className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Edit Property"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement delete functionality
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete Property"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3 p-4">
              {properties.map((property) => (
                <div 
                  key={property.id}
                  className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleRowClick(property)}
                >
                  {/* Property Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <HomeIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{property.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {property.type.replace('_', ' ')}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            property.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : property.status === 'sold' || property.status === 'rented'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {property.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-600 truncate">{property.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-900">BHK:</span>
                      <span className="text-xs text-gray-600">{property.bhkType}</span>
                    </div>
                  </div>

                  {/* Price and Date */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <CurrencyRupeeIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-600">
                        {formatPrice(property.price, property.type)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">{formatDate(property.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(property);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement edit functionality
                      }}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Edit Property"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement delete functionality
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete Property"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Property Details Modal */}
      {showDetailModal && selectedProperty && (
        <PropertyDetailModal 
          property={selectedProperty}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedProperty(null);
          }}
        />
      )}
    </div>
  );
}

// Property Detail Modal Component
interface PropertyDetailModalProps {
  property: PropertyData;
  onClose: () => void;
}

function PropertyDetailModal({ property, onClose }: PropertyDetailModalProps) {
  const renderPropertyDetails = () => {
    const details = [];
    
    // Common fields for all property types
    details.push(
      { label: 'Property Type', value: property.type.replace('_', ' ').toUpperCase() },
      { label: 'Status', value: property.status },
      { label: 'Listed Date', value: new Date(property.createdAt).toLocaleDateString('en-IN') }
    );

    // Type-specific fields
    if (property.type === 'resale') {
      details.push(
        { label: 'Seller Name', value: property.seller_name },
        { label: 'Seller Email', value: property.seller_email },
        { label: 'Seller Contact', value: property.seller_contact_no },
        { label: 'Society Name', value: property.society_name || 'N/A' },
        { label: 'Square Feet', value: property.square_feet || 'N/A' },
        { label: 'Carpet Area', value: property.carpet_area || 'N/A' },
        { label: 'Floor No', value: property.floor_no || 'N/A' },
        { label: 'Facing', value: property.facing || 'N/A' },
        { label: 'Parking Type', value: property.parking_type || 'N/A' },
        { label: 'Furnishing', value: property.furnishing_type?.replace('_', ' ') || 'N/A' },
        { label: 'Property Age', value: property.property_age || 'N/A' },
        { label: 'Negotiable', value: property.is_negotiable ? 'Yes' : 'No' }
      );
    } else if (property.type === 'rental') {
      details.push(
        { label: 'Owner Name', value: property.owner_name },
        { label: 'Owner Email', value: property.owner_email },
        { label: 'Owner Contact', value: property.owner_contact_no },
        { label: 'Society Name', value: property.society_name || 'N/A' },
        { label: 'Floor No', value: property.floor_no || 'N/A' },
        { label: 'Deposit Amount', value: property.deposit_amount ? `₹${property.deposit_amount.toLocaleString()}` : 'N/A' },
        { label: 'Parking Type', value: property.parking_type || 'N/A' },
        { label: 'Furnishing', value: property.furnishing_type?.replace('_', ' ') || 'N/A' },
        { label: 'Pets Allowed', value: property.pets_allowed ? 'Yes' : 'No' },
        { label: 'Immediate Possession', value: property.immediate_possession ? 'Yes' : 'No' }
      );
    } else if (property.type === 'new_project') {
      details.push(
        { label: 'Project Name', value: property.project_name },
        { label: 'Project Type', value: property.project_type?.replace('_', ' ') || 'N/A' },
        { label: 'Construction Type', value: property.construction_type?.replace('_', ' ') || 'N/A' },
        { label: 'Crafted By', value: property.crafted_by },
        { label: 'Total Floors', value: property.total_floors || 'N/A' },
        { label: 'Towers Count', value: property.towers_count || 'N/A' },
        { label: 'RERA Approved', value: property.is_rera_approved ? 'Yes' : 'No' },
        { label: 'RERA Number', value: property.rera_number || 'N/A' },
        { label: 'Loan Available', value: property.loan_available ? 'Yes' : 'No' }
      );
    }

    return details;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Header - Mobile Responsive */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{property.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 truncate">{property.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-xl transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Mobile Responsive */}
        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-100px)] sm:max-h-[calc(90vh-120px)] custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            {renderPropertyDetails().map((detail, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100">
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">{detail.label}</div>
                <div className="text-sm sm:text-base font-medium text-gray-900 break-words">{detail.value}</div>
              </div>
            ))}
          </div>

          {/* Notes Section - Mobile Responsive */}
          {property.notes && (
            <div className="mt-4 sm:mt-6 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100">
              <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">Notes</div>
              <div className="text-sm sm:text-base text-gray-900 break-words">{property.notes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
