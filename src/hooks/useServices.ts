import { useState, useEffect } from 'react';
import { ServicesService } from '@/lib/serviceService';
import { Service } from '@/types/Service';

/**
 * Custom hook for managing services
 */
export function useServices(limit?: number) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, [limit]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ServicesService.getActive();
      // Apply limit if specified
      const limitedData = limit ? data.slice(0, limit) : data;
      setServices(limitedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch services';
      setError(errorMessage);
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshServices = () => {
    fetchServices();
  };

  return {
    services,
    loading,
    error,
    refreshServices
  };
}

/**
 * Custom hook for fetching a single service by ID
 */
export function useService(id: string) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ServicesService.getServiceById(id);
      setService(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch service';
      setError(errorMessage);
      console.error('Error fetching service:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshService = () => {
    fetchService();
  };

  return {
    service,
    loading,
    error,
    refreshService
  };
}

/**
 * Custom hook for fetching a single service by slug
 */
export function useServiceBySlug(slug: string) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchService();
    }
  }, [slug]);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ServicesService.getServiceBySlug(slug);
      setService(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch service';
      setError(errorMessage);
      console.error('Error fetching service:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshService = () => {
    fetchService();
  };

  return {
    service,
    loading,
    error,
    refreshService
  };
}

/**
 * Custom hook for managing all services (admin)
 */
export function useAllServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllServices();
  }, []);

  const fetchAllServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ServicesService.getAllServices();
      setServices(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch services';
      setError(errorMessage);
      console.error('Error fetching all services:', err);
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData: any) => {
    try {
      const newService = await ServicesService.createService(serviceData);
      setServices(prev => [newService, ...prev]);
      return newService;
    } catch (err) {
      console.error('Error creating service:', err);
      throw err;
    }
  };

  const updateService = async (id: string, serviceData: any) => {
    try {
      const updatedService = await ServicesService.updateService(id, serviceData);
      setServices(prev => prev.map(service => 
        service.id === id ? updatedService : service
      ));
      return updatedService;
    } catch (err) {
      console.error('Error updating service:', err);
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      await ServicesService.deleteService(id);
      setServices(prev => prev.filter(service => service.id !== id));
    } catch (err) {
      console.error('Error deleting service:', err);
      throw err;
    }
  };

  const toggleServiceStatus = async (id: string, isActive: boolean) => {
    try {
      const updatedService = await ServicesService.toggleServiceStatus(id, isActive);
      setServices(prev => prev.map(service => 
        service.id === id ? updatedService : service
      ));
      return updatedService;
    } catch (err) {
      console.error('Error toggling service status:', err);
      throw err;
    }
  };

  const refreshServices = () => {
    fetchAllServices();
  };

  return {
    services,
    loading,
    error,
    createService,
    updateService,
    deleteService,
    toggleServiceStatus,
    refreshServices
  };
}
