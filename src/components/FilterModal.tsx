'use client';

import React, { useState } from 'react';
import { 
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
  UserIcon,
  ClockIcon,
  SwatchIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilters: any;
  onFilterChange: (filters: any) => void;
}

export default function FilterModal({ isOpen, onClose, selectedFilters, onFilterChange }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState(selectedFilters);
  const [budgetRange, setBudgetRange] = useState([1000000, 50000000]);

  if (!isOpen) return null;

  const handleCheckboxChange = (filterType: string, value: string) => {
    const currentValues = localFilters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    
    setLocalFilters((prev: any) => ({
      ...prev,
      [filterType]: newValues
    }));
  };

  const handleToggleChange = (filterType: string) => {
    setLocalFilters((prev: any) => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleClearAll = () => {
    const clearedFilters = {
      budget: [],
      propertyType: [],
      location: '',
      possession: [],
      bhkType: [],
      listedBy: [],
      ageOfProperty: [],
      amenities: []
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `${(price / 100000).toFixed(1)} Lac`;
    }
    return price.toLocaleString();
  };

  const getPriceText = (price: number) => {
    if (price >= 10000000) {
      const crores = price / 10000000;
      return `${crores === 1 ? 'One' : crores.toFixed(1)} Crore Rupees`;
    } else if (price >= 100000) {
      const lacs = price / 100000;
      return `${lacs === 1 ? 'One' : lacs.toFixed(1)} Lakh Rupees`;
    }
    return price.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Configuration */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Configuration</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: '1_rk', label: '1 RK' },
                { value: '1_bhk', label: '1 BHK' },
                { value: '2_bhk', label: '2 BHK' },
                { value: '3_bhk', label: '3 BHK' },
                { value: '4_bhk', label: '4 BHK' },
                { value: '5_bhk', label: '4+ BHK' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleCheckboxChange('bhkType', option.value)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    localFilters.bhkType?.includes(option.value)
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Budget</h3>
            <div className="mb-4">
              <div className="bg-orange-100 border border-orange-300 rounded-full px-4 py-2 inline-block">
                <span className="text-orange-700 font-medium">
                  {formatPrice(budgetRange[0])} - {formatPrice(budgetRange[1])}
                </span>
              </div>
            </div>
            
            {/* Slider */}
            <div className="mb-6">
              <div className="relative">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-orange-500 rounded-full absolute"
                    style={{
                      left: `${(budgetRange[0] - 100000) / (50000000 - 100000) * 100}%`,
                      right: `${100 - (budgetRange[1] - 100000) / (50000000 - 100000) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>10 Lac</span>
                  <span>50 Cr</span>
                </div>
              </div>
            </div>

            {/* Price Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum</label>
                <input
                  type="text"
                  value={`INR ${budgetRange[0].toLocaleString()}`}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">{getPriceText(budgetRange[0])}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum</label>
                <input
                  type="text"
                  value={`INR ${budgetRange[1].toLocaleString()}`}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">{getPriceText(budgetRange[1])}</p>
              </div>
            </div>
          </div>

          {/* Purchase Type */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Purchase Type</h3>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">New Projects</h4>
                <p className="text-sm text-gray-500">Recently added best residential projects from top rated builders.</p>
              </div>
              <button
                onClick={() => handleToggleChange('propertyType')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localFilters.propertyType?.includes('new_project') ? 'bg-orange-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localFilters.propertyType?.includes('new_project') ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Possession */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Possession</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'ready', label: 'Ready to Move' },
                { value: '1year', label: 'In 1 Year' },
                { value: '2year', label: 'In 2 Years' },
                { value: '3year', label: 'In 3 Years' },
                { value: 'after3year', label: 'After 3 Years' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleCheckboxChange('possession', option.value)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    localFilters.possession?.includes(option.value)
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Listed By */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Listed By</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCheckboxChange('listedBy', 'developer')}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  localFilters.listedBy?.includes('developer')
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                Developer
              </button>
            </div>
          </div>

          {/* Age of Property */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Age of Property</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'less-than-1', label: 'Less than a Year' },
                { value: 'less-than-2', label: 'Less than 2 Years' },
                { value: 'less-than-3', label: 'Less than 3 Years' },
                { value: 'less-than-4', label: 'Less than 4 Years' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleCheckboxChange('ageOfProperty', option.value)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    localFilters.ageOfProperty?.includes(option.value)
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                {[
                  { value: 'parking', label: 'Parking' },
                  { value: 'lift', label: 'Lift' },
                  { value: 'gas-pipeline', label: 'Gas Pipeline' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.amenities?.includes(option.value)}
                      onChange={() => handleCheckboxChange('amenities', option.value)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
              <div className="space-y-3">
                {[
                  { value: 'swimming-pool', label: 'Swimming Pool' },
                  { value: 'gated-community', label: 'Gated Community' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.amenities?.includes(option.value)}
                      onChange={() => handleCheckboxChange('amenities', option.value)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t">
          <button
            onClick={handleClearAll}
            className="text-orange-500 hover:text-orange-600 underline"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
