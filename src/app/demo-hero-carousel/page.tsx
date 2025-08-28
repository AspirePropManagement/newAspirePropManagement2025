import { HeroCarousel } from '../../components/HeroCarousel';

/**
 * Demo page for showcasing the hero carousel functionality
 * This page demonstrates how the carousel will look on the landing page
 */
export default function DemoHeroCarouselPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Hero Carousel Demo</h1>
          <p className="text-gray-600 mt-2">
            This page demonstrates how the hero carousel will appear on your landing page
          </p>
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="w-full">
        <HeroCarousel />
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to Aspire Properties
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience luxury living with our premium real estate offerings. 
            From stunning apartments to magnificent villas, we have the perfect 
            property waiting for you.
          </p>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Properties</h3>
              <p className="text-gray-600">Discover our curated collection of high-end properties</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Guidance</h3>
              <p className="text-gray-600">Get professional advice from our experienced agents</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Service</h3>
              <p className="text-gray-600">Quick and efficient property transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              How to Use the Hero Carousel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">For Admins:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Go to Admin Panel → Hero Carousel</li>
                  <li>• Upload new images with titles and descriptions</li>
                  <li>• Set display order and toggle active status</li>
                  <li>• Drag and drop to reorder images</li>
                  <li>• Edit or delete existing images</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">For Developers:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Import HeroCarousel component</li>
                  <li>• Customize props for auto-play, navigation</li>
                  <li>• Images automatically load from database</li>
                  <li>• Responsive design with mobile support</li>
                  <li>• Accessible with proper ARIA labels</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
