'use client';

import React, { useState, useRef, useCallback } from 'react';
import { PropertyImageManager, PropertyImageManagerRef } from './PropertyImageManager';
import PropertyAmenitiesManager from './PropertyAmenitiesManager';
import { PropertyFormSkeleton } from './skeletons';
import { PhotoIcon, DocumentIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';
import { PropertyAmenities } from '@/types/PropertyAmenities';
import GooglePlacesAutocomplete from './GooglePlacesAutocomplete';

// Common input styling
const inputClass = "w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg";
const selectClass = "w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg bg-white";

// 12-Hour Time Picker Component
const TimePicker12Hour = ({ 
  value, 
  onChange, 
  placeholder = "Select time" 
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => {
  const [hours, setHours] = React.useState('');
  const [minutes, setMinutes] = React.useState('');
  const [amPm, setAmPm] = React.useState('AM');

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      const hour24 = parseInt(h);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      setHours(hour12.toString());
      setMinutes(m || '00');
      setAmPm(hour24 >= 12 ? 'PM' : 'AM');
    }
  }, [value]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHours = e.target.value;
    setHours(newHours);
    updateTime(newHours, minutes, amPm);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinutes = e.target.value;
    setMinutes(newMinutes);
    updateTime(hours, newMinutes, amPm);
  };

  const handleAmPmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAmPm = e.target.value;
    setAmPm(newAmPm);
    updateTime(hours, minutes, newAmPm);
  };

  const updateTime = (h: string, m: string, ap: string) => {
    if (h && m) {
      let hour24 = parseInt(h);
      if (ap === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (ap === 'AM' && hour24 === 12) {
        hour24 = 0;
      }
      const time24 = `${hour24.toString().padStart(2, '0')}:${m}`;
      onChange(time24);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={hours}
        onChange={handleHoursChange}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Hour</option>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
          <option key={hour} value={hour}>{hour}</option>
        ))}
      </select>
      
      <span className="text-gray-500">:</span>
      
      <select
        value={minutes}
        onChange={handleMinutesChange}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Min</option>
        {Array.from({ length: 60 }, (_, i) => i).map(minute => (
          <option key={minute} value={minute.toString().padStart(2, '0')}>
            {minute.toString().padStart(2, '0')}
          </option>
        ))}
      </select>
      
      <select
        value={amPm}
        onChange={handleAmPmChange}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

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
          className={selectClass}
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
  onNext?: () => void;
  onPrevious?: () => void;
}

