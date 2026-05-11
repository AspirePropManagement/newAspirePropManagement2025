'use client';

import React, { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/PropertyCardSkeleton';
import { HeartIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { extractPropertyImages, getImageSrc, isBase64Image } from '@/utils/imageUtils';
import { ScrollArrow } from '@/components/ScrollArrow';

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

      if (!supabase) {
        console.error('Database connection not available');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 sm:py-6 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center shadow-md">
                <HeartIcon className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">My Favorites</h1>
                <p className="text-sm sm:text-base text-gray-600 font-medium">Properties you&apos;ve saved</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-end">
              <div className="bg-gradient-to-r from-orange-100 to-red-100 px-3 py-2 rounded-xl border border-orange-200 shadow-sm">
                <span className="text-sm sm:text-base font-semibold text-orange-700">
                  {favoriteProperties.length} {favoriteProperties.length === 1 ? 'property' : 'properties'} saved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        ) : favoriteProperties.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <HeartIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">No favorites yet</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
              Start exploring properties and click the heart icon to save your favorites here.
            </p>
            <a
              href="/properties-listing"
              className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg sm:rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Properties
            </a>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 md:p-6 bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100">
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                  Your Favorite Properties
                </h2>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium">
                  {favoriteProperties.length} {favoriteProperties.length === 1 ? 'property' : 'properties'} saved
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl md:rounded-2xl flex items-center justify-center">
                  <HeartIcon className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-100/50">
                      <div className="w-full aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 relative">
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
                            <div className="text-center">
                              <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-xs sm:text-sm text-gray-400">No Image</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Property Type Badge */}
                        <span className="absolute top-2 sm:top-3 left-2 sm:left-3 inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-800 shadow-md">
                          {property.type === 'resale' ? '🏠 Resale' : property.type === 'rental' ? '🔑 Rental' : '🏗️ New Project'}
                        </span>
                        
                        {/* Verified badge */}
                        <span className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium bg-green-600 text-white shadow-md">
                          ✓ Verified
                        </span>
                      </div>
                      <div className="p-3 sm:p-4">
                        <div className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2" title={title}>
                          {title}
                        </div>
                        <div className="mt-2 flex items-center text-xs sm:text-sm text-gray-500">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="line-clamp-1">{property.location || 'Location not specified'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Scroll Arrow */}
      <ScrollArrow />
    </div>
  );
}
