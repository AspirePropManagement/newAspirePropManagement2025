'use client';

import React from 'react';
import Link from 'next/link';
import { usePropertyCount } from '@/hooks/usePropertyCount';

/**
 * PropertyTypesSection component displays different property types with icons
 * Shows property investment categories and available properties count
 */
export function PropertyTypesSection() {
  const { totalCount, loading } = usePropertyCount();
  
  const propertyTypes = [
    {
      id: 'verified',
      name: 'Verified',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4" />
        </svg>
      )
    },
    {
      id: 'office',
      name: 'Office',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'house',
      name: 'House',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'town',
      name: 'Town',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h6" />
        </svg>
      )
    },
    {
      id: 'urban',
      name: 'Urban',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21l8-8-8-8" />
        </svg>
      )
    },
    {
      id: 'residential',
      name: 'House',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Content */}
          <div className="flex-shrink-0">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Where Everyone's
            </h2>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              investing
            </h2>
            <p className="text-lg text-orange-600 font-semibold mb-6">
              <span className="text-gray-900">aspire prop management</span> you can't miss! picks
            </p>
            
            {/* Available Properties Button */}
            <Link
              href="/properties-listing"
              className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 group"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading Properties
                </>
              ) : (
                <>
                  +{totalCount} Available Properties
                </>
              )}
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Right Content - Property Types Icons */}
          <div className="flex-1">
            <div className="flex justify-start items-center gap-12 lg:gap-16 flex-wrap pl-8 lg:pl-12">
              {propertyTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex flex-col items-center text-center group cursor-pointer transition-all duration-300"
                >
                  {/* Icon - No background box */}
                  <div className="mb-3 group-hover:scale-110 transition-all duration-300 group-hover:-translate-y-1">
                    <div className="transform group-hover:rotate-3 transition-transform duration-300">
                      {React.cloneElement(type.icon as React.ReactElement, {
                        className: "w-14 h-14 text-blue-500 group-hover:text-blue-600 transition-colors duration-300"
                      })}
                    </div>
                  </div>
                  
                  {/* Type Name */}
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                    {type.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
