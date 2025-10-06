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

// Common input styling - Enhanced Mobile responsive
const inputClass = "w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base md:text-lg min-w-0";
const selectClass = "w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base md:text-lg bg-white min-w-0";
const labelClass = "block text-sm sm:text-base font-medium text-gray-700 mb-2";

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
      const minute24 = parseInt(m || '0');
      
      // Convert 24-hour to 12-hour format
      let hour12 = hour24;
      let period = 'AM';
      
      if (hour24 === 0) {
        hour12 = 12;
        period = 'AM';
      } else if (hour24 === 12) {
        hour12 = 12;
        period = 'PM';
      } else if (hour24 > 12) {
        hour12 = hour24 - 12;
        period = 'PM';
      } else {
        hour12 = hour24;
        period = 'AM';
      }
      
      setHours(hour12.toString());
      setMinutes(minute24.toString().padStart(2, '0'));
      setAmPm(period);
    } else {
      // Reset to default values when no value
      setHours('');
      setMinutes('');
      setAmPm('AM');
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
      
      // Convert 12-hour to 24-hour format
      if (ap === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (ap === 'AM' && hour24 === 12) {
        hour24 = 0;
      }
      
      const minute24 = parseInt(m);
      const time24 = `${hour24.toString().padStart(2, '0')}:${minute24.toString().padStart(2, '0')}`;
      onChange(time24);
    }
  };

  return (
    <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
      <select
        value={hours}
        onChange={handleHoursChange}
        className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-0"
      >
        <option value="">Hour</option>
        {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
          <option key={hour} value={hour}>{hour}</option>
        ))}
      </select>
      
      <span className="text-gray-500 text-sm flex-shrink-0">:</span>
      
      <select
        value={minutes}
        onChange={handleMinutesChange}
        className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-0"
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
        className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm flex-shrink-0"
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
    propertyType: '', // User will select the actual property type (apartment, villa, etc.)
    location: '',
    
    // Property Details (Step 2)
    societyName: '',
    projectName: '',
    craftedBy: '',
    constructionType: '',
    totalProjectAreaSize: '',
    towersCount: '',
    totalFloors: '',
    roi: '',
    rentalYield: '',
    marketedBy: '',
    facingVastu: '',
    suggestionDate: '',
    suggestionYear: '',
    availableBhkTypes: [] as string[],
    
    // New Project specific fields
    launchDate: '',
    possessionDate: '',
    minPrice: '',
    websiteUrl: '',
    brochureUrl: '',
    roomsPerFloor: '',
    cpSables: '',
    unitsAvailableForSale: '',
    contactName1: '',
    contactNumber1: '',
    contactName2: '',
    contactNumber2: '',
    reraNumber: '',
    projectConversionRate: '',
    latitude: '',
    longitude: '',
    otherNotes: '',
    importantNotes: '',
    
    // New Project Amenities (boolean fields)
    clubHouse: false,
    swimmingPool: false,
    childrenPlayArea: false,
    powerBackup: false,
    houseKeeping: false,
    lift: false,
    gym: false,
    park: false,
    security: false,
    gasPipeline: false,
    rainWaterHarvesting: false,
    sewageTreatmentPlant: false,
    visitorParking: false,
    fireSafety: false,
    
    // Compliance fields
    isGovtApproved: false,
    isReraApproved: false,
    loanAvailable: false,
    socialMediaMarketingAllowed: false,
    tenantType: '',
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
    
    // Resale specific new fields
    ownershipType: '',
    loanOnProperty: '',
    loanAmount: '',
    bankName: '',
    reasonForSale: '',
    flatsPerFloor: '',
    societyAreaSize: '',
    reraId: '',
    parkingVehicles: [] as string[],
    visitDaysWeekend: '',
    visitTimingWeekendFrom: '',
    visitTimingWeekendTo: '',
    visitDaysWeekdays: '',
    visitTimingWeekdaysFrom: '',
    visitTimingWeekdaysTo: '',
    listedBy: '',
    
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

  // Note: propertyType prop is used for form navigation, not for the database property_type field
  // The database property_type field is set by user selection in the form

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
    if (!formData.sellerName?.trim()) errors.push('Seller/Owner name is required');
    if (!formData.sellerEmail?.trim()) errors.push('Email is required');
    if (!formData.contactNumber?.trim()) errors.push('Contact number is required');
    if (!formData.bhkType?.trim()) errors.push('BHK type is required');
    if (!formData.propertyType?.trim()) errors.push('Property type is required');
    if (!formData.location?.trim()) errors.push('Location is required');
    
    // Furnishing type is only required for resale and rental properties, not for new projects
    if (propertyType !== 'new_project' && !formData.furnishingType?.trim()) {
      errors.push('Furnishing type is required');
    }
    
    // Email validation
    if (formData.sellerEmail && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.sellerEmail)) {
      errors.push('Please enter a valid email address');
    }
    
    // Contact number validation - must be exactly 10 digits
    if (formData.contactNumber && !/^[0-9]{10}$/.test(formData.contactNumber)) {
      errors.push('Contact number must be exactly 10 digits (numbers only)');
    }
    
    // Alternate number validation - if provided, must be exactly 10 digits
    if (formData.alternateNumber && formData.alternateNumber.trim() && !/^[0-9]{10}$/.test(formData.alternateNumber)) {
      errors.push('Alternate number must be exactly 10 digits (numbers only)');
    }
    
    // Property type specific validation
    if (propertyType === 'resale') {
      if (!formData.askingPrice?.trim()) {
        errors.push('Asking price is required for resale properties');
      } else if (isNaN(parseFloat(formData.askingPrice)) || parseFloat(formData.askingPrice) <= 0) {
        errors.push('Asking price must be a valid positive number');
      }
      if (!formData.listedBy?.trim()) {
        errors.push('Listed by is required for resale properties');
      }
    }
    
    if (propertyType === 'rental') {
      if (!formData.rentAmount?.trim()) {
        errors.push('Rent amount is required for rental properties');
      } else if (isNaN(parseFloat(formData.rentAmount)) || parseFloat(formData.rentAmount) <= 0) {
        errors.push('Rent amount must be a valid positive number');
      }
      if (!formData.tenantType?.trim()) {
        errors.push('Tenant type is required for rental properties');
      }
      if (!formData.listedBy?.trim()) {
        errors.push('Listed by is required for rental properties');
      }
    }
    
    if (propertyType === 'new_project') {
      if (!formData.projectName?.trim()) {
        errors.push('Project name is required for new projects');
      }
      if (!formData.craftedBy?.trim()) {
        errors.push('Crafted by is required for new projects');
      }
      if (!formData.constructionType?.trim()) {
        errors.push('Construction type is required for new projects');
      }
      if (!formData.listedBy?.trim()) {
        errors.push('Listed by is required for new projects');
      }
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
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
          {propertyType === 'new_project' ? 'Project Type' : 'Property Type'} *
        </label>
        <select
          value={formData.propertyType}
          onChange={(e) => handleInputChange('propertyType', e.target.value)}
          className={selectClass}
          required
        >
          <option value="">Select {propertyType === 'new_project' ? 'Project' : 'Property'} Type</option>
          {propertyType === 'new_project' ? (
            <>
              <option value="residence">Residence</option>
              <option value="gated_community_villa_or_bungalow">Gated Community/Villa/Bungalow</option>
              <option value="commercial">Commercial</option>
              <option value="land_or_plot">Land/Plot</option>
            </>
          ) : (
            <>
              <option value="apartment">Apartment</option>
              <option value="gated_community_villa_or_bungalow">Gated Community Villa/Bungalow</option>
              <option value="independent_house">Independent House</option>
            </>
          )}
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
          {propertyType === 'new_project' ? (
            <>
              <option value="builder">Builder</option>
              <option value="agent">Agent</option>
            </>
          ) : (
            <>
              <option value="owner">Owner</option>
              <option value="agent">Agent</option>
            </>
          )}
        </select>
      </div>
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
    <div className="space-y-4 sm:space-y-6">
      {/* First Row - Basic Project Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
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
      </div>

      {/* Second Row - Construction Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
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
      </div>

      {/* Third Row - Project Structure */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
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
      </div>

      {/* Fourth Row - Property Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
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
      </div>

      {/* Fifth Row - Financial Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
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
      </div>

      {/* Sixth Row - Compliance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
      </div>

      {/* Seventh Row - Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
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
      </div>

      {/* Eighth Row - Launch and Possession Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
            Launch Date
          </label>
          <input
            type="date"
            value={formData.launchDate}
            onChange={(e) => handleInputChange('launchDate', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Possession Date
          </label>
          <input
            type="date"
            value={formData.possessionDate}
            onChange={(e) => handleInputChange('possessionDate', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Ninth Row - Pricing and URLs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
            Minimum Price (₹)
          </label>
          <input
            type="number"
            value={formData.minPrice}
            onChange={(e) => handleInputChange('minPrice', e.target.value)}
            className={inputClass}
            placeholder="Enter minimum price"
          />
        </div>

        <div>
          <label className={labelClass}>
            Website URL
          </label>
          <input
            type="url"
            value={formData.websiteUrl}
            onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
            className={inputClass}
            placeholder="https://example.com"
          />
        </div>
      </div>

      {/* Tenth Row - Additional URLs and Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
            Brochure URL
          </label>
          <input
            type="url"
            value={formData.brochureUrl}
            onChange={(e) => handleInputChange('brochureUrl', e.target.value)}
            className={inputClass}
            placeholder="https://example.com/brochure.pdf"
          />
        </div>

        <div>
          <label className={labelClass}>
            Rooms per Floor
          </label>
          <input
            type="text"
            value={formData.roomsPerFloor}
            onChange={(e) => handleInputChange('roomsPerFloor', e.target.value)}
            className={inputClass}
            placeholder="e.g., 2, 4, 6"
          />
        </div>
      </div>

      {/* Eleventh Row - Additional Project Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
            CP Sables
          </label>
          <input
            type="text"
            value={formData.cpSables}
            onChange={(e) => handleInputChange('cpSables', e.target.value)}
            className={inputClass}
            placeholder="Enter CP Sables information"
          />
        </div>

        <div>
          <label className={labelClass}>
            Units Available for Sale
          </label>
          <input
            type="text"
            value={formData.unitsAvailableForSale}
            onChange={(e) => handleInputChange('unitsAvailableForSale', e.target.value)}
            className={inputClass}
            placeholder="e.g., 150 units"
          />
        </div>
      </div>

      {/* Twelfth Row - Contact Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
            Contact Name 1
          </label>
          <input
            type="text"
            value={formData.contactName1}
            onChange={(e) => handleInputChange('contactName1', e.target.value)}
            className={inputClass}
            placeholder="Primary contact person"
          />
        </div>

        <div>
          <label className={labelClass}>
            Contact Number 1
          </label>
          <input
            type="tel"
            value={formData.contactNumber1}
            onChange={(e) => handleInputChange('contactNumber1', e.target.value)}
            className={inputClass}
            placeholder="10-15 digit number"
          />
        </div>
      </div>

      {/* Thirteenth Row - Secondary Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
            Contact Name 2
          </label>
          <input
            type="text"
            value={formData.contactName2}
            onChange={(e) => handleInputChange('contactName2', e.target.value)}
            className={inputClass}
            placeholder="Secondary contact person"
          />
        </div>

        <div>
          <label className={labelClass}>
            Contact Number 2
          </label>
          <input
            type="tel"
            value={formData.contactNumber2}
            onChange={(e) => handleInputChange('contactNumber2', e.target.value)}
            className={inputClass}
            placeholder="10-15 digit number"
          />
        </div>
      </div>

      {/* Fourteenth Row - Compliance Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
            RERA Number
          </label>
          <input
            type="text"
            value={formData.reraNumber}
            onChange={(e) => handleInputChange('reraNumber', e.target.value)}
            className={inputClass}
            placeholder="Enter RERA registration number"
          />
        </div>

        <div>
          <label className={labelClass}>
            Project Conversion Rate
          </label>
          <input
            type="text"
            value={formData.projectConversionRate}
            onChange={(e) => handleInputChange('projectConversionRate', e.target.value)}
            className={inputClass}
            placeholder="e.g., 85%"
          />
        </div>
      </div>


      {/* Sixteenth Row - Notes */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
            Other Notes
          </label>
          <textarea
            value={formData.otherNotes}
            onChange={(e) => handleInputChange('otherNotes', e.target.value)}
            className={inputClass}
            rows={3}
            placeholder="Any additional notes about the project"
          />
        </div>
      </div>

      {/* Seventeenth Row - Important Notes */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
            Important Notes
          </label>
          <textarea
            value={formData.importantNotes}
            onChange={(e) => handleInputChange('importantNotes', e.target.value)}
            className={inputClass}
            rows={3}
            placeholder="Important information about the project"
          />
        </div>
      </div>

      {/* BHK Type Checkboxes for New Projects - Mobile Responsive */}
      <div>
        <label className={labelClass}>
          Available BHK Types
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {['1_rk', '1_bhk', '2_bhk', '3_bhk', '4_bhk', '5_bhk', '5_plus_bhk'].map((bhkType) => (
            <label key={bhkType} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
              />
              <span className="text-xs sm:text-sm text-gray-700">
                {bhkType.replace('_', ' ').toUpperCase()}
              </span>
            </label>
          ))}
        </div>
      </div>


    </div>
  );

  const renderResaleDetails = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* First Row - Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
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
      </div>

      {/* Second Row - Property Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
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
      </div>

      {/* Third Row - Age, Parking Type, Negotiable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
            Age of Property
          </label>
          <select
            value={formData.propertyAge}
            onChange={(e) => handleInputChange('propertyAge', e.target.value)}
            className={selectClass}
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
          <label className={labelClass}>
            Parking Type
          </label>
          <select
            value={formData.parkingType}
            onChange={(e) => handleInputChange('parkingType', e.target.value)}
            className={selectClass}
          >
            <option value="">Select Parking Type</option>
            <option value="covered_parking">Covered</option>
            <option value="open_parking">Open</option>
            <option value="shed_parking">Shed</option>
          </select>
        </div>
      </div>

      {/* Fourth Row - Negotiable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
            Price Negotiable
          </label>
          <select
            value={formData.isNegotiable ? 'true' : 'false'}
            onChange={(e) => handleInputChange('isNegotiable', e.target.value === 'true')}
            className={selectClass}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
      </div>

      {/* Fifth Row - Ownership & Loan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
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
      </div>

      {/* Loan Details - Conditional */}
      {formData.loanOnProperty === 'true' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className={labelClass}>
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
            <label className={labelClass}>
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
        </div>
      )}

      {/* Reason for Sale - Full Width */}
      <div>
        <label className={labelClass}>
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

      {/* Sixth Row - Additional Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
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
      </div>

      {/* Seventh Row - RERA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
      </div>

      {/* Parking Vehicles Checkboxes */}
      <div>
        <label className={labelClass}>
          Parking Vehicles
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {['car', 'two_wheeler', 'bicycle', 'other'].map((vehicle) => (
            <label key={vehicle} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
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
        <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
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
        <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
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
    <div className="space-y-4 sm:space-y-6">
      {/* First Row - Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
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
      </div>

      {/* Second Row - Property Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
            Deposit Amount
          </label>
          <input
            type="number"
            value={formData.depositAmount}
            onChange={(e) => handleInputChange('depositAmount', e.target.value)}
            className={inputClass}
            placeholder="Enter deposit amount"
          />
        </div>
      </div>

      {/* Third Row - Rental Specific */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
            Parking Type
          </label>
          <select
            value={formData.parkingType}
            onChange={(e) => handleInputChange('parkingType', e.target.value)}
            className={selectClass}
          >
            <option value="">Select Parking Type</option>
            <option value="covered_parking">Covered</option>
            <option value="open_parking">Open</option>
            <option value="shed_parking">Shed</option>
          </select>
        </div>
      </div>

      {/* Fourth Row - Age and Negotiable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
            Age of Property
          </label>
          <select
            value={formData.propertyAge}
            onChange={(e) => handleInputChange('propertyAge', e.target.value)}
            className={selectClass}
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
          <label className={labelClass}>
            Rent Negotiable
          </label>
          <select
            value={formData.isNegotiable ? 'true' : 'false'}
            onChange={(e) => handleInputChange('isNegotiable', e.target.value === 'true')}
            className={selectClass}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
      </div>

      {/* Fifth Row - Availability */}
      <div>
        <label className={labelClass}>
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
      <div>
        <label className={labelClass}>
          Parking Vehicles
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {['car', 'two_wheeler', 'bicycle', 'other'].map((vehicle) => (
            <label key={vehicle} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
              />
              <span className="text-xs sm:text-sm text-gray-700 capitalize">
                {vehicle.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Visit Details - Weekend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
            Visit Timing (Weekend)
          </label>
          <div className="space-y-2">
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
      </div>

      {/* Visit Details - Weekdays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
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
          <label className={labelClass}>
            Visit Timing (Weekdays)
          </label>
          <div className="space-y-2">
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
      </div>

      {/* Pets Allowed */}
      <div>
        <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            checked={formData.petsAllowed || false}
            onChange={(e) => handleInputChange('petsAllowed', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">Pets Allowed</span>
        </label>
      </div>

      {/* Property Measurements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className={labelClass}>
            Square Feet
          </label>
          <input
            type="number"
            value={formData.squareFeet}
            onChange={(e) => handleInputChange('squareFeet', e.target.value)}
            className={inputClass}
            placeholder="Enter square feet"
          />
        </div>

        <div>
          <label className={labelClass}>
            Carpet Area
          </label>
          <input
            type="number"
            value={formData.carpetArea}
            onChange={(e) => handleInputChange('carpetArea', e.target.value)}
            className={inputClass}
            placeholder="Enter carpet area"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>
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
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Review Your Property Details</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Basic Information</h4>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <p><span className="font-medium">Name:</span> {formData.sellerName || 'Not provided'}</p>
              <p><span className="font-medium">Email:</span> {formData.sellerEmail || 'Not provided'}</p>
              <p><span className="font-medium">Contact:</span> {formData.contactNumber || 'Not provided'}</p>
              <p><span className="font-medium">BHK:</span> {formData.bhkType || 'Not provided'}</p>
              <p><span className="font-medium">Property Type:</span> {formData.propertyType || 'Not provided'}</p>
              <p><span className="font-medium">Location:</span> {formData.location || 'Not provided'}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">Property Details</h4>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
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

      {/* Amenities Review Section - Mobile Responsive */}
      <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Review Your Selected Amenities</h3>
        
        {(() => {
          const selectedAmenities = Object.entries(formData.amenities).filter(([category, items]) => 
            items && Object.values(items).some(Boolean)
          );

          if (selectedAmenities.length === 0) {
            return (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm sm:text-base">No amenities selected</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">Go back to Step 4 to select amenities</p>
              </div>
            );
          }

          return (
            <div className="space-y-3 sm:space-y-4">
              {selectedAmenities.map(([category, items]) => (
                <div key={category} className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white">
                  <h4 className="font-medium text-gray-800 mb-2 sm:mb-3 capitalize text-sm sm:text-base">
                    {category.replace('_', ' ')} ({Object.values(items).filter(Boolean).length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {Object.entries(items).map(([itemKey, isSelected]) => {
                      if (!isSelected) return null;
                      return (
                        <span 
                          key={itemKey} 
                          className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800"
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

      {/* Images Review Section - Mobile Responsive */}
      <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Review Your Uploaded Images</h3>
        
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
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <PhotoIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm sm:text-base">No images uploaded yet</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">Go back to Step 3 to upload property images</p>
              </div>
            );
          }

          return (
            <div className="space-y-3 sm:space-y-4">
              {Object.entries(allImages).map(([categoryKey, category]) => {
                if (!category) return null;
                
                return (
                  <div key={categoryKey} className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-white">
                    <h4 className="font-medium text-gray-800 mb-2 sm:mb-3 capitalize text-sm sm:text-base">
                      {categoryKey.replace('_', ' ')} Images
                    </h4>
                    
                    {Object.entries(category).map(([subcategoryKey, subcategory]) => {
                      if (!Array.isArray(subcategory) || subcategory.length === 0) return null;
                      
                      return (
                        <div key={subcategoryKey} className="mb-3 sm:mb-4 last:mb-0">
                          <h5 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 capitalize">
                            {subcategoryKey.replace('_', ' ')} ({subcategory.length})
                          </h5>
                          
                          <div className="flex overflow-x-auto space-x-2 pb-2">
                            {subcategory.map((imageData: any, index: number) => {
                              // Handle both old format (with name/type/url) and new format (base64 strings)
                              const isBase64 = typeof imageData === 'string' && imageData.startsWith('data:');
                              const isPDF = isBase64 
                                ? (imageData.includes('data:application/pdf') || imageData.includes('data:application/octet-stream'))
                                : (imageData.name?.includes('.pdf') || imageData.type?.includes('pdf'));
                              
                              const imageSrc = isBase64 ? imageData : imageData.url;
                              const imageAlt = `${subcategoryKey} ${index + 1}`;
                              const fileName = isBase64 ? `Image ${index + 1}` : (imageData.name || `File ${index + 1}`);
                              
                              return (
                                <div key={index} className="relative group flex-shrink-0">
                                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg overflow-hidden border border-gray-200">
                                    {isPDF ? (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                        <DocumentIcon className="h-4 w-4 sm:h-6 sm:w-6 text-gray-400" />
                                      </div>
                                    ) : (
                                      <Image
                                        src={imageSrc}
                                        alt={imageAlt}
                                        width={80}
                                        height={80}
                                        className="object-cover w-full h-full"
                                        unoptimized={isBase64 || (imageSrc && imageSrc.startsWith('blob:'))}
                                      />
                                    )}
                                  </div>
                                  
                                  {/* File name tooltip - Mobile responsive */}
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 max-w-32 truncate">
                                    {fileName}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                                  </div>
                                </div>
                              );
                            })}
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

      {/* Info Section - Mobile Responsive */}
      <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-2 sm:ml-3">
            <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
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
    <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Modern Step Navigation */}
      <div className="mb-6 sm:mb-8">
        {/* Progress Bar Style Steps */}
        <div className="relative px-4">
          {/* Background Progress Line - positioned behind circles */}
          <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-200 z-0"></div>
          
          {/* Active Progress Line - positioned behind circles */}
          <div 
            className="absolute top-4 left-8 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 z-0 transition-all duration-500 ease-out"
            style={{ width: `calc(${((currentStep - 1) / 4) * 100}% - 16px)` }}
          ></div>
          
          {/* Step Indicators */}
          <div className="relative flex justify-between items-start">
            {[
              { step: 1, label: 'Basic', icon: '📝' },
              { step: 2, label: 'Details', icon: '🏠' },
              { step: 3, label: 'Images', icon: '📸' },
              { step: 4, label: 'Amenities', icon: '⭐' },
              { step: 5, label: 'Review', icon: '✅' }
            ].map(({ step, label, icon }) => (
              <div key={step} className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 transform bg-white ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-110' 
                    : 'text-gray-400 border-2 border-gray-200 hover:border-gray-300'
                }`}>
                  {currentStep > step ? '✓' : step}
                </div>
                <span className={`text-xs mt-1 font-medium transition-colors duration-300 ${
                  currentStep >= step ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Current Step Title */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full">
            <span className="text-sm font-semibold text-blue-700">
              {currentStep === 1 && 'Basic Information'}
              {currentStep === 2 && 'Property Details'}
              {currentStep === 3 && 'Images & Documents'}
              {currentStep === 4 && 'Amenities'}
              {currentStep === 5 && 'Review & Submit'}
            </span>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
              {currentStep}/5
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        {renderStepContent()}
      
      {/* Navigation and Submit buttons - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 pt-6 border-t border-gray-200">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={onPrevious}
            className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm sm:text-base"
          >
            ← Previous
          </button>
        )}
        
        {currentStep < 5 && (
          <div className="w-full sm:w-auto sm:ml-auto">
            <button
              type="button"
              onClick={onNext}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Next →
            </button>
          </div>
        )}
        
        {currentStep === 5 && (
          <div className="w-full sm:w-auto sm:ml-auto">
            <button
              type="submit"
              disabled={isLoading}
              onClick={() => console.log('Submit button clicked!')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white inline mr-2"></div>
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
