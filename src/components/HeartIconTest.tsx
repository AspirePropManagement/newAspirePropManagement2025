'use client';

import React, { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

/**
 * Simple test component to debug heart icon functionality
 */
export function HeartIconTest() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [testPropertyId] = useState(999);

  useEffect(() => {
    const favorites = localStorage.getItem('favoriteProperties');
    const favoriteIds = favorites ? JSON.parse(favorites) : [];
    const isInFavorites = favoriteIds.includes(testPropertyId);
    console.log('Test property', testPropertyId, 'is in favorites:', isInFavorites);
    setIsFavorite(isInFavorites);
  }, [testPropertyId]);

  const handleTestClick = () => {
    console.log('Test heart icon clicked!');
    
    const favorites = localStorage.getItem('favoriteProperties');
    const favoriteIds = favorites ? JSON.parse(favorites) : [];
    
    if (isFavorite) {
      const updatedFavorites = favoriteIds.filter((id: number) => id !== testPropertyId);
      localStorage.setItem('favoriteProperties', JSON.stringify(updatedFavorites));
      console.log('Removed test property from favorites');
    } else {
      const updatedFavorites = [...favoriteIds, testPropertyId];
      localStorage.setItem('favoriteProperties', JSON.stringify(updatedFavorites));
      console.log('Added test property to favorites');
    }
    
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Heart Icon Test</h3>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleTestClick}
          className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all"
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <HeartIconSolid className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
        <span className="text-sm text-gray-600">
          {isFavorite ? 'Added to favorites' : 'Not in favorites'}
        </span>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Property ID: {testPropertyId}
      </div>
    </div>
  );
}
