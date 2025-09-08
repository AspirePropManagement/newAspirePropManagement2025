'use client';

import React, { useState, useRef } from 'react';
import { PropertyImageManager, PropertyImageManagerRef } from './PropertyImageManager';
import PropertyAmenitiesManager from './PropertyAmenitiesManager';
import { PropertyFormSkeleton } from './skeletons';
import { PhotoIcon, DocumentIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';
import { PropertyAmenities } from '@/types/PropertyAmenities';

// Price Range Slider Component using shadcn/ui
const PriceRangeSlider = ({ 
  value, 
  onChange, 
  min = 1000, 
  max = 10000000, 
  step = 1000,
  label,
  placeholder 
}: {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  placeholder: string;
}) => {
  const [sliderValue, setSliderValue] = useState(parseInt(value) || min);

  const handleSliderChange = (newValue: number[]) => {
    const value = newValue[0];
    setSliderValue(value);
    onChange(value.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (newValue && !isNaN(parseInt(newValue))) {
      setSliderValue(parseInt(newValue));
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(0)}K`;
    }
    return `₹${price}`;
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label} *
      </label>
      
      <div className="space-y-4">
        {/* shadcn/ui Slider */}
        <Slider
          defaultValue={[sliderValue]}
          max={max}
          min={min}
          step={step}
          value={[sliderValue]}
          onValueChange={handleSliderChange}
          className="w-full"
        />
        
        {/* Range labels */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatPrice(min)}</span>
          <span>{formatPrice(max)}</span>
        </div>
        
        {/* Input field */}
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          required
        />
        
        {/* Current value display */}
        <div className="text-sm text-gray-600">
          Current: <span className="font-medium">{formatPrice(sliderValue)}</span>
        </div>
      </div>
    </div>
  );
};

interface PropertyFormProps {
  propertyType: 'resale' | 'rental' | 'new_project';
  currentStep: number;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function PropertyForm({ 
  propertyType, 
  currentStep, 
  onSubmit, 
  onCancel, 
  isLoading 
}: PropertyFormProps) {
  const [formData, setFormData] = useState({
    // Basic Information (Step 1)
    sellerName: '',
    sellerEmail: '',
    contactNumber: '',
    alternateNumber: '',
    bhkType: '',
    propertyType: propertyType, // Initialize with the prop value
    location: '',
    
    // Property Details (Step 2)
    societyName: '',
    flatNo: '',
    wingNo: '',
    floorNo: '',
    facing: '',
    parkingType: '',
    furnishingType: '',
    squareFeet: '',
    carpetArea: '',
    askingPrice: '',
    rentAmount: '',
    depositAmount: '',
    isNegotiable: false,
    propertyAge: '',
    hasAmenities: false,
    allowedForFamily: false,
    allowedForBachelor: false,
    allowedForAnyone: false,
    petsAllowed: false,
    immediatePossession: false,
    availableFromDate: '',
    visitDetails: '',
    notes: '',
    
    // Images & Documents (Step 3)
    propertyImages: {},
    
    // Amenities (Step 4)
    amenities: {} as PropertyAmenities,
    
    // Review & Submit (Step 5)
    status: 'available'
  });

  const imageManagerRef = useRef<PropertyImageManagerRef>(null);
  const [savedImages, setSavedImages] = useState({});

  // Save images whenever they change in the image manager
  const handleImagesChange = (images: any) => {
    setSavedImages(images);
    setFormData(prev => ({
      ...prev,
      propertyImages: images
    }));
  };

  // Restore images when returning to step 3
  const restoreImages = () => {
    if (imageManagerRef.current && Object.keys(savedImages).length > 0) {
      imageManagerRef.current.setImages(savedImages);
    }
  };

  // Update propertyType when prop changes
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      propertyType: propertyType
    }));
  }, [propertyType]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission triggered!');
    console.log('Current step:', currentStep);
    console.log('Form data:', formData);
    
    // Validate form data before submission
    const validationErrors = validateFormData();
    if (validationErrors.length > 0) {
      console.log('Validation errors:', validationErrors);
      alert(`Please fix the following errors:\n${validationErrors.join('\n')}`);
      return;
    }
    
    console.log('Form validation passed, preparing to submit...');
    
    // Get images from the image manager before submitting
    if (imageManagerRef.current) {
      const images = imageManagerRef.current.getImages();
      console.log('Images from manager:', images);
      const finalFormData = {
        ...formData,
        propertyImages: images
      };
      console.log('Final form data to submit:', finalFormData);
      onSubmit(finalFormData);
    } else {
      console.log('No image manager, submitting without images');
      onSubmit(formData);
    }
  };

  // Validate form data before submission
  const validateFormData = () => {
    const errors: string[] = [];
    
    // Basic validation for required fields
    if (!formData.sellerName) errors.push('Seller/Owner name is required');
    if (!formData.sellerEmail) errors.push('Email is required');
    if (!formData.contactNumber) errors.push('Contact number is required');
    if (!formData.bhkType) errors.push('BHK type is required');
    if (!formData.propertyType) errors.push('Property type is required');
    if (!formData.location) errors.push('Location is required');
    if (!formData.furnishingType) errors.push('Furnishing type is required');
    
    // Contact number validation - must be exactly 10 digits
    if (formData.contactNumber && !/^[0-9]{10}$/.test(formData.contactNumber)) {
      errors.push('Contact number must be exactly 10 digits (numbers only)');
    }
    
    // Alternate number validation - if provided, must be exactly 10 digits
    if (formData.alternateNumber && !/^[0-9]{10}$/.test(formData.alternateNumber)) {
      errors.push('Alternate number must be exactly 10 digits (numbers only)');
    }
    
    // Property type specific validation
    if (propertyType === 'resale' && !formData.askingPrice) {
      errors.push('Asking price is required for resale properties');
    }
    
    if (propertyType === 'rental' && !formData.rentAmount) {
      errors.push('Rent amount is required for rental properties');
    }
    
    return errors;
  };

  // Render different form sections based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInformation();
      case 2:
        return renderPropertyDetails();
      case 3:
        return renderImageUpload();
      case 4:
        return renderAmenities();
      case 5:
        return renderReviewSubmit();
      default:
        return renderBasicInformation();
    }
  };

  const renderBasicInformation = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {propertyType === 'rental' ? 'Owner Name' : 'Seller Name'} *
        </label>
        <input
          type="text"
          value={formData.sellerName}
          onChange={(e) => handleInputChange('sellerName', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={`Enter ${propertyType === 'rental' ? 'owner' : 'seller'} name`}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {propertyType === 'rental' ? 'Owner Email' : 'Seller Email'} *
        </label>
        <input
          type="email"
          value={formData.sellerEmail}
          onChange={(e) => handleInputChange('sellerEmail', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter email address"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact Number *
        </label>
        <input
          type="tel"
          value={formData.contactNumber}
          onChange={(e) => {
            // Only allow numbers and limit to 10 digits
            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
            handleInputChange('contactNumber', value);
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter 10-digit contact number"
          maxLength={10}
          pattern="[0-9]{10}"
          required
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {formData.contactNumber ? `${formData.contactNumber.length}/10` : '0/10'}
          </span>
          {formData.contactNumber && formData.contactNumber.length !== 10 && (
            <p className="text-sm text-red-600">
              Must be exactly 10 digits
            </p>
          )}
          {formData.contactNumber && formData.contactNumber.length === 10 && (
            <p className="text-sm text-green-600">
              ✓ Valid
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alternate Number
        </label>
        <input
          type="tel"
          value={formData.alternateNumber}
          onChange={(e) => {
            // Only allow numbers and limit to 10 digits
            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
            handleInputChange('alternateNumber', value);
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter 10-digit alternate number (optional)"
          maxLength={10}
          pattern="[0-9]{10}"
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {formData.alternateNumber ? `${formData.alternateNumber.length}/10` : '0/10'}
          </span>
          {formData.alternateNumber && formData.alternateNumber.length !== 10 && (
            <p className="text-sm text-red-600">
              Must be exactly 10 digits
            </p>
          )}
          {formData.alternateNumber && formData.alternateNumber.length === 10 && (
            <p className="text-sm text-green-600">
              ✓ Valid
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          BHK Type *
        </label>
        <select
          value={formData.bhkType}
          onChange={(e) => handleInputChange('bhkType', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select BHK Type</option>
          <option value="1_rk_1_bhk">1 RK / 1 BHK</option>
          <option value="2_bhk">2 BHK</option>
          <option value="3_bhk">3 BHK</option>
          <option value="4_bhk">4 BHK</option>
          <option value="5_bhk">5 BHK</option>
          <option value="5_plus_bhk">5+ BHK</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Type *
        </label>
        <select
          value={formData.propertyType}
          onChange={(e) => handleInputChange('propertyType', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select Property Type</option>
          <option value="apartment">Apartment</option>
          <option value="gated_community_villa_or_bungalow">Gated Community Villa/Bungalow</option>
          <option value="independent_house">Independent House</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location *
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter property location"
          required
        />
      </div>

      {propertyType === 'rental' && (
        <div>
          <PriceRangeSlider
            value={formData.rentAmount}
            onChange={(value) => handleInputChange('rentAmount', value)}
            min={1000}
            max={500000}
            step={1000}
            label="Rent Amount"
            placeholder="Enter monthly rent amount"
          />
        </div>
      )}

      {propertyType === 'resale' && (
        <div>
          <PriceRangeSlider
            value={formData.askingPrice}
            onChange={(value) => handleInputChange('askingPrice', value)}
            min={1000}
            max={10000000}
            step={1000}
            label="Asking Price"
            placeholder="Enter asking price"
          />
        </div>
      )}
    </div>
  );

  const renderPropertyDetails = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Society Name
        </label>
        <input
          type="text"
          value={formData.societyName}
          onChange={(e) => handleInputChange('societyName', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter society name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Flat/Unit Number
        </label>
        <input
          type="text"
          value={formData.flatNo}
          onChange={(e) => handleInputChange('flatNo', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter flat/unit number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Wing
        </label>
        <input
          type="text"
          value={formData.wingNo}
          onChange={(e) => handleInputChange('wingNo', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter wing number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Floor Number
        </label>
        <input
          type="text"
          value={formData.floorNo}
          onChange={(e) => handleInputChange('floorNo', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter floor number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Facing
        </label>
        <select
          value={formData.facing}
          onChange={(e) => handleInputChange('facing', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Facing</option>
          <option value="north">North</option>
          <option value="south">South</option>
          <option value="east">East</option>
          <option value="west">West</option>
          <option value="northeast">North East</option>
          <option value="northwest">North West</option>
          <option value="southeast">South East</option>
          <option value="southwest">South West</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Parking Type
        </label>
        <select
          value={formData.parkingType}
          onChange={(e) => handleInputChange('parkingType', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Parking Type</option>
          <option value="covered_parking">Covered Parking</option>
          <option value="open_parking">Open Parking</option>
          <option value="shed_parking">Shed Parking</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Furnishing Type *
        </label>
        <select
          value={formData.furnishingType}
          onChange={(e) => handleInputChange('furnishingType', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select Furnishing Type</option>
          <option value="fully_furnished">Fully Furnished</option>
          <option value="semi_furnished">Semi Furnished</option>
          <option value="un_furnished">Unfurnished</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Square Feet
        </label>
        <input
          type="number"
          value={formData.squareFeet}
          onChange={(e) => handleInputChange('squareFeet', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter square feet"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Carpet Area
        </label>
        <input
          type="number"
          value={formData.carpetArea}
          onChange={(e) => handleInputChange('carpetArea', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter carpet area"
        />
      </div>

      {propertyType === 'rental' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deposit Amount
            </label>
            <input
              type="number"
              value={formData.depositAmount}
              onChange={(e) => handleInputChange('depositAmount', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter deposit amount"
            />
          </div>

          <div className="col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.allowedForFamily}
                  onChange={(e) => handleInputChange('allowedForFamily', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Allowed for Family</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.allowedForBachelor}
                  onChange={(e) => handleInputChange('allowedForBachelor', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Allowed for Bachelor</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.petsAllowed}
                  onChange={(e) => handleInputChange('petsAllowed', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Pets Allowed</span>
              </label>
            </div>
          </div>
        </>
      )}

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Additional details about the property..."
        />
      </div>
    </div>
  );

  const renderImageUpload = () => (
    <div>
      <PropertyImageManager
        ref={imageManagerRef}
        isSubmitting={isLoading}
        onImagesChange={handleImagesChange}
        initialImages={savedImages}
      />
    </div>
  );

  const renderAmenities = () => (
    <div className="space-y-6">
      <PropertyAmenitiesManager
        initialAmenities={formData.amenities}
        onAmenitiesChange={(amenities) => handleInputChange('amenities', amenities)}
      />
    </div>
  );

  const renderReviewSubmit = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Property Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Basic Information</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {formData.sellerName || 'Not provided'}</p>
              <p><span className="font-medium">Email:</span> {formData.sellerEmail || 'Not provided'}</p>
              <p><span className="font-medium">Contact:</span> {formData.contactNumber || 'Not provided'}</p>
              <p><span className="font-medium">BHK:</span> {formData.bhkType || 'Not provided'}</p>
              <p><span className="font-medium">Property Type:</span> {formData.propertyType || 'Not provided'}</p>
              <p><span className="font-medium">Location:</span> {formData.location || 'Not provided'}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Property Details</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Society:</span> {formData.societyName || 'Not provided'}</p>
              <p><span className="font-medium">Furnishing:</span> {formData.furnishingType || 'Not provided'}</p>
              <p><span className="font-medium">Square Feet:</span> {formData.squareFeet || 'Not provided'}</p>
              {propertyType === 'rental' && (
                <p><span className="font-medium">Rent:</span> ₹{formData.rentAmount || 'Not provided'}</p>
              )}
              {propertyType === 'resale' && (
                <p><span className="font-medium">Price:</span> ₹{formData.askingPrice || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Amenities Review Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Selected Amenities</h3>
        
        {(() => {
          const selectedAmenities = Object.entries(formData.amenities).filter(([category, items]) => 
            items && Object.values(items).some(Boolean)
          );

          if (selectedAmenities.length === 0) {
            return (
              <div className="text-center py-4">
                <p className="text-gray-500">No amenities selected</p>
                <p className="text-sm text-gray-400 mt-1">Go back to Step 4 to select amenities</p>
              </div>
            );
          }

          return (
            <div className="space-y-4">
              {selectedAmenities.map(([category, items]) => (
                <div key={category} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h4 className="font-medium text-gray-800 mb-3 capitalize">
                    {category.replace('_', ' ')} ({Object.values(items).filter(Boolean).length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(items).map(([itemKey, isSelected]) => {
                      if (!isSelected) return null;
                      return (
                        <span 
                          key={itemKey} 
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {itemKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Images Review Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Uploaded Images</h3>
        
        {(() => {
          // Get all images from the image manager
          const allImages = imageManagerRef.current?.getImages() || savedImages;
          const hasImages = Object.values(allImages).some(category => 
            category && Object.values(category).some(subcategory => 
              Array.isArray(subcategory) && subcategory.length > 0
            )
          );

          if (!hasImages) {
            return (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No images uploaded yet</p>
                <p className="text-sm text-gray-400 mt-1">Go back to Step 3 to upload property images</p>
              </div>
            );
          }

          return (
            <div className="space-y-4">
              {Object.entries(allImages).map(([categoryKey, category]) => {
                if (!category) return null;
                
                return (
                  <div key={categoryKey} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <h4 className="font-medium text-gray-800 mb-3 capitalize">
                      {categoryKey.replace('_', ' ')} Images
                    </h4>
                    
                    {Object.entries(category).map(([subcategoryKey, subcategory]) => {
                      if (!Array.isArray(subcategory) || subcategory.length === 0) return null;
                      
                      return (
                        <div key={subcategoryKey} className="mb-4 last:mb-0">
                          <h5 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                            {subcategoryKey.replace('_', ' ')} ({subcategory.length})
                          </h5>
                          
                          <div className="flex overflow-x-auto space-x-2 pb-2">
                            {subcategory.map((fileInfo: any, index: number) => (
                              <div key={index} className="relative group flex-shrink-0">
                                <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border border-gray-200">
                                  {fileInfo.name.includes('.pdf') || fileInfo.type?.includes('pdf') ? (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                      <DocumentIcon className="h-6 w-6 text-gray-400" />
                                    </div>
                                  ) : (
                                    <Image
                                      src={fileInfo.url}
                                      alt={`${subcategoryKey} ${index + 1}`}
                                      width={80}
                                      height={80}
                                      className="object-cover w-full h-full"
                                      unoptimized={fileInfo.url.startsWith('blob:')}
                                    />
                                  )}
                                </div>
                                
                                {/* File name tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
                                  {fileInfo.name}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Please review all the information above. Once you submit, the property will be added to your portfolio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Restore images when step 3 is rendered
  React.useEffect(() => {
    if (currentStep === 3) {
      restoreImages();
    }
  }, [currentStep]);

  if (isLoading) {
    return <PropertyFormSkeleton />;
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {renderStepContent()}
      
      {/* Submit button for step 5 */}
      {currentStep === 5 && (
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            onClick={() => console.log('Submit button clicked!')}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline mr-2"></div>
                Submitting...
              </>
            ) : (
              'Submit Property'
            )}
          </button>
        </div>
      )}
      
      {/* Debug info */}
      {currentStep === 5 && (
        <div className="text-xs text-gray-500 mt-2">
          Debug: Step {currentStep}, Form has {Object.keys(formData).length} fields
        </div>
      )}
    </form>
  );
}
