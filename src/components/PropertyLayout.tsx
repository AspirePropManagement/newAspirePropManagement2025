'use client';

import React, { useState } from 'react';
import { PropertyImages } from '@/types/Property';
import { PropertyImageGallery } from './PropertyImageGallery';
import { FloorPlanViewer } from './FloorPlanViewer';
import { PropertyDetails } from './PropertyDetails';
import { PropertyAmenities } from './PropertyAmenities';
import { ShareButton } from './ShareButton';
import { ShareButtonDropdown } from './ShareButtonDropdown';
import { ShareModal } from './ShareModal';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from './ToastContainer';

interface PropertyLayoutProps {
  propertyImages: PropertyImages;
  propertyDetails: {
    title: string;
    price: number;
    location: string;
    bhkType: string;
    carpetArea: number;
    squareFeet: number;
    propertyType: string;
    status: string;
    description: string;
    id?: string;
    type?: string;
  };
  amenities: string[];
  specifications: Record<string, any>;
  className?: string;
}

/**
 * Main property layout component that displays comprehensive property information
 * including images, floor plans, details, and amenities in a structured layout
 */
export function PropertyLayout({
  propertyImages,
  propertyDetails,
  amenities,
  specifications,
  className = ''
}: PropertyLayoutProps) {
  const [activeTab, setActiveTab] = useState<'gallery' | 'floorplans' | 'details' | 'amenities'>('gallery');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  const tabs = [
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
    { id: 'floorplans', label: 'Floor Plans', icon: '📐' },
    { id: 'details', label: 'Details', icon: '📋' },
    { id: 'amenities', label: 'Amenities', icon: '🏊' }
  ];

  return (
    <div className={`max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12 ${className}`}>
      {/* Modern Section Header */}
      <div className="mb-8 sm:mb-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Property Details
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore comprehensive information about this property including detailed specifications, amenities, and more.
          </p>
        </div>

        {/* Modern Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 mb-8">
          <nav className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 flex items-center px-4 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2 text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {activeTab === 'gallery' && (
            <div className="p-6 sm:p-8">
              <PropertyImageGallery images={propertyImages} />
            </div>
          )}
          
          {activeTab === 'floorplans' && (
            <div className="p-6 sm:p-8">
              <FloorPlanViewer images={propertyImages} />
            </div>
          )}
          
          {activeTab === 'details' && (
            <div className="p-6 sm:p-8">
              <PropertyDetails 
                details={propertyDetails}
                specifications={specifications}
              />
            </div>
          )}
          
          {activeTab === 'amenities' && (
            <div className="p-6 sm:p-8">
              <PropertyAmenities amenities={amenities} />
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        property={propertyDetails}
      />

      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
      />
    </div>
  );
}
