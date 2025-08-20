'use client'

import { useAuth } from '@/hooks/useAuth'
import { Footer } from '@/components/Footer'
import { PropertyDashboard } from '@/components/PropertyDashboard'
import { ImageCarousel } from '@/components/ImageCarousel'
import Link from 'next/link'

/**
 * Home page component that displays hero section and either property dashboard or welcome content
 * based on user authentication status
 */
export default function HomePage() {
  const { user, isAuthenticated, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Carousel */}
      <ImageCarousel />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {isAuthenticated && user ? (
          <PropertyDashboard />
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Find Your Dream
                <span className="text-orange-500 block">Property</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Discover premium properties, connect with real estate professionals, and find your perfect home. 
                Join thousands of satisfied customers who trust us with their property needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/properties" 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Browse Properties
                </Link>
                <Link 
                  href="/auth" 
                  className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Find Properties</h3>
                <p className="text-gray-600">Browse through our extensive collection of premium properties with detailed information and high-quality images.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Guidance</h3>
                <p className="text-gray-600">Get professional advice from certified real estate agents who understand your needs and market trends.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast & Secure</h3>
                <p className="text-gray-600">Quick transactions with bank-grade security and transparent processes throughout your property journey.</p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 mb-16 text-white">
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <div className="text-orange-100">Properties Listed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">1000+</div>
                  <div className="text-orange-100">Happy Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">50+</div>
                  <div className="text-orange-100">Expert Agents</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">5+</div>
                  <div className="text-orange-100">Years Experience</div>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Services</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">🏠</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Property Search</h3>
                  <p className="text-sm text-gray-600">Find your perfect property with advanced search filters</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">📋</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Property Listing</h3>
                  <p className="text-sm text-gray-600">List your property for sale or rent easily</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">👔</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Agent Services</h3>
                  <p className="text-sm text-gray-600">Connect with professional real estate agents</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">🏗️</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Construction</h3>
                  <p className="text-sm text-gray-600">Build your dream home with expert builders</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-12 text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join our platform and experience the difference in property management. 
                Whether you&apos;re buying, selling, or building, we have the perfect solution for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/auth" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Sign In to Continue
                </Link>
                <Link 
                  href="/auth?mode=signup" 
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                >
                  Create New Account
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
