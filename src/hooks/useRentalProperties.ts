import { useState, useEffect } from 'react';

interface RentalProperty {
  id: string;
  owner_name: string;
  property_type: string;
  bhk_type: string;
  location: string;
  rent_amount: number;
  deposit_amount?: number;
  furnishing_type: string;
  property_images?: {
    general_photos?: {
      exterior?: string[];
      interior?: string[];
      bedrooms?: string[];
      kitchen?: string[];
      bathrooms?: string[];
      living_dining?: string[];
    };
  };
  amenities?: {
    parking_type?: string;
    pets_allowed?: boolean;
    allowed_for_family?: boolean;
    allowed_for_bachelor?: boolean;
    immediate_possession?: boolean;
  };
  status?: string;
  created_at: string;
}

/**
 * Custom hook for fetching and managing rental properties data
 * Provides loading state and error handling
 */
export function useRentalProperties() {
  const [properties, setProperties] = useState<RentalProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRentalProperties();
  }, []);

  /**
   * Fetches rental properties from the API
   * Only fetches available properties for the home page display
   */
  const fetchRentalProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/properties/rental');
      
      if (!response.ok) {
        throw new Error('Failed to fetch rental properties');
      }

      const data = await response.json();
      
      // Filter only available properties and limit to 12 for home page
      const availableProperties = data
        .filter((property: RentalProperty) => property.status === 'available' || !property.status)
        .slice(0, 12);
      
      setProperties(availableProperties);
    } catch (err) {
      console.error('Error fetching rental properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch rental properties');
    } finally {
      setLoading(false);
    }
  };

  return {
    properties,
    loading,
    error,
    refetch: fetchRentalProperties
  };
}
