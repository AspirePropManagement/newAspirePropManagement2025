'use client'

/**
 * HeroCarouselSkeleton component that displays a loading state for hero carousels
 * Uses daisyUI skeleton classes for consistent loading animation
 */
export function HeroCarouselSkeleton() {
  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
      {/* Main Carousel Image */}
      <div className="skeleton w-full h-full"></div>
      
      {/* Overlay Content */}
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl space-y-4">
            {/* Main Heading */}
            <div className="skeleton h-8 md:h-12 w-3/4"></div>
            
            {/* Subheading */}
            <div className="skeleton h-4 md:h-6 w-1/2"></div>
            
            {/* Description */}
            <div className="space-y-2">
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-2/3"></div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="skeleton h-10 w-32"></div>
              <div className="skeleton h-10 w-28"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <div className="skeleton h-10 w-10 rounded-full"></div>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <div className="skeleton h-10 w-10 rounded-full"></div>
      </div>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {[1, 2, 3, 4].map((index) => (
          <div 
            key={index} 
            className={`skeleton h-2 w-2 rounded-full ${
              index === 0 ? 'bg-white' : ''
            }`}
          ></div>
        ))}
      </div>
    </div>
  )
}

/**
 * HeroCarouselSlideSkeleton for individual carousel slides
 */
export function HeroCarouselSlideSkeleton() {
  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96">
      {/* Background Image */}
      <div className="skeleton w-full h-full"></div>
      
      {/* Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-xl space-y-4">
            <div className="skeleton h-8 w-3/4"></div>
            <div className="skeleton h-4 w-1/2"></div>
            <div className="space-y-2">
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-2/3"></div>
            </div>
            <div className="skeleton h-10 w-32"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * HeroCarouselThumbnailsSkeleton for carousel thumbnails
 */
export function HeroCarouselThumbnailsSkeleton() {
  return (
    <div className="flex space-x-2 mt-4">
      {[1, 2, 3, 4, 5].map((index) => (
        <div key={index} className="relative">
          <div className="skeleton w-16 h-12 rounded"></div>
          {index === 0 && (
            <div className="absolute inset-0 border-2 border-primary rounded"></div>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * HeroCarouselControlsSkeleton for carousel controls
 */
export function HeroCarouselControlsSkeleton() {
  return (
    <div className="flex items-center justify-between mt-4">
      {/* Previous Button */}
      <div className="skeleton h-8 w-8 rounded-full"></div>
      
      {/* Dots */}
      <div className="flex space-x-2">
        {[1, 2, 3, 4].map((index) => (
          <div 
            key={index} 
            className={`skeleton h-2 w-2 rounded-full ${
              index === 0 ? 'bg-primary' : ''
            }`}
          ></div>
        ))}
      </div>
      
      {/* Next Button */}
      <div className="skeleton h-8 w-8 rounded-full"></div>
    </div>
  )
}

/**
 * HeroCarouselContentSkeleton for carousel content areas
 */
export function HeroCarouselContentSkeleton() {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="skeleton h-8 w-3/4"></div>
      
      {/* Subtitle */}
      <div className="skeleton h-4 w-1/2"></div>
      
      {/* Description */}
      <div className="space-y-2">
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-2/3"></div>
      </div>
      
      {/* CTA Buttons */}
      <div className="flex gap-4 pt-2">
        <div className="skeleton h-10 w-32"></div>
        <div className="skeleton h-10 w-28"></div>
      </div>
    </div>
  )
}

/**
 * HeroCarouselFullSkeleton for complete hero carousel with all elements
 */
export function HeroCarouselFullSkeleton() {
  return (
    <div className="w-full">
      {/* Main Carousel */}
      <HeroCarouselSkeleton />
      
      {/* Thumbnails */}
      <HeroCarouselThumbnailsSkeleton />
      
      {/* Controls */}
      <HeroCarouselControlsSkeleton />
    </div>
  )
}
