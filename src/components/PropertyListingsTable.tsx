'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  MapPinIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { PropertyImageManager, PropertyImageManagerRef } from './PropertyImageManager';

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
  const [editingProperty, setEditingProperty] = useState<PropertyData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch properties based on active tab
  const fetchProperties = async (propertyType: 'resale' | 'rental' | 'new_project') => {
    if (!user || !supabase) return;
    
    setLoading(true);
    try {
      let query;
      let tableName;
      
      // Check if user is admin - admins can see all properties
      const isAdmin = user.role === 'ADMIN';
      
      switch (propertyType) {
        case 'resale':
          tableName = 'resale_properties';
          query = supabase
            .from('resale_properties')
            .select('*')
            .order('created_at', { ascending: false });
          
          // Only filter by created_by if user is not admin
          if (!isAdmin) {
            query = query.eq('created_by', user.id);
          }
          break;
        case 'rental':
          tableName = 'rental_properties';
          query = supabase
            .from('rental_properties')
            .select('*')
            .order('created_at', { ascending: false });
          
          // Only filter by created_by if user is not admin
          if (!isAdmin) {
            query = query.eq('created_by', user.id);
          }
          break;
        case 'new_project':
          tableName = 'new_projects';
          query = supabase
            .from('new_projects')
            .select('*')
            .order('created_at', { ascending: false });
          
          // Only filter by created_by if user is not admin
          if (!isAdmin) {
            query = query.eq('created_by', user.id);
          }
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

  // Handle edit property
  const handleEditProperty = (property: PropertyData) => {
    // Check if user is admin or owns the property
    const isAdmin = user?.role === 'ADMIN';
    
    if (!isAdmin && property.created_by !== user?.id) {
      alert('You can only edit properties that you created.');
      return;
    }
    
    setEditingProperty(property);
    setShowEditModal(true);
  };

  // Handle delete property
  const handleDeleteProperty = async (propertyId: string) => {
    if (!user || !supabase) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this property? This action cannot be undone.');
    if (!confirmed) return;

    try {
      let tableName;
      switch (activeTab) {
        case 'resale':
          tableName = 'resale_properties';
          break;
        case 'rental':
          tableName = 'rental_properties';
          break;
        case 'new_project':
          tableName = 'new_projects';
          break;
        default:
          throw new Error('Invalid property type');
      }

      // Check if user is admin or owns the property
      const isAdmin = user.role === 'ADMIN';
      const property = properties.find(p => p.id === propertyId);
      
      if (!isAdmin && property && property.created_by !== user.id) {
        alert('You can only delete properties that you created.');
        return;
      }

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', propertyId);

      if (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property. Please try again.');
        return;
      }

      // Remove property from local state
      setProperties((prev: PropertyData[]) => prev.filter(p => p.id !== propertyId));
      alert('Property deleted successfully!');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    }
  };

  // Handle save edit
  const handleSaveEdit = async (updatedProperty: any) => {
    if (!user || !supabase) return;

    try {
      let tableName;
      let updateData: any = {};
      
      switch (activeTab) {
        case 'resale':
          tableName = 'resale_properties';
          updateData = {
            // Basic information
            seller_name: updatedProperty.seller_name,
            seller_email: updatedProperty.seller_email,
            seller_contact_no: updatedProperty.seller_contact_no,
            seller_alternate_no: updatedProperty.seller_alternate_no,
            
            // Property details
            property_type: updatedProperty.property_type,
            society_name: updatedProperty.society_name,
            bhk_type: updatedProperty.bhk_type,
            square_feet: updatedProperty.square_feet,
            carpet_area: updatedProperty.carpet_area,
            location: updatedProperty.location,
            floor_no: updatedProperty.floor_no,
            facing: updatedProperty.facing,
            parking_type: updatedProperty.parking_type,
            furnishing_type: updatedProperty.furnishing_type,
            asking_price: updatedProperty.asking_price,
            is_negotiable: updatedProperty.is_negotiable,
            property_age: updatedProperty.property_age,
            has_amenities: updatedProperty.has_amenities,
            status: updatedProperty.status,
            notes: updatedProperty.notes,
            
            // Extended fields
            ownership_type: updatedProperty.ownership_type,
            loan_on_property: updatedProperty.loan_on_property,
            loan_amount: updatedProperty.loan_amount,
            bank_name: updatedProperty.bank_name,
            reason_for_sale: updatedProperty.reason_for_sale,
            flats_per_floor: updatedProperty.flats_per_floor,
            society_area_size: updatedProperty.society_area_size,
            rera_id: updatedProperty.rera_id,
            parking_vehicles: updatedProperty.parking_vehicles,
            visit_days_weekend: updatedProperty.visit_days_weekend,
            visit_timing_weekend: updatedProperty.visit_timing_weekend,
            visit_days_weekdays: updatedProperty.visit_days_weekdays,
            visit_timing_weekdays: updatedProperty.visit_timing_weekdays,
            listed_by: updatedProperty.listed_by,
            address_line: updatedProperty.address_line,
            city: updatedProperty.city,
            state: updatedProperty.state,
            country: updatedProperty.country,
            postal_code: updatedProperty.postal_code,
            latitude: updatedProperty.latitude,
            longitude: updatedProperty.longitude,
            total_floors: updatedProperty.total_floors,
            possession_status: updatedProperty.possession_status,
            possession_date: updatedProperty.possession_date,
            available_from: updatedProperty.available_from,
            maintenance_charge: updatedProperty.maintenance_charge,
            maintenance_frequency: updatedProperty.maintenance_frequency,
            
            // Images and amenities as JSONB - Map from PropertyImageManager format
            property_images: updatedProperty.property_images,
            general_photos: updatedProperty.property_images?.general_photos || {},
            floor_plans: updatedProperty.property_images?.floor_plans || {},
            legal_docs: updatedProperty.property_images?.legal_docs || [],
            virtual_content: updatedProperty.property_images?.virtual_content || [],
            amenities: {
              club_house: updatedProperty.club_house || false,
              swimming_pool: updatedProperty.swimming_pool || false,
              children_play_area: updatedProperty.children_play_area || false,
              power_backup: updatedProperty.power_backup || false,
              house_keeping: updatedProperty.house_keeping || false,
              lift: updatedProperty.lift || false,
              gym: updatedProperty.gym || false,
              park: updatedProperty.park || false,
              security: updatedProperty.security || false,
              gas_pipeline: updatedProperty.gas_pipeline || false,
              rain_water_harvesting: updatedProperty.rain_water_harvesting || false,
              sewage_treatment_plant: updatedProperty.sewage_treatment_plant || false,
              visitor_parking: updatedProperty.visitor_parking || false,
              fire_safety: updatedProperty.fire_safety || false
            },
            
            updated_at: new Date().toISOString()
          };
          break;
        case 'rental':
          tableName = 'rental_properties';
          updateData = {
            // Basic information
            owner_name: updatedProperty.owner_name,
            owner_email: updatedProperty.owner_email,
            owner_contact_no: updatedProperty.owner_contact_no,
            owner_alternate_no: updatedProperty.owner_alternate_no,
            
            // Property details
            property_type: updatedProperty.property_type,
            society_name: updatedProperty.society_name,
            bhk_type: updatedProperty.bhk_type,
            location: updatedProperty.location,
            floor_no: updatedProperty.floor_no,
            rent_amount: updatedProperty.rent_amount,
            rent_negotiable: updatedProperty.rent_negotiable,
            deposit_amount: updatedProperty.deposit_amount,
            deposit_negotiable: updatedProperty.deposit_negotiable,
            pets_allowed: updatedProperty.pets_allowed,
            parking_type: updatedProperty.parking_type,
            furnishing_type: updatedProperty.furnishing_type,
            immediate_possession: updatedProperty.immediate_possession,
            available_from_date: updatedProperty.available_from_date,
            visit_details: updatedProperty.visit_details,
            has_amenities: updatedProperty.has_amenities,
            status: updatedProperty.status,
            notes: updatedProperty.notes,
            
            // Extended fields
            tenant_type: updatedProperty.tenant_type,
            parking_vehicles: updatedProperty.parking_vehicles,
            visit_days_weekend: updatedProperty.visit_days_weekend,
            visit_timing_weekend: updatedProperty.visit_timing_weekend,
            visit_days_weekdays: updatedProperty.visit_days_weekdays,
            visit_timing_weekdays: updatedProperty.visit_timing_weekdays,
            listed_by: updatedProperty.listed_by,
            
            // Images and amenities as JSONB - Map from PropertyImageManager format
            property_images: updatedProperty.property_images,
            general_photos: updatedProperty.property_images?.general_photos || {},
            floor_plans: updatedProperty.property_images?.floor_plans || {},
            legal_docs: updatedProperty.property_images?.legal_docs || [],
            virtual_content: updatedProperty.property_images?.virtual_content || [],
            amenities: {
              club_house: updatedProperty.club_house || false,
              swimming_pool: updatedProperty.swimming_pool || false,
              children_play_area: updatedProperty.children_play_area || false,
              power_backup: updatedProperty.power_backup || false,
              house_keeping: updatedProperty.house_keeping || false,
              lift: updatedProperty.lift || false,
              gym: updatedProperty.gym || false,
              park: updatedProperty.park || false,
              security: updatedProperty.security || false,
              gas_pipeline: updatedProperty.gas_pipeline || false,
              rain_water_harvesting: updatedProperty.rain_water_harvesting || false,
              sewage_treatment_plant: updatedProperty.sewage_treatment_plant || false,
              visitor_parking: updatedProperty.visitor_parking || false,
              fire_safety: updatedProperty.fire_safety || false
            },
            
            updated_at: new Date().toISOString()
          };
          break;
        case 'new_project':
          tableName = 'new_projects';
          updateData = {
            // Basic information
            crafted_by: updatedProperty.crafted_by,
            project_name: updatedProperty.project_name,
            project_type: updatedProperty.project_type,
            construction_type: updatedProperty.construction_type,
            project_location: updatedProperty.project_location,
            contact_name_1: updatedProperty.contact_name_1,
            contact_number_1: updatedProperty.contact_number_1,
            contact_name_2: updatedProperty.contact_name_2,
            contact_number_2: updatedProperty.contact_number_2,
            
            // Project details
            rooms_per_floor: updatedProperty.rooms_per_floor,
            cp_sables: updatedProperty.cp_sables,
            other_notes: updatedProperty.other_notes,
            is_govt_approved: updatedProperty.is_govt_approved,
            is_rera_approved: updatedProperty.is_rera_approved,
            loan_available: updatedProperty.loan_available,
            social_media_marketing_allowed: updatedProperty.social_media_marketing_allowed,
            important_notes: updatedProperty.important_notes,
            units_available_for_sale: updatedProperty.units_available_for_sale,
            rera_number: updatedProperty.rera_number,
            project_conversion_rate: updatedProperty.project_conversion_rate,
            status: updatedProperty.status,
            
            // Extended fields
            total_project_area_size: updatedProperty.total_project_area_size,
            towers_count: updatedProperty.towers_count,
            total_floors: updatedProperty.total_floors,
            suggestion_date: updatedProperty.suggestion_date,
            suggestion_year: updatedProperty.suggestion_year,
            flats_per_floor: updatedProperty.flats_per_floor,
            roi: updatedProperty.roi,
            rental_yield: updatedProperty.rental_yield,
            marketed_by: updatedProperty.marketed_by,
            listed_by: updatedProperty.listed_by,
            facing_vastu: updatedProperty.facing_vastu,
            latitude: updatedProperty.latitude,
            longitude: updatedProperty.longitude,
            launch_date: updatedProperty.launch_date,
            possession_date: updatedProperty.possession_date,
            min_price: updatedProperty.min_price,
            website_url: updatedProperty.website_url,
            brochure_url: updatedProperty.brochure_url,
            
            // Images and amenities as JSONB - Map from PropertyImageManager format
            property_images: updatedProperty.property_images,
            general_photos: updatedProperty.property_images?.general_photos || {},
            floor_plans: updatedProperty.property_images?.floor_plans || {},
            project_images: updatedProperty.property_images?.project_images || [],
            legal_docs: updatedProperty.property_images?.legal_docs || [],
            virtual_content: updatedProperty.property_images?.virtual_content || [],
            amenities: {
              club_house: updatedProperty.club_house || false,
              swimming_pool: updatedProperty.swimming_pool || false,
              children_play_area: updatedProperty.children_play_area || false,
              power_backup: updatedProperty.power_backup || false,
              house_keeping: updatedProperty.house_keeping || false,
              lift: updatedProperty.lift || false,
              gym: updatedProperty.gym || false,
              park: updatedProperty.park || false,
              security: updatedProperty.security || false,
              gas_pipeline: updatedProperty.gas_pipeline || false,
              rain_water_harvesting: updatedProperty.rain_water_harvesting || false,
              sewage_treatment_plant: updatedProperty.sewage_treatment_plant || false,
              visitor_parking: updatedProperty.visitor_parking || false,
              fire_safety: updatedProperty.fire_safety || false
            },
            
            updated_at: new Date().toISOString()
          };
          break;
        default:
          throw new Error('Invalid property type');
      }

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', updatedProperty.id);

      if (error) {
        console.error('Error updating property:', error);
        alert('Failed to update property. Please try again.');
        return;
      }

      // Update property in local state
      setProperties((prev: PropertyData[]) => prev.map(p => 
        p.id === updatedProperty.id ? updatedProperty : p
      ));
      
      setShowEditModal(false);
      setEditingProperty(null);
      alert('Property updated successfully!');
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property. Please try again.');
    }
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created By</th>
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
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-purple-600">
                              {property.seller_name ? property.seller_name.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {property.seller_name || property.owner_name || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {property.created_by === user?.id ? 'You' : 'Other'}
                            </div>
                          </div>
                        </div>
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
                              handleEditProperty(property);
                            }}
                            className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Edit Property"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProperty(property.id);
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
                        handleEditProperty(property);
                      }}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Edit Property"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProperty(property.id);
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

      {/* Property Edit Modal */}
      {showEditModal && editingProperty && (
        <PropertyEditModal 
          property={editingProperty}
          onClose={() => {
            setShowEditModal(false);
            setEditingProperty(null);
          }}
          onSave={handleSaveEdit}
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

// Property Edit Modal Component
interface PropertyEditModalProps {
  property: PropertyData;
  onClose: () => void;
  onSave: (property: PropertyData) => void;
}

function PropertyEditModal({ property, onClose, onSave }: PropertyEditModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>(() => {
    // Map database fields to PropertyImageManager format
    const initialData = { ...property };
    
    // Initialize property_images with the correct structure
    initialData.property_images = {
      general_photos: property.general_photos || {},
      floor_plans: property.floor_plans || {},
      legal_docs: property.legal_docs || [],
      virtual_content: property.virtual_content || [],
      project_images: property.project_images || []
    };
    
    return initialData;
  });
  const imageManagerRef = useRef<PropertyImageManagerRef>(null);

  const totalSteps = 5;
  const steps = [
    { id: 1, name: 'Basic Information' },
    { id: 2, name: 'Property Details' },
    { id: 3, name: 'Images & Documents' },
    { id: 4, name: 'Amenities' },
    { id: 5, name: 'Review & Update' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get images from PropertyImageManager
      const images = imageManagerRef.current?.getImages() || {};
      
      // Update formData with images
      const updatedFormData = {
        ...formData,
        property_images: images
      };

      await onSave(updatedFormData);
    } catch (error) {
      console.error('Error updating property:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {property.type === 'new_project' ? 'Project Name' : 'Property Title'}
                </label>
                <input
                  type="text"
                  value={property.type === 'new_project' ? formData.project_name : formData.title}
                  onChange={(e) => handleInputChange(property.type === 'new_project' ? 'project_name' : 'title', e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {property.type === 'new_project' ? 'Project Location' : 'Location'}
                </label>
                <input
                  type="text"
                  value={property.type === 'new_project' ? formData.project_location : formData.location}
                  onChange={(e) => handleInputChange(property.type === 'new_project' ? 'project_location' : 'location', e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {property.type === 'new_project' ? 'Crafted By' : 'Owner/Seller Name'}
                </label>
                <input
                  type="text"
                  value={property.type === 'new_project' ? formData.crafted_by : (formData.seller_name || formData.owner_name)}
                  onChange={(e) => handleInputChange(property.type === 'new_project' ? 'crafted_by' : (property.type === 'rental' ? 'owner_name' : 'seller_name'), e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.seller_email || formData.owner_email}
                  onChange={(e) => handleInputChange(property.type === 'rental' ? 'owner_email' : 'seller_email', e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={formData.seller_contact_no || formData.owner_contact_no}
                  onChange={(e) => handleInputChange(property.type === 'rental' ? 'owner_contact_no' : 'seller_contact_no', e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {property.type !== 'new_project' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    BHK Type
                  </label>
                  <select
                    value={formData.bhk_type}
                    onChange={(e) => handleInputChange('bhk_type', e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select BHK Type</option>
                    <option value="1_rk_1_bhk">1 RK/1 BHK</option>
                    <option value="2_bhk">2 BHK</option>
                    <option value="3_bhk">3 BHK</option>
                    <option value="4_bhk">4 BHK</option>
                    <option value="5_bhk">5 BHK</option>
                    <option value="5_plus_bhk">5+ BHK</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Property Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {property.type === 'new_project' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Type
                    </label>
                    <select
                      value={formData.project_type}
                      onChange={(e) => handleInputChange('project_type', e.target.value)}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Project Type</option>
                      <option value="residence">Residence</option>
                      <option value="gated_community_villa_or_bungalow">Gated Community/Villa/Bungalow</option>
                      <option value="commercial">Commercial</option>
                      <option value="land_or_plot">Land/Plot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Construction Type
                    </label>
                    <select
                      value={formData.construction_type}
                      onChange={(e) => handleInputChange('construction_type', e.target.value)}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Construction Type</option>
                      <option value="new_launching">New Launching</option>
                      <option value="under_construction">Under Construction</option>
                      <option value="ready_to_move">Ready to Move</option>
                      <option value="partial_ready_to_move">Partial Ready to Move</option>
                    </select>
                  </div>
                </>
              )}

              {property.type !== 'new_project' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type
                    </label>
                    <select
                      value={formData.property_type}
                      onChange={(e) => handleInputChange('property_type', e.target.value)}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Property Type</option>
                      <option value="apartment">Apartment</option>
                      <option value="gated_community_villa_or_bungalow">Gated Community/Villa/Bungalow</option>
                      <option value="independent_house">Independent House</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Society Name
                    </label>
                    <input
                      type="text"
                      value={formData.society_name}
                      onChange={(e) => handleInputChange('society_name', e.target.value)}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {property.type === 'rental' ? 'Rent Amount' : property.type === 'new_project' ? 'Min Price' : 'Asking Price'}
                </label>
                <input
                  type="number"
                  value={property.type === 'rental' ? formData.rent_amount : property.type === 'new_project' ? formData.min_price : formData.asking_price}
                  onChange={(e) => handleInputChange(property.type === 'rental' ? 'rent_amount' : property.type === 'new_project' ? 'min_price' : 'asking_price', e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Furnishing Type
                </label>
                <select
                  value={formData.furnishing_type}
                  onChange={(e) => handleInputChange('furnishing_type', e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Furnishing Type</option>
                  <option value="fully_furnished">Fully Furnished</option>
                  <option value="semi_furnished">Semi Furnished</option>
                  <option value="un_furnished">Unfurnished</option>
                </select>
              </div>

              {property.type === 'resale' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age of Property
                    </label>
                    <select
                      value={formData.property_age}
                      onChange={(e) => handleInputChange('property_age', e.target.value)}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Property Age</option>
                      <option value="under_construction">Under Construction</option>
                      <option value="new_construction">New Construction (0-1 years)</option>
                      <option value="1_to_3_years">1-3 years</option>
                      <option value="3_to_5_years">3-5 years</option>
                      <option value="5_to_10_years">5-10 years</option>
                      <option value="10_to_15_years">10-15 years</option>
                      <option value="above_15_years">Above 15 years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parking Type
                    </label>
                    <select
                      value={formData.parking_type}
                      onChange={(e) => handleInputChange('parking_type', e.target.value)}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Parking Type</option>
                      <option value="covered_parking">Covered</option>
                      <option value="open_parking">Open</option>
                      <option value="shed_parking">Shed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price Negotiable
                    </label>
                    <select
                      value={formData.is_negotiable ? 'true' : 'false'}
                      onChange={(e) => handleInputChange('is_negotiable', e.target.value === 'true')}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </>
              )}

              {property.type === 'rental' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deposit Amount
                    </label>
                    <input
                      type="number"
                      value={formData.deposit_amount}
                      onChange={(e) => handleInputChange('deposit_amount', e.target.value)}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rent Negotiable
                    </label>
                    <select
                      value={formData.rent_negotiable ? 'true' : 'false'}
                      onChange={(e) => handleInputChange('rent_negotiable', e.target.value === 'true')}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tenant Type
                    </label>
                    <select
                      value={formData.tenant_type}
                      onChange={(e) => handleInputChange('tenant_type', e.target.value)}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Tenant Type</option>
                      <option value="family">Family</option>
                      <option value="bachelor">Bachelor</option>
                      <option value="anyone">Anyone</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Images & Documents</h3>
            <PropertyImageManager
              ref={imageManagerRef}
              isSubmitting={isSubmitting}
              initialImages={formData.property_images || {}}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Amenities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[
                'club_house', 'swimming_pool', 'children_play_area', 'power_backup',
                'house_keeping', 'lift', 'gym', 'park', 'security', 'gas_pipeline',
                'rain_water_harvesting', 'sewage_treatment_plant', 'visitor_parking', 'fire_safety'
              ].map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData[amenity] || false}
                    onChange={(e) => handleInputChange(amenity, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {amenity.replace(/_/g, ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Update</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Property Summary</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Title:</strong> {property.type === 'new_project' ? formData.project_name : formData.title}</p>
                <p><strong>Location:</strong> {property.type === 'new_project' ? formData.project_location : formData.location}</p>
                <p><strong>Type:</strong> {property.type.replace('_', ' ')}</p>
                <p><strong>Status:</strong> {formData.status}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-3 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Property</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between overflow-x-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                      currentStep >= step.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.id}
                  </div>
                  <span className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden sm:block ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-6 sm:w-12 h-0.5 mx-2 sm:mx-4 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4 sm:pt-6">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center justify-center px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-4 h-4 mr-1" />
                Previous
              </button>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center justify-center px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Next
                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Property'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
