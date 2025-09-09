'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { HeroCarousel } from '@/components/HeroCarousel';
import { FilterCard } from '@/components/FilterCard';
import { ScrollArrow } from '@/components/ScrollArrow';
import { NewProjectsCarousel } from '@/components/NewProjectsCarousel';
import { useNewProjects } from '@/hooks/useNewProjects';
import { RentalPropertiesCarousel } from '@/components/RentalPropertiesCarousel';
import { useRentalProperties } from '@/hooks/useRentalProperties';


export default function HomePage() {
  const { loading } = useAuth();
  const { projects: newProjects, loading: projectsLoading } = useNewProjects();
  const { properties: rentalProperties, loading: rentalLoading } = useRentalProperties();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
            <p className="text-sm text-gray-500">Initializing application...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section with Filter Card */}
      <div className="relative">
        <HeroCarousel />
        {/* Filter Card - Positioned to overlay both hero and features sections */}
        <FilterCard />
      </div>

      {/* Blank Spacer Section - Prevents content from being cut by filter card */}
      <div className="h-32 md:h-36 lg:h-40 bg-gradient-to-br from-blue-50 to-indigo-100"></div>

      {/* Tools Section */}
      <div className="container mx-auto px-4 py-16 relative z-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* EMI Calculator */}
          <Link href="/tools/emi-calculator" className="text-center space-y-4 group cursor-pointer">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-orange-200 transition-colors duration-200">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">EMI Calculator</h3>
            <p className="text-gray-600">Calculate your monthly EMI payments for home loans and property investments.</p>
          </Link>
          
          {/* Loan Calculator */}
          <Link href="/tools/loan-calculator" className="text-center space-y-4 group cursor-pointer">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-orange-200 transition-colors duration-200">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">Loan Calculator</h3>
            <p className="text-gray-600">Determine your loan eligibility and calculate maximum loan amount you can get.</p>
          </Link>
          
          {/* Property Valuation */}
          <Link href="/tools/property-valuation" className="text-center space-y-4 group cursor-pointer">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-orange-200 transition-colors duration-200">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">Property Valuation</h3>
            <p className="text-gray-600">Get instant property valuation and market price estimates for your property.</p>
          </Link>
          
          {/* Rent Calculator */}
          <Link href="/tools/rent-calculator" className="text-center space-y-4 group cursor-pointer">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-orange-200 transition-colors duration-200">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">Rent Calculator</h3>
            <p className="text-gray-600">Calculate rental yield, ROI, and determine optimal rent for your property.</p>
          </Link>
        </div>

        {/* Services Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Real Estate Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive real estate solutions to help you make informed decisions and maximize your investment potential.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Property Management Service */}
            <Link href="/services" className="text-center space-y-4 group cursor-pointer">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors duration-200">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">Property Management</h3>
              <p className="text-gray-600">Comprehensive property management services to maximize your investment returns and ensure hassle-free ownership.</p>
            </Link>
            
            {/* Investment Advisory Service */}
            <Link href="/services" className="text-center space-y-4 group cursor-pointer">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-green-200 transition-colors duration-200">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">Investment Advisory</h3>
              <p className="text-gray-600">Expert guidance to help you make informed investment decisions and build a profitable real estate portfolio.</p>
            </Link>
            
            {/* Property Valuation Service */}
            <Link href="/services" className="text-center space-y-4 group cursor-pointer">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-purple-200 transition-colors duration-200">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">Property Valuation</h3>
              <p className="text-gray-600">Professional property valuation services using advanced analytics and market expertise for accurate assessments.</p>
            </Link>
          </div>
        </div>
      </div>

      {/* New Projects Section */}
      <NewProjectsCarousel projects={newProjects} />

      {/* Rental Properties Section */}
      <RentalPropertiesCarousel properties={rentalProperties} />

      {/* Scroll Arrow */}
      <ScrollArrow />
    </div>
  );
}
