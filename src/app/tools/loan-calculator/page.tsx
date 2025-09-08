import React from 'react';
import { LoanCalculator } from '@/components/tools/LoanCalculator';
import Link from 'next/link';

/**
 * Loan Calculator page
 * Provides loan eligibility calculation and maximum loan amount determination
 * Includes services section below the calculator
 */
export default function LoanCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <LoanCalculator />
      
      {/* Services Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Real Estate Services
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Beyond loan calculations, we offer comprehensive real estate services to help you make informed decisions and maximize your investment potential.
              </p>
            </div>

            {/* Services Grid - Matching Tools Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

            {/* CTA Section */}
            <div className="text-center mt-12">
              <Link 
                href="/services"
                className="inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                View All Services
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
