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
import waSvg from '@/app/whatsapp.svg'

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
              <Image
                src="/Aspire logo.png"
                alt="Aspire Prop Management"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl"
              />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  <span className="text-white">{footerConfig.company.name.split(' ')[0]}</span>
                  <span className="text-orange-500"> {footerConfig.company.name.split(' ').slice(1).join(' ')}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 font-medium">{footerConfig.company.tagline}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base mx-auto sm:mx-0">
              {footerConfig.company.description}
            </p>
            
            {/* Social Media Links */}
            <div className="flex justify-center sm:justify-start space-x-3 sm:space-x-4 flex-wrap">
              {/* Facebook */}
              <a 
                href="https://www.facebook.com/share/1FzPZxKMY3/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-all duration-300 transform hover:scale-110 text-white"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.495v-9.294H9.691V11.01h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.505 0-1.797.716-1.797 1.766v2.314h3.592l-.468 3.696h-3.124V24h6.126C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z" />
                </svg>
              </a>
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/aspirepropmanagement?igsh=MWtya3gyb2t5NDV1cA==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-all duration-300 transform hover:scale-110 text-white"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/aspire-prop-management-349354337?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-all duration-300 transform hover:scale-110 text-white"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a 
                href="https://wa.me/919226254182" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-all duration-300 transform hover:scale-110 text-white"
                aria-label="WhatsApp"
              >
                <Image src={waSvg} alt="WhatsApp" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5 invert" />
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
                  © {currentYear} Aspire Prop Management. All rights reserved.
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
