'use client';

import React, { useState, useEffect, useRef } from 'react';

interface PlaceResult {
  place_id: string;
  formatted_address: string;
  name?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string, place?: PlaceResult) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  id?: string;
  name?: string;
}

declare global {
  interface Window {
    google: any;
    initGooglePlaces: () => void;
  }
}

export default function GooglePlacesAutocomplete({
  value,
  onChange,
  placeholder = "Enter location",
  className = "",
  required = false,
  id,
  name
}: GooglePlacesAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);

  // Initialize Google Places API
  useEffect(() => {
    const initGooglePlaces = () => {
      try {
        if (window.google && window.google.maps && window.google.maps.places) {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          placesService.current = new window.google.maps.places.PlacesService(
            document.createElement('div')
          );
          setApiLoaded(true);
          setError(null);
          console.log('Google Places API initialized successfully');
        } else {
          setError('Google Maps API not properly loaded');
        }
      } catch (err) {
        console.error('Error initializing Google Places API:', err);
        setError('Failed to initialize Google Places API');
      }
    };

    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initGooglePlaces();
    } else {
      // Load Google Maps API if not already loaded
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      console.log('API Key found:', apiKey ? 'Yes' : 'No');
      
      if (!apiKey) {
        const errorMsg = 'Google Maps API key not found. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.';
        console.error(errorMsg);
        setError(errorMsg);
        return;
      }

      // Check if script is already loaded
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        // Script exists, wait for it to load
        existingScript.addEventListener('load', initGooglePlaces);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initGooglePlaces;
      script.onerror = () => {
        console.error('Failed to load Google Maps API script');
        setError('Failed to load Google Maps API');
      };
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (!apiLoaded || !autocompleteService.current) {
      console.log('API not loaded or autocomplete service not available');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    const request = {
      input: inputValue,
      componentRestrictions: { country: 'in' }, // Restrict to India
      types: ['geocode'] // Only return geocoding results
    };

    console.log('Making autocomplete request for:', inputValue);

    autocompleteService.current.getPlacePredictions(request, (predictions: any[], status: any) => {
      setIsLoading(false);
      console.log('Autocomplete response:', { status, predictions: predictions?.length || 0 });
      
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        const formattedSuggestions = predictions.map(prediction => ({
          place_id: prediction.place_id,
          formatted_address: prediction.description,
          name: prediction.structured_formatting?.main_text || prediction.description
        }));
        console.log('Formatted suggestions:', formattedSuggestions);
        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } else {
        console.log('Autocomplete failed or no results:', status);
        setSuggestions([]);
        setShowSuggestions(false);
        if (status !== window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          setError('Failed to fetch location suggestions');
        }
      }
    });
  };

  const handleSuggestionClick = (suggestion: PlaceResult) => {
    onChange(suggestion.formatted_address, suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        className={`${className} ${isLoading ? 'pr-10' : ''}`}
        autoComplete="off"
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-full left-0 right-0 mt-1 p-1 bg-gray-100 border border-gray-300 rounded text-xs text-gray-600">
          API Loaded: {apiLoaded ? 'Yes' : 'No'} | 
          Service: {autocompleteService.current ? 'Ready' : 'Not Ready'} | 
          Suggestions: {suggestions.length} | 
          Show: {showSuggestions ? 'Yes' : 'No'}
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {suggestion.formatted_address}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