export function PropertyForm({ 
  propertyType, 
  currentStep, 
  onSubmit, 
  onCancel, 
  isLoading,
  onNext,
  onPrevious
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
  const restoreImages = useCallback(() => {
    if (imageManagerRef.current && Object.keys(savedImages).length > 0) {
      imageManagerRef.current.setImages(savedImages);
    }
  }, [savedImages]);

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
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {propertyType === 'rental' ? 'Owner Name' : 'Seller Name'} *
        </label>
        <input
          type="text"
          value={formData.sellerName}
          onChange={(e) => handleInputChange('sellerName', e.target.value)}
          className={inputClass}
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
          className={inputClass}
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
          className={inputClass}
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
          className={inputClass}
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
          className={selectClass}
          required
        >
          <option value="">Select BHK Type</option>
          <option value="1_rk">1 RK</option>
          <option value="1_bhk">1 BHK</option>
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
          className={selectClass}
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
        <GooglePlacesAutocomplete
          value={formData.location}
          onChange={(value, place) => {
            handleInputChange('location', value);
            // Optionally store additional place data
            if (place) {
              console.log('Selected place:', place);
              // You can store place_id, coordinates, etc. if needed
            }
          }}
          placeholder="Enter property location (e.g., Pune, Maharashtra)"
          className={inputClass}
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

  const renderPropertyDetails = () => {
    if (propertyType === 'new_project') {
      return renderNewProjectDetails();
    } else if (propertyType === 'resale') {
      return renderResaleDetails();
    } else if (propertyType === 'rental') {
      return renderRentalDetails();
    }
    return null;
  };

  const renderNewProjectDetails = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Name *
        </label>
        <input
          type="text"
          value={formData.projectName}
          onChange={(e) => handleInputChange('projectName', e.target.value)}
          className={inputClass}
          placeholder="Enter project name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Crafted By *
        </label>
        <input
          type="text"
          value={formData.craftedBy}
          onChange={(e) => handleInputChange('craftedBy', e.target.value)}
          className={inputClass}
          placeholder="Enter developer/builder name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Construction Type *
        </label>
        <select
          value={formData.constructionType}
          onChange={(e) => handleInputChange('constructionType', e.target.value)}
          className={selectClass}
          required
        >
          <option value="">Select Construction Type</option>
          <option value="new_launching">New Launching</option>
          <option value="under_construction">Under Construction</option>
          <option value="ready_to_move">Ready to Move</option>
          <option value="partial_ready_to_move">Partial Ready to Move</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Project Area Size
        </label>
        <input
          type="text"
          value={formData.totalProjectAreaSize}
          onChange={(e) => handleInputChange('totalProjectAreaSize', e.target.value)}
          className={inputClass}
          placeholder="e.g., 10 acres, 50,000 sq ft"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Towers
        </label>
        <input
          type="number"
          value={formData.towersCount}
          onChange={(e) => handleInputChange('towersCount', e.target.value)}
          className={inputClass}
          placeholder="Enter number of towers"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Floors
        </label>
        <input
          type="number"
          value={formData.totalFloors}
          onChange={(e) => handleInputChange('totalFloors', e.target.value)}
          className={inputClass}
          placeholder="Enter total floors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Flats per Floor
        </label>
        <input
          type="text"
          value={formData.flatsPerFloor}
          onChange={(e) => handleInputChange('flatsPerFloor', e.target.value)}
          className={inputClass}
          placeholder="e.g., 2, 4, 6"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ROI
        </label>
        <input
          type="text"
          value={formData.roi}
          onChange={(e) => handleInputChange('roi', e.target.value)}
          className={inputClass}
          placeholder="e.g., 12-15%"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rental Yield
        </label>
        <input
          type="number"
          value={formData.rentalYield}
          onChange={(e) => handleInputChange('rentalYield', e.target.value)}
          className={inputClass}
          placeholder="Enter rental yield percentage"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Marketed By
        </label>
        <input
          type="text"
          value={formData.marketedBy}
          onChange={(e) => handleInputChange('marketedBy', e.target.value)}
          className={inputClass}
          placeholder="Enter marketing company name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Listed By *
        </label>
        <select
          value={formData.listedBy}
          onChange={(e) => handleInputChange('listedBy', e.target.value)}
          className={selectClass}
          required
        >
          <option value="">Select Listed By</option>
          <option value="builder">Builder</option>
          <option value="agent">Agent</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Facing (As per Vastu Compliances)
        </label>
        <select
          value={formData.facingVastu}
          onChange={(e) => handleInputChange('facingVastu', e.target.value)}
          className={selectClass}
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
          Suggestion Date
        </label>
        <input
          type="date"
          value={formData.suggestionDate}
          onChange={(e) => handleInputChange('suggestionDate', e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Suggestion Year
        </label>
        <input
          type="number"
          value={formData.suggestionYear}
          onChange={(e) => handleInputChange('suggestionYear', e.target.value)}
          className={inputClass}
          placeholder="e.g., 2025"
        />
      </div>

      {/* BHK Type Checkboxes for New Projects */}
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Available BHK Types
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['1_rk', '1_bhk', '2_bhk', '3_bhk', '4_bhk', '5_bhk', '5_plus_bhk'].map((bhkType) => (
            <label key={bhkType} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.availableBhkTypes?.includes(bhkType) || false}
                onChange={(e) => {
                  const currentTypes = formData.availableBhkTypes || [];
                  const newTypes = e.target.checked
                    ? [...currentTypes, bhkType]
                    : currentTypes.filter((type: string) => type !== bhkType);
                  handleInputChange('availableBhkTypes', newTypes);
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                {bhkType.replace('_', ' ').toUpperCase()}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResaleDetails = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Society Name
        </label>
        <input
          type="text"
          value={formData.societyName}
          onChange={(e) => handleInputChange('societyName', e.target.value)}
          className={inputClass}
          placeholder="Enter society name"
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
          className={inputClass}
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
          className={selectClass}
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
          Furnishing Type *
        </label>
        <select
          value={formData.furnishingType}
          onChange={(e) => handleInputChange('furnishingType', e.target.value)}
          className={selectClass}
          required
        >
          <option value="">Select Furnishing Type</option>
          <option value="fully_furnished">Fully Furnished</option>
          <option value="semi_furnished">Semi Furnished</option>
          <option value="un_furnished">Unfurnished</option>
        </select>
      </div>

      {/* New Resale Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ownership Type
        </label>
        <select
          value={formData.ownershipType}
          onChange={(e) => handleInputChange('ownershipType', e.target.value)}
          className={selectClass}
        >
          <option value="">Select Ownership Type</option>
          <option value="freehold">Freehold</option>
          <option value="leasehold">Leasehold</option>
          <option value="cooperative">Cooperative Society</option>
          <option value="condominium">Condominium</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loan on Property
        </label>
        <select
          value={formData.loanOnProperty}
          onChange={(e) => handleInputChange('loanOnProperty', e.target.value)}
          className={selectClass}
        >
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      {formData.loanOnProperty === 'true' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount
            </label>
            <input
              type="number"
              value={formData.loanAmount}
              onChange={(e) => handleInputChange('loanAmount', e.target.value)}
              className={inputClass}
              placeholder="Enter loan amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              className={inputClass}
              placeholder="Enter bank name"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reason for Sale
        </label>
        <textarea
          value={formData.reasonForSale}
          onChange={(e) => handleInputChange('reasonForSale', e.target.value)}
          className={inputClass}
          placeholder="Enter reason for selling"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Flats per Floor
        </label>
        <input
          type="text"
          value={formData.flatsPerFloor}
          onChange={(e) => handleInputChange('flatsPerFloor', e.target.value)}
          className={inputClass}
          placeholder="e.g., 2, 4, 6"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Society Area Size
        </label>
        <input
          type="text"
          value={formData.societyAreaSize}
          onChange={(e) => handleInputChange('societyAreaSize', e.target.value)}
          className={inputClass}
          placeholder="e.g., 5 acres, 25,000 sq ft"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          RERA ID
        </label>
        <input
          type="text"
          value={formData.reraId}
          onChange={(e) => handleInputChange('reraId', e.target.value)}
          className={inputClass}
          placeholder="Enter RERA ID"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Listed By *
        </label>
        <select
          value={formData.listedBy}
          onChange={(e) => handleInputChange('listedBy', e.target.value)}
          className={selectClass}
          required
        >
          <option value="">Select Listed By</option>
          <option value="owner">Owner</option>
          <option value="agent">Agent</option>
        </select>
      </div>

      {/* Parking Vehicles Checkboxes */}
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Parking Vehicles
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['car', 'two_wheeler', 'bicycle', 'other'].map((vehicle) => (
            <label key={vehicle} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.parkingVehicles?.includes(vehicle) || false}
                onChange={(e) => {
                  const currentVehicles = formData.parkingVehicles || [];
                  const newVehicles = e.target.checked
                    ? [...currentVehicles, vehicle]
                    : currentVehicles.filter((v: string) => v !== vehicle);
                  handleInputChange('parkingVehicles', newVehicles);
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700 capitalize">
                {vehicle.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Visit Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visit Days (Weekend)
        </label>
        <input
          type="text"
          value={formData.visitDaysWeekend}
          onChange={(e) => handleInputChange('visitDaysWeekend', e.target.value)}
          className={inputClass}
          placeholder="e.g., Saturday, Sunday"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visit Timing (Weekend)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <TimePicker12Hour
              value={formData.visitTimingWeekendFrom}
              onChange={(value) => handleInputChange('visitTimingWeekendFrom', value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <TimePicker12Hour
              value={formData.visitTimingWeekendTo}
              onChange={(value) => handleInputChange('visitTimingWeekendTo', value)}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visit Days (Weekdays)
        </label>
        <input
          type="text"
          value={formData.visitDaysWeekdays}
          onChange={(e) => handleInputChange('visitDaysWeekdays', e.target.value)}
          className={inputClass}
          placeholder="e.g., Monday to Friday"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visit Timing (Weekdays)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <TimePicker12Hour
              value={formData.visitTimingWeekdaysFrom}
              onChange={(value) => handleInputChange('visitTimingWeekdaysFrom', value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <TimePicker12Hour
              value={formData.visitTimingWeekdaysTo}
              onChange={(value) => handleInputChange('visitTimingWeekdaysTo', value)}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Square Feet
        </label>
        <input
          type="number"
          value={formData.squareFeet}
          onChange={(e) => handleInputChange('squareFeet', e.target.value)}
          className={selectClass}
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
          className={selectClass}
          placeholder="Enter carpet area"
        />
      </div>


      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={4}
          className={selectClass}
          placeholder="Additional details about the property..."
        />
      </div>
    </div>
  );

  const renderRentalDetails = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Society Name
        </label>
        <input
          type="text"
          value={formData.societyName}
          onChange={(e) => handleInputChange('societyName', e.target.value)}
          className={inputClass}
          placeholder="Enter society name"
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
          className={inputClass}
          placeholder="Enter floor number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Furnishing Type *
        </label>
        <select
          value={formData.furnishingType}
          onChange={(e) => handleInputChange('furnishingType', e.target.value)}
          className={selectClass}
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
          Deposit Amount
        </label>
        <input
          type="number"
          value={formData.depositAmount}
          onChange={(e) => handleInputChange('depositAmount', e.target.value)}
          className={selectClass}
          placeholder="Enter deposit amount"
        />
      </div>

      {/* New Rental Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tenant Type *
        </label>
        <select
          value={formData.tenantType}
          onChange={(e) => handleInputChange('tenantType', e.target.value)}
          className={selectClass}
          required
        >
          <option value="">Select Tenant Type</option>
          <option value="family">Family</option>
          <option value="bachelor">Bachelor</option>
          <option value="anyone">Anyone</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Listed By *
        </label>
        <select
          value={formData.listedBy}
          onChange={(e) => handleInputChange('listedBy', e.target.value)}
          className={selectClass}
          required
        >
          <option value="">Select Listed By</option>
          <option value="owner">Owner</option>
          <option value="agent">Agent</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available From Date
        </label>
        <input
          type="date"
          value={formData.availableFromDate}
          onChange={(e) => handleInputChange('availableFromDate', e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Parking Vehicles Checkboxes */}
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Parking Vehicles
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['car', 'two_wheeler', 'bicycle', 'other'].map((vehicle) => (
            <label key={vehicle} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.parkingVehicles?.includes(vehicle) || false}
                onChange={(e) => {
                  const currentVehicles = formData.parkingVehicles || [];
                  const newVehicles = e.target.checked
                    ? [...currentVehicles, vehicle]
                    : currentVehicles.filter((v: string) => v !== vehicle);
                  handleInputChange('parkingVehicles', newVehicles);
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700 capitalize">
                {vehicle.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Visit Details */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visit Days (Weekend)
        </label>
        <input
          type="text"
          value={formData.visitDaysWeekend}
          onChange={(e) => handleInputChange('visitDaysWeekend', e.target.value)}
          className={inputClass}
          placeholder="e.g., Saturday, Sunday"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visit Timing (Weekend)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <TimePicker12Hour
              value={formData.visitTimingWeekendFrom}
              onChange={(value) => handleInputChange('visitTimingWeekendFrom', value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <TimePicker12Hour
              value={formData.visitTimingWeekendTo}
              onChange={(value) => handleInputChange('visitTimingWeekendTo', value)}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visit Days (Weekdays)
        </label>
        <input
          type="text"
          value={formData.visitDaysWeekdays}
          onChange={(e) => handleInputChange('visitDaysWeekdays', e.target.value)}
          className={inputClass}
          placeholder="e.g., Monday to Friday"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visit Timing (Weekdays)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <TimePicker12Hour
              value={formData.visitTimingWeekdaysFrom}
              onChange={(value) => handleInputChange('visitTimingWeekdaysFrom', value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <TimePicker12Hour
              value={formData.visitTimingWeekdaysTo}
              onChange={(value) => handleInputChange('visitTimingWeekdaysTo', value)}
            />
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.petsAllowed || false}
            onChange={(e) => handleInputChange('petsAllowed', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">Pets Allowed</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Square Feet
        </label>
        <input
          type="number"
          value={formData.squareFeet}
          onChange={(e) => handleInputChange('squareFeet', e.target.value)}
          className={selectClass}
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
          className={selectClass}
          placeholder="Enter carpet area"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          className={inputClass}
          placeholder="Additional notes about the property"
          rows={4}
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
  }, [currentStep, restoreImages]);

  if (isLoading) {
    return <PropertyFormSkeleton />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Step Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            Step {currentStep} of 5
          </div>
        </div>
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700">
            {currentStep === 1 && 'Basic Information'}
            {currentStep === 2 && 'Property Details'}
            {currentStep === 3 && 'Images & Documents'}
            {currentStep === 4 && 'Amenities'}
            {currentStep === 5 && 'Review & Submit'}
          </div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        {renderStepContent()}
      
      {/* Navigation and Submit buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={onPrevious}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            ← Previous
          </button>
        )}
        
        {currentStep < 5 && (
          <div className="ml-auto">
            <button
              type="button"
              onClick={onNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
        
        {currentStep === 5 && (
          <div className="ml-auto">
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
      </div>
      
      {/* Debug info */}
      {currentStep === 5 && (
        <div className="text-xs text-gray-500 mt-2">
          Debug: Step {currentStep}, Form has {Object.keys(formData).length} fields
        </div>
      )}
      </form>
    </div>
  );
}
