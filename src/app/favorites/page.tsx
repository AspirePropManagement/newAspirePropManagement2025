'use client';

import React, { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/PropertyCardSkeleton';
import { HeartIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { extractPropertyImages, getImageSrc, isBase64Image } from '@/utils/imageUtils';

/**
 * Favorites Page
 * Displays all properties that the user has marked as favorites
 */
export default function FavoritesPage() {
  const [favoriteProperties, setFavoriteProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorite properties on component mount and when favorites change
  useEffect(() => {
    fetchFavoriteProperties();
    const handler = () => fetchFavoriteProperties();
    window.addEventListener('favoritesUpdated', handler as EventListener);
    return () => window.removeEventListener('favoritesUpdated', handler as EventListener);
  }, []);

  /**
   * Fetches favorite properties from localStorage
   */
  const fetchFavoriteProperties = async () => {
    try {
      setLoading(true);
      
      // Get favorites from localStorage
      const favorites = localStorage.getItem('favoriteProperties');
      const favoriteIds: string[] = favorites ? JSON.parse(favorites) : [];

      if (favoriteIds.length === 0) {
        setFavoriteProperties([]);
        return;
      }

      // Fetch from all three tables in parallel
      const [resaleRes, rentalRes, newProjRes] = await Promise.all([
        supabase.from('resale_properties').select('*').in('id', favoriteIds),
        supabase.from('rental_properties').select('*').in('id', favoriteIds),
        supabase.from('new_projects').select('*').in('id', favoriteIds),
      ]);

      if (resaleRes.error) console.error('Favorites resale fetch error:', resaleRes.error);
      if (rentalRes.error) console.error('Favorites rental fetch error:', rentalRes.error);
      if (newProjRes.error) console.error('Favorites new_projects fetch error:', newProjRes.error);

      const combined = [
        ...(resaleRes.data || []).map(p => ({ ...p, type: 'resale' })),
        ...(rentalRes.data || []).map(p => ({ ...p, type: 'rental' })),
        ...(newProjRes.data || []).map(p => ({ ...p, type: 'new_project', location: p.project_location || p.location })),
      ];

      // Keep the order as per favorites selection if desired
      const ordered = favoriteIds
        .map(fid => combined.find(p => p.id === fid))
        .filter(Boolean) as any[];

      setFavoriteProperties(ordered);
    } catch (err) {
      console.error('Error fetching favorite properties:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Removes a property from favorites
   */
  const removeFromFavorites = (propertyId: number) => {
    const favorites = localStorage.getItem('favoriteProperties');
    const favoriteIds = favorites ? JSON.parse(favorites) : [];
    const updatedFavorites = favoriteIds.filter((id: number) => id !== propertyId);
    localStorage.setItem('favoriteProperties', JSON.stringify(updatedFavorites));
    
    // Update the state
    setFavoriteProperties(prev => prev.filter(property => property.id !== propertyId));
    
    // Dispatch custom event to update navbar count
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <HeartIcon className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
                <p className="text-gray-600">Properties you&apos;ve saved</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {favoriteProperties.length} {favoriteProperties.length === 1 ? 'property' : 'properties'} saved
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        ) : favoriteProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HeartIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start exploring properties and click the heart icon to save your favorites here.
            </p>
            <a
              href="/properties-listing"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Browse Properties
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProperties.map((property) => {
              const title = (() => {
                if (property.type === 'resale') return property.society_name || 'Resale Property';
                if (property.type === 'rental') return property.society_name || 'Rental Property';
                if (property.type === 'new_project') return property.project_name || 'New Project';
                return 'Property';
              })();
              const images = extractPropertyImages(property);
              const href = `/properties/${property.type}/${property.id}`;
              return (
                <Link key={property.id} href={href} className="group block">
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="w-full aspect-[16/10] bg-gray-200 relative">
                      {images.length > 0 ? (
                        <Image
                          src={getImageSrc(images[0])}
                          alt={title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          unoptimized={isBase64Image(images[0])}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                      {/* Verified badge */}
                      <span className="absolute bottom-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-600 text-white shadow">
                        100% Verified
                      </span>
                    </div>
                    <div className="px-3 py-3">
                      <div className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:underline" title={title}>
                        {title}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
