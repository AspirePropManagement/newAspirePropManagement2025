'use client'

import React from 'react'
import Link from 'next/link'
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { footerConfig } from '@/config/footerConfig'

/**
 * Footer component for the application
 * Provides consistent footer across all pages with company information and links
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <HomeIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  <span className="text-white">{footerConfig.company.name.split(' ')[0]}</span>
                  <span className="text-orange-500">{footerConfig.company.name.split(' ')[1]}</span>
                </h3>
                <p className="text-sm text-gray-400 font-medium">{footerConfig.company.tagline}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              {footerConfig.company.description}
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-all duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-orange-500 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {footerConfig.links.quick.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-300 hover:text-orange-500 transition-colors flex items-center group">
                    <HomeIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-orange-500 flex items-center">
              <BuildingOfficeIcon className="w-5 h-5 mr-2" />
              Services
            </h4>
            <ul className="space-y-3">
              {footerConfig.links.services.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-300 hover:text-orange-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-orange-500 flex items-center">
              <PhoneIcon className="w-5 h-5 mr-2" />
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Email</p>
                  <a href={`mailto:${footerConfig.contact.email}`} className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                    {footerConfig.contact.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <PhoneIcon className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Phone</p>
                  <a href={`tel:${footerConfig.contact.phone}`} className="text-gray-300 hover:text-orange-500 transition-colors text-sm">
                    {footerConfig.contact.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Address</p>
                  <p className="text-gray-300 text-sm">
                    {footerConfig.contact.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        {footerConfig.newsletter.enabled && (
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="max-w-2xl mx-auto text-center">
              <h4 className="text-xl font-semibold mb-4 text-white">{footerConfig.newsletter.title}</h4>
              <p className="text-gray-300 mb-6">
                {footerConfig.newsletter.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={footerConfig.newsletter.placeholder}
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 font-medium">
                  {footerConfig.newsletter.buttonText}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 lg:mb-0">
              <HeartIcon className="w-4 h-4 text-red-500" />
              <p className="text-gray-400 text-sm">
                © {currentYear} Aspire Property Management. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end space-x-6">
              {footerConfig.links.legal.map((link, index) => (
                <Link key={index} href={link.href} className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
