'use client'

import React from 'react'
import Link from 'next/link'

/**
 * Services page component
 * Displays comprehensive real estate services offered by Aspire Property Management
 * Implements clean, modern design with clear service descriptions and call-to-actions
 */


export default function ServicesPage() {
  const services = [
    {
      title: "Property Management",
      description: "Comprehensive property management services to maximize your investment returns and ensure hassle-free ownership.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
      ),
      color: "text-blue-500",
      href: "/contact"
    },
    {
      title: "Investment Advisory",
      description: "Expert guidance to help you make informed investment decisions and build a profitable real estate portfolio.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
      ),
      color: "text-green-500",
      href: "/contact"
    },
    {
      title: "Property Valuation",
      description: "Professional property valuation services using advanced analytics and market expertise for accurate assessments.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
      ),
      color: "text-purple-500",
      href: "/contact"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Real Estate Services
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-8 leading-relaxed">
              Comprehensive solutions to maximize your property investment potential
            </p>
            <div className="flex justify-center">
              <Link 
                href="/properties-listing"
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Real Estate Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We provide end-to-end real estate services designed to help you succeed in today&apos;s competitive market. 
              Our expert team combines market knowledge with cutting-edge technology to deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const bgColor = service.color.replace('text-', 'bg-').replace('-500', '-100');
              const hoverColor = service.color.replace('text-', 'bg-').replace('-500', '-200');
              
              return (
                <Link key={index} href={service.href} className="text-center space-y-4 group cursor-pointer">
                  <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto group-hover:${hoverColor} transition-colors duration-200`}>
                    <div className={`w-8 h-8 ${service.color}`}>
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Services Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Additional Services
              </h2>
              <p className="text-lg text-gray-600">
                Beyond our core services, we offer specialized solutions for every real estate need
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Property Insurance", icon: "🛡️" },
                { name: "Legal Documentation", icon: "📋" },
                { name: "Tax Planning", icon: "📊" },
                { name: "Property Marketing", icon: "📢" },
                { name: "Tenant Relations", icon: "🤝" },
                { name: "Maintenance Services", icon: "🔧" },
                { name: "Financial Planning", icon: "💰" },
                { name: "Market Research", icon: "📈" }
              ].map((service, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors duration-300">
                  <div className="text-3xl mb-3">{service.icon}</div>
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
