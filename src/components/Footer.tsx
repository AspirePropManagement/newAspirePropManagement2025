'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  HeartIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline'
import { footerConfig } from '@/config/footerConfig'
import { useAuth } from '@/hooks/useAuth'

/**
 * Footer component for the application
 * Provides consistent footer across all pages with company information and links
 */
export function Footer() {
  const currentYear = new Date().getFullYear()
  const { isAuthenticated } = useAuth()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isAuthenticated ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-4 sm:gap-6 lg:gap-8 text-center sm:text-left`}>
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <HomeIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  <span className="text-white">{footerConfig.company.name.split(' ')[0]}</span>
                  <span className="text-orange-500">{footerConfig.company.name.split(' ')[1]}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 font-medium">{footerConfig.company.tagline}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base mx-auto sm:mx-0">
              {footerConfig.company.description}
            </p>
            
            {/* Social Media Links */}
            <div className="flex justify-center sm:justify-start space-x-3 sm:space-x-4 flex-wrap">
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-all duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links - Only show for authenticated users */}
          {isAuthenticated && (
            <div className="text-center sm:text-left">
              <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-orange-500 flex items-center justify-center sm:justify-start">
                <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Quick Links
              </h4>
              <ul className="space-y-3">
                {footerConfig.links.quick.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="text-gray-300 hover:text-orange-500 transition-colors inline-flex items-center justify-center sm:justify-start group">
                      <HomeIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Services */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-orange-500 flex items-center justify-center sm:justify-start">
              <BuildingOfficeIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-orange-500 flex items-center justify-center sm:justify-start">
              <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Contact Us
            </h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start justify-center sm:justify-start space-x-3">
                <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-xs sm:text-sm">Email</p>
                  <a href="mailto:aspireprop07@gmail.com" className="text-gray-300 hover:text-orange-500 transition-colors text-xs sm:text-sm break-all">
                    aspireprop07@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start justify-center sm:justify-start space-x-3">
                <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-xs sm:text-sm">Phone</p>
                  <a href="tel:+919226254182" className="text-gray-300 hover:text-orange-500 transition-colors text-xs sm:text-sm">
                    +91 92262 54182
                  </a>
                </div>
              </div>
              <div className="flex items-start justify-center sm:justify-start space-x-3">
                <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-xs sm:text-sm">Address</p>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    {footerConfig.contact.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
                  <div className="flex flex-col items-center sm:col-span-2 lg:col-span-1 mt-6 sm:mt-0">
            <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-orange-500 flex items-center justify-center">
              <QrCodeIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Scan & Connect
            </h4>
            <div className="bg-white p-2 sm:p-3 rounded-lg shadow-lg">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white rounded flex items-center justify-center">
                <Image
                  src="/scancode.jpg"
                  alt="QR Code - Scan to visit our website"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2 sm:mt-3 text-center">
              Scan to know about me
            </p>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <HeartIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
                  © {currentYear} Aspire Property Management. All rights reserved.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full"></div>
                <p className="text-gray-400 text-xs sm:text-sm font-medium text-center sm:text-left">
                  Maha RERA NO: A031262501205
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
