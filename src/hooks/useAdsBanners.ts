import { useState, useEffect } from 'react';
import { AdsBannerService } from '@/lib/adsBannerService';
import { AdsBanner, BannerLocation } from '@/types/AdsBanner';

/**
 * Custom hook for managing ads banners
 */
export function useAdsBanners(location: BannerLocation) {
  const [banners, setBanners] = useState<AdsBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, [location]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdsBannerService.getActiveBannersByLocation(location);
      setBanners(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch ads banners';
      setError(errorMessage);
      console.error('Error fetching ads banners:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshBanners = () => {
    fetchBanners();
  };

  return {
    banners,
    loading,
    error,
    refreshBanners
  };
}

/**
 * Custom hook for managing all ads banners (admin)
 */
export function useAllAdsBanners() {
  const [banners, setBanners] = useState<AdsBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllBanners();
  }, []);

  const fetchAllBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdsBannerService.getAllBanners();
      setBanners(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch ads banners';
      setError(errorMessage);
      console.error('Error fetching all ads banners:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBanner = async (bannerData: any) => {
    try {
      const newBanner = await AdsBannerService.createBanner(bannerData);
      setBanners(prev => [newBanner, ...prev]);
      return newBanner;
    } catch (err) {
      console.error('Error creating banner:', err);
      throw err;
    }
  };

  const updateBanner = async (id: string, bannerData: any) => {
    try {
      const updatedBanner = await AdsBannerService.updateBanner(id, bannerData);
      setBanners(prev => prev.map(banner => 
        banner.id === id ? updatedBanner : banner
      ));
      return updatedBanner;
    } catch (err) {
      console.error('Error updating banner:', err);
      throw err;
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      await AdsBannerService.deleteBanner(id);
      setBanners(prev => prev.filter(banner => banner.id !== id));
    } catch (err) {
      console.error('Error deleting banner:', err);
      throw err;
    }
  };

  const toggleBannerStatus = async (id: string, isActive: boolean) => {
    try {
      const updatedBanner = await AdsBannerService.toggleBannerStatus(id, isActive);
      setBanners(prev => prev.map(banner => 
        banner.id === id ? updatedBanner : banner
      ));
      return updatedBanner;
    } catch (err) {
      console.error('Error toggling banner status:', err);
      throw err;
    }
  };

  const refreshBanners = () => {
    fetchAllBanners();
  };

  return {
    banners,
    loading,
    error,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    refreshBanners
  };
}
