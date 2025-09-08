'use client';

import React, { useState } from 'react';
import { PropertyImages } from '@/types/Property';
import { PropertyImageGallery } from './PropertyImageGallery';
import { FloorPlanViewer } from './FloorPlanViewer';
import { PropertyDetails } from './PropertyDetails';
import { PropertyAmenities } from './PropertyAmenities';
import { PropertySpecifications } from './PropertySpecifications';
import { VirtualTourSection } from './VirtualTourSection';
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
  const [activeTab, setActiveTab] = useState<'gallery' | 'floorplans' | 'details' | 'amenities' | 'virtual'>('gallery');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  const tabs = [
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
    { id: 'floorplans', label: 'Floor Plans', icon: '📐' },
    { id: 'details', label: 'Details', icon: '📋' },
    { id: 'amenities', label: 'Amenities', icon: '🏊' },
    { id: 'virtual', label: 'Virtual Tour', icon: '🎥' }
  ];

  return (
    <div className={`max-w-7xl mx-auto p-6 ${className}`}>
      {/* Property Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {propertyDetails.title}
            </h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {propertyDetails.location}
              </span>
              <span className="text-2xl font-bold text-green-600">
                ₹{propertyDetails.price.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {propertyDetails.bhkType}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {propertyDetails.carpetArea} sq ft
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {propertyDetails.propertyType}
              </span>
              <div className="ml-2">
                <ShareButtonDropdown 
                  property={propertyDetails}
                  variant="icon"
                  size="sm"
                  onShowSuccess={showSuccess}
                  onShowError={showError}
                  onShowInfo={showInfo}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'gallery' && (
          <PropertyImageGallery images={propertyImages} />
        )}
        
        {activeTab === 'floorplans' && (
          <FloorPlanViewer images={propertyImages} />
        )}
        
        {activeTab === 'details' && (
          <PropertyDetails 
            details={propertyDetails}
            specifications={specifications}
          />
        )}
        
        {activeTab === 'amenities' && (
          <PropertyAmenities amenities={amenities} />
        )}
        
        {activeTab === 'virtual' && (
          <VirtualTourSection images={propertyImages} />
        )}
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
