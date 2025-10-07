import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Custom hook for fetching total property count
 */
export function usePropertyCount() {
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPropertyCount();
  }, []);

  const fetchPropertyCount = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!supabase) {
        setError('Database connection not available');
        setLoading(false);
        return;
      }

      // Count properties from all property tables with proper status filtering
      const [
        { count: resaleCount },
        { count: rentalCount },
        { count: newProjectsCount }
      ] = await Promise.all([
        supabase.from('resale_properties').select('*', { count: 'exact', head: true }).eq('status', 'available'),
        supabase.from('rental_properties').select('*', { count: 'exact', head: true }).eq('status', 'available'),
        supabase.from('new_projects').select('*', { count: 'exact', head: true }).eq('status', 'active')
      ]);

      const total = (resaleCount || 0) + (rentalCount || 0) + (newProjectsCount || 0);
      setTotalCount(total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch property count';
      setError(errorMessage);
      console.error('Error fetching property count:', err);
      // Fallback to a reasonable number if there's an error
      setTotalCount(108);
    } finally {
      setLoading(false);
    }
  };

  return {
    totalCount,
    loading,
    error,
    refreshCount: fetchPropertyCount
  };
}
