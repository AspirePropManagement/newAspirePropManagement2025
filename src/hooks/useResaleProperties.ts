import { useState, useEffect } from 'react';
import { ResalePropertyService } from '@/lib/resalePropertyService';
import { ResaleProperty } from '@/types/ResaleProperty';

/**
 * Custom hook for managing resale properties
 */
export function useResaleProperties(limit?: number) {
  const [properties, setProperties] = useState<ResaleProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, [limit]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ResalePropertyService.getActiveResaleProperties(limit);
      setProperties(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch resale properties';
      setError(errorMessage);
      console.error('Error fetching resale properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProperties = () => {
    fetchProperties();
  };

  return {
    properties,
    loading,
    error,
    refreshProperties
  };
}

/**
 * Custom hook for fetching a single resale property by ID
 */
export function useResaleProperty(id: string) {
  const [property, setProperty] = useState<ResaleProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ResalePropertyService.getResalePropertyById(id);
      setProperty(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch resale property';
      setError(errorMessage);
      console.error('Error fetching resale property:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProperty = () => {
    fetchProperty();
  };

  return {
    property,
    loading,
    error,
    refreshProperty
  };
}
