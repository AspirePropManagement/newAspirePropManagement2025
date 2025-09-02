'use client';

import React, { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/PropertyCardSkeleton';
import { HeartIcon } from '@heroicons/react/24/outline';

/**
 * Favorites Page
 * Displays all properties that the user has marked as favorites
 */
export default function FavoritesPage() {
  const [favoriteProperties, setFavoriteProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorite properties on component mount
  useEffect(() => {
    fetchFavoriteProperties();
  }, []);

  /**
   * Fetches favorite properties from localStorage
   */
  const fetchFavoriteProperties = async () => {
    try {
      setLoading(true);
      
      // Get favorites from localStorage
      const favorites = localStorage.getItem('favoriteProperties');
      const favoriteIds = favorites ? JSON.parse(favorites) : [];
      
      // Dummy properties data (same as properties listing)
      const allProperties = [
        {
          id: 1,
          type: 'new_project',
          project_name: 'The Greenfront',
          location: 'Hinjawadi, Pune',
          description: '2 & 3 BHK Apartment, 4 BHK Duplex for Sale in Hinjawadi, Pune',
          bhk_type: '2 & 3 BHK Apartment, 4 BHK Duplex',
          starting_price: 11600000,
          price_per_sqft: 12290,
          built_up_area: 'On request',
          carpet_area: '944 - 2,180 Sq.ft.',
          project_status: 'under_construction',
          developer_name: 'Greenfront Developers',
          amenities: ['parking', 'swimming-pool', 'lift', 'gated-community'],
          images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop'
          ],
          created_at: new Date().toISOString(),
          offers_available: true
        },
        {
          id: 2,
          type: 'new_project',
          project_name: 'Godrej Skyline',
          location: 'Koregaon Park, Pune',
          description: '3 & 4 BHK Apartment for Sale in Koregaon Park, Pune',
          bhk_type: '3 & 4 BHK Apartment',
          starting_price: 38900000,
          price_per_sqft: 25930,
          built_up_area: '1500 - 2400 Sq.ft.',
          carpet_area: 'On request',
          project_status: 'under_construction',
          developer_name: 'Godrej Properties',
          amenities: ['parking', 'swimming-pool', 'lift', 'gated-community', 'gas-pipeline'],
          images: [
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
          ],
          created_at: new Date().toISOString(),
          offers_available: true
        },
        {
          id: 3,
          type: 'new_project',
          project_name: 'Lodha Belmondo',
          location: 'Hinjewadi, Pune',
          description: '2, 3 & 4 BHK Luxury Apartments for Sale in Hinjewadi, Pune',
          bhk_type: '2, 3 & 4 BHK',
          starting_price: 8500000,
          price_per_sqft: 8500,
          built_up_area: '1200 - 2800 Sq.ft.',
          carpet_area: '1100 - 2600 Sq.ft.',
          project_status: 'ready_to_move',
          developer_name: 'Lodha Group',
          amenities: ['parking', 'swimming-pool', 'lift', 'gated-community', 'gas-pipeline'],
          images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
          ],
          created_at: new Date().toISOString(),
          offers_available: false
        },
        {
          id: 4,
          type: 'resale',
          society_name: 'Prestige Shantiniketan',
          location: 'Baner, Pune',
          description: '3 BHK Apartment for Sale in Prestige Shantiniketan, Baner',
          bhk_type: '3 BHK',
          asking_price: 12500000,
          price_per_sqft: 12500,
          built_up_area: '1200 Sq.ft.',
          carpet_area: '1100 Sq.ft.',
          seller_name: 'Individual Owner',
          amenities: ['parking', 'lift', 'gated-community'],
          images: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop'
          ],
          created_at: new Date().toISOString(),
          offers_available: true
        }
      ];

      // Filter properties that are in favorites
      const favoritesList = allProperties.filter(property => 
        favoriteIds.includes(property.id)
      );

      setFavoriteProperties(favoritesList);
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
            {favoriteProperties.map((property) => (
              <div key={property.id} className="relative">
                <PropertyCard property={property} />
                <button
                  onClick={() => removeFromFavorites(property.id)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                  title="Remove from favorites"
                >
                  <HeartIcon className="w-5 h-5 text-red-500 fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
