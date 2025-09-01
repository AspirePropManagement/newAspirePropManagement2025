'use client'

import React from 'react'
import Link from 'next/link'

/**
 * Blog page component that displays blog posts
 * Currently shows an empty state as no blog posts are available
 */
export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest real estate insights, market trends, and property tips
          </p>
        </div>

        {/* Empty State */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            {/* Empty State Icon */}
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg 
                className="w-10 h-10 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" 
                />
              </svg>
            </div>

            {/* Empty State Content */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Blog Posts Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We're working on creating valuable content for you. Check back soon for insightful articles about real estate, market trends, and property investment tips.
            </p>

            {/* Call to Action */}
            <div className="space-y-4">
              <Link 
                href="/properties-listing"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Properties
              </Link>
              <div className="text-sm text-gray-500">
                <p>Want to stay updated?</p>
                <p>Subscribe to our newsletter for the latest updates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup (Optional) */}
        <div className="max-w-md mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get notified when we publish new blog posts and market insights.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
