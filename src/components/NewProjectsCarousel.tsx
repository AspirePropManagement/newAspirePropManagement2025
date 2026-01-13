'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { extractPropertyImages, getImageSrc, isBase64Image } from '@/utils/imageUtils';

interface NewProject {
  id: string;
  project_name: string;
  project_type: string;
  construction_type: string;
  project_location: string;
  crafted_by: string;
  min_price?: number;
  starting_price?: number;
  available_bhk_types?: string[];
  property_images?: {
    general_photos?: {
      exterior?: string[];
      interior?: string[];
    };
    project_images?: {
      club_house?: string[];
      swimming_pool?: string[];
      gym?: string[];
    };
  };
  amenities?: {
    club_house?: boolean;
    swimming_pool?: boolean;
    gym?: boolean;
    children_play_area?: boolean;
    power_backup?: boolean;
    lift?: boolean;
    park?: boolean;
    security?: boolean;
  };
  status?: string;
  is_rera_approved?: boolean;
  created_at: string;
}

interface NewProjectsCarouselProps {
  projects: NewProject[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
  shuffle?: boolean;
}

/**
 * NewProjectsCarousel component displays new projects in a horizontal carousel
 * Shows 4 cards at a time with navigation controls
 */
export function NewProjectsCarousel({ projects, loading = false, title = 'New Projects', subtitle = 'Discover the latest real estate projects and investment opportunities in prime locations.', shuffle = false }: NewProjectsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(1);

  // Remove duplicates based on project ID, and also by project name + location if IDs are different
  const uniqueProjects = React.useMemo(() => {
    const seenIds = new Set<string>();
    const seenProjects = new Set<string>(); // For name + location deduplication
    
    const deduplicated = projects.filter((project) => {
      // First check by ID
      if (seenIds.has(project.id)) {
        console.log('Duplicate project found by ID:', project.id, project.project_name);
        return false;
      }
      
      // Also check by project name + location combination
      const projectKey = `${project.project_name?.toLowerCase().trim()}_${project.project_location?.toLowerCase().trim()}`;
      if (seenProjects.has(projectKey)) {
        console.log('Duplicate project found by name+location:', project.project_name, project.project_location);
        return false;
      }
      
      seenIds.add(project.id);
      seenProjects.add(projectKey);
      return true;
    });
    
    // Shuffle the array if shuffle prop is true
    if (shuffle) {
      const shuffled = [...deduplicated];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    
    console.log('Original projects count:', projects.length, 'Unique projects count:', deduplicated.length);
    return deduplicated;
  }, [projects, shuffle]);

  // Update cards per slide based on screen size
  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (window.innerWidth < 768) {
        setCardsPerSlide(1); // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setCardsPerSlide(2); // Tablet: 2 cards
      } else {
        setCardsPerSlide(3); // Desktop: 3 cards (wider cards)
      }
    };

    updateCardsPerSlide();
    window.addEventListener('resize', updateCardsPerSlide);
    return () => window.removeEventListener('resize', updateCardsPerSlide);
  }, []);

  // Calculate how many slides we need based on unique projects
  const totalSlides = Math.ceil(uniqueProjects.length / cardsPerSlide);
  const maxIndex = Math.max(0, totalSlides - 1);

  // Auto-scroll carousel (only if we have more than one slide)
  useEffect(() => {
    if (totalSlides <= 1 || loading || uniqueProjects.length <= cardsPerSlide) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000); // Auto-scroll every 5 seconds
    
    return () => clearInterval(interval);
  }, [totalSlides, maxIndex, loading, uniqueProjects.length, cardsPerSlide]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  /**
   * Gets all images for a project from all categories
   */
  const getProjectImages = (project: NewProject): string[] => {
    const images = extractPropertyImages(project);
    return images.length > 0 ? images : ['/placeholder-property.svg'];
  };

  /**
   * Gets the first few amenities for display
   */
  const getAmenities = (project: NewProject): string[] => {
    const amenities = project.amenities;
    if (!amenities) return [];
    
    const amenityList = [];
    if (amenities.club_house) amenityList.push('Club House');
    if (amenities.swimming_pool) amenityList.push('Swimming Pool');
    if (amenities.gym) amenityList.push('Gym');
    if (amenities.children_play_area) amenityList.push('Play Area');
    if (amenities.power_backup) amenityList.push('Power Backup');
    if (amenities.lift) amenityList.push('Lift');
    if (amenities.park) amenityList.push('Park');
    if (amenities.security) amenityList.push('Security');
    
    return amenityList.slice(0, 3); // Show only first 3 amenities
  };

  const formatPrice = (price?: number) => {
    if (!price || price <= 0) return 'Price on request';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lacs`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getConfig = (project: NewProject) => {
    if (project.available_bhk_types && project.available_bhk_types.length) {
      const map: Record<string, string> = {
        '1_rk': '1 RK',
        '1_bhk': '1 BHK',
        '2_bhk': '2 BHK',
        '3_bhk': '3 BHK',
        '4_bhk': '4 BHK',
        '5_bhk': '5 BHK',
        '5_plus_bhk': '5+ BHK'
      };
      return project.available_bhk_types.map(b => map[b] || b.replace('_', ' ').toUpperCase()).join(', ');
    }
    return project.project_type?.replace('_', ' ').toUpperCase() || 'Project';
  };

  if (loading) {
    return (
      <div className="py-2 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (uniqueProjects.length === 0 && !loading) {
    return (
      <div className="py-2 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">New Projects</h2>
          <p className="text-gray-600 mb-6">No new projects available at the moment.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-blue-800 text-sm">
              New projects will appear here once they are added to the system.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200"
                aria-label="Previous projects"
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200"
                aria-label="Next projects"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Projects Grid */}
          <div className="overflow-hidden w-full">
            <div 
              className="flex transition-transform duration-300 ease-in-out w-full"
              style={{ 
                transform: `translateX(-${currentIndex * 100}%)`,
                maxWidth: '100%'
              }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0" style={{ maxWidth: '100%' }}>
                  <div className={`grid gap-4 sm:gap-6 px-1 sm:px-2 pb-4 ${
                    cardsPerSlide === 1 ? 'grid-cols-1' :
                    cardsPerSlide === 2 ? 'grid-cols-1 md:grid-cols-2' :
                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  }`} style={{ maxWidth: '100%' }}>
                    {uniqueProjects
                      .slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide)
                      .map((project) => {
                        const projectImages = getProjectImages(project);
                        return (
                          <ProjectCardWithImageCarousel
                            key={project.id}
                            project={project}
                            images={projectImages}
                          />
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

/**
 * Project card component with image carousel
 */
function ProjectCardWithImageCarousel({ project, images }: { project: NewProject; images: string[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-scroll images
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    
    return () => clearInterval(interval);
  }, [images.length]);

  const formatPrice = (price?: number) => {
    if (!price || price <= 0) return 'Price on request';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lacs`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getConfig = (project: NewProject) => {
    if (project.available_bhk_types && project.available_bhk_types.length) {
      const map: Record<string, string> = {
        '1_rk': '1 RK',
        '1_bhk': '1 BHK',
        '2_bhk': '2 BHK',
        '3_bhk': '3 BHK',
        '4_bhk': '4 BHK',
        '5_bhk': '5 BHK',
        '5_plus_bhk': '5+ BHK'
      };
      return project.available_bhk_types.map(b => map[b] || b.replace('_', ' ').toUpperCase()).join(', ');
    }
    return project.project_type?.replace('_', ' ').toUpperCase() || 'Project';
  };

  return (
    <Link
      href={`/properties/new_project/${project.id}`}
      className="group bg-white rounded-t-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-gray-200 will-change-transform"
    >
      {/* Project Image Carousel */}
      <div className="relative h-48 overflow-hidden">
        <div className="relative w-full h-full">
          {images.map((imageSrc, index) => (
            <Image
              key={index}
              src={getImageSrc(imageSrc)}
              alt={project.project_name}
              fill
              className={`object-cover transition-opacity duration-500 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0 absolute'
              }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-property.svg';
              }}
              unoptimized={isBase64Image(imageSrc)}
            />
          ))}
        </div>
        {/* Soft overlay on hover for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* RERA Approved Badge - Always shown for new projects */}
        <div className="absolute top-2 left-2">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-green-600 text-white flex items-center shadow-sm">
            <CheckBadgeIcon className="w-2.5 h-2.5 mr-0.5" />
            RERA
          </span>
        </div>
        {/* Construction Type Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-orange-600 text-white shadow-sm">
            {project.construction_type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        {/* Image Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3">
            <div className="flex space-x-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white w-4' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Project Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
          {project.project_name}
        </h3>

        {/* Config */}
        <p className="text-sm text-gray-700 mb-1">
          {getConfig(project)}
        </p>

        {/* Price */}
        <p className="text-base font-bold text-gray-900 mb-2">
          {formatPrice(project.min_price || project.starting_price)}
        </p>
        
        {/* Location */}
        <p className="text-sm text-gray-600 flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {project.project_location}
        </p>
      </div>
    </Link>
  );
}
