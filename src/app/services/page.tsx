'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ServicesService } from '@/lib/serviceService'
import { ServiceItem } from '@/types/Service'
import { InlinePreloader } from '@/components/Preloader'

/**
 * Services page component
 * Displays comprehensive real estate services offered by Aspire Property Management
 * Implements clean, modern design with clear service descriptions and call-to-actions
 */


export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([])
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">

          {loading ? (
            <InlinePreloader text="Loading services..." />
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : services.length === 0 ? (
            <div className="text-center text-gray-500">No services found.</div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Our Real Estate Services</h1>
                <p className="text-lg text-gray-600 mt-3">Comprehensive solutions to maximize your property investment potential</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                  <div key={service.id} className="text-center space-y-4 group">
                    <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto overflow-hidden">
                      {service.image_data ? (
                        <Image src={service.image_data} alt={service.image_alt || service.service_name} width={80} height={80} className="object-cover w-20 h-20 rounded-full" />
                      ) : service.image_path ? (
                        <Image src={`/${service.image_path}`} alt={service.image_alt || service.service_name} width={80} height={80} className="object-cover w-20 h-20 rounded-full" />
                      ) : (
                        <span className="text-2xl">🏷️</span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">{service.service_name}</h3>
                    {service.short_description && (
                      <p className="text-gray-600">{service.short_description}</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
