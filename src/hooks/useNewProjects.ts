import { useState, useEffect } from 'react';

interface NewProject {
  id: string;
  project_name: string;
  project_type: string;
  construction_type: string;
  project_location: string;
  crafted_by: string;
  property_images?: {
    general_photos?: {
      exterior?: string[];
      interior?: string[];
    };
    project_images?: {
      club_house?: string[];
      swimming_pool?: string[];
      gym?: string[];
    };
  };
  amenities?: {
    club_house?: boolean;
    swimming_pool?: boolean;
    gym?: boolean;
    children_play_area?: boolean;
    power_backup?: boolean;
    lift?: boolean;
    park?: boolean;
    security?: boolean;
  };
  status?: string;
  created_at: string;
}

/**
 * Custom hook for fetching and managing new projects data
 * Provides loading state and error handling
 */
export function useNewProjects() {
  const [projects, setProjects] = useState<NewProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewProjects();
  }, []);

  /**
   * Fetches new projects from the API
   * Only fetches active projects for the home page display
   */
  const fetchNewProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching new projects from API...');
      const response = await fetch('/api/properties/new-projects');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch new projects: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Raw new projects data:', data);
      
      // Filter only active projects and limit to 12 for home page
      const activeProjects = data
        .filter((project: NewProject) => project.status === 'active' || !project.status)
        .slice(0, 12);
      
      console.log('Filtered active projects:', activeProjects);
      setProjects(activeProjects);
    } catch (err) {
      console.error('Error fetching new projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch new projects');
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    error,
    refetch: fetchNewProjects
  };
}
