'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ServicesService } from '@/lib/serviceService'
import { Service } from '@/types/Service'
import { InlinePreloader } from '@/components/Preloader'
import { ScrollArrow } from '@/components/ScrollArrow'

/**
 * Services page component
 * Displays comprehensive real estate services offered by Aspire Property Management
 * Implements clean, modern design with clear service descriptions and call-to-actions
 */


export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const rows = await ServicesService.getActive()
        setServices(rows)
      } catch (e: any) {
        setError(e?.message || 'Failed to load services')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto">

          {loading ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
              <InlinePreloader text="Loading services..." />
            </div>
          ) : error ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Services</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Found</h3>
                <p className="text-gray-600">Check back later for our service offerings.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header Section */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10 mb-8 sm:mb-12">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                    Our Real Estate Services
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium">
                    Comprehensive solutions to maximize your property investment potential
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {services.map((service) => (
                  <div key={service.id} className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 md:p-8 border border-gray-100 hover:border-orange-200 group transform hover:-translate-y-1">
                    <div className="text-center space-y-3 sm:space-y-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center mx-auto overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                        {service.image_data ? (
                          <Image 
                            src={service.image_data} 
                            alt={service.image_alt || service.service_name} 
                            width={96} 
                            height={96} 
                            className="object-cover w-full h-full rounded-full group-hover:scale-110 transition-transform duration-300" 
                          />
                        ) : service.image_path ? (
                          <Image 
                            src={`/${service.image_path}`} 
                            alt={service.image_alt || service.service_name} 
                            width={96} 
                            height={96} 
                            className="object-cover w-full h-full rounded-full group-hover:scale-110 transition-transform duration-300" 
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 leading-tight">
                        {service.service_name}
                      </h3>
                      {service.short_description && (
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
                          {service.short_description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Scroll Arrow */}
      <ScrollArrow />
    </div>
  )
}
