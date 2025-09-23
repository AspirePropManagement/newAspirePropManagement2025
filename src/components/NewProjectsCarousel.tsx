'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

interface NewProject {
  id: string;
  project_name: string;
  project_type: string;
  construction_type: string;
  project_location: string;
  crafted_by: string;
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
  created_at: string;
}

interface NewProjectsCarouselProps {
  projects: NewProject[];
}

/**
 * NewProjectsCarousel component displays new projects in a horizontal carousel
 * Shows 4 cards at a time with navigation controls
 */
export function NewProjectsCarousel({ projects }: NewProjectsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate how many slides we need
  const totalSlides = Math.ceil(projects.length / 4);
  const maxIndex = Math.max(0, totalSlides - 1);

  useEffect(() => {
    if (projects.length > 0) {
      setIsLoading(false);
    }
  }, [projects]);

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
   * Gets the primary image for a project
   * Prioritizes exterior photos, then project images, then general photos
   */
  const getProjectImage = (project: NewProject): string => {
    const images = project.property_images;
    
    // Try exterior photos first
    if (images?.general_photos?.exterior?.length) {
      return images.general_photos.exterior[0];
    }
    
    // Try project images
    if (images?.project_images?.club_house?.length) {
      return images.project_images.club_house[0];
    }
    if (images?.project_images?.swimming_pool?.length) {
      return images.project_images.swimming_pool[0];
    }
    if (images?.project_images?.gym?.length) {
      return images.project_images.gym[0];
    }
    
    // Try interior photos
    if (images?.general_photos?.interior?.length) {
      return images.general_photos.interior[0];
    }
    
    // Default placeholder
    return '/placeholder-property.svg';
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

  if (isLoading) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

  if (projects.length === 0) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">New Projects</h2>
          <p className="text-gray-600">No new projects available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">New Projects</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the latest real estate projects and investment opportunities in prime locations.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200"
                aria-label="Previous projects"
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200"
                aria-label="Next projects"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Projects Grid */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                    {projects
                      .slice(slideIndex * 4, (slideIndex + 1) * 4)
                      .map((project) => (
                        <Link
                          key={project.id}
                          href={`/properties/new_project/${project.id}`}
                          className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
                        >
                          {/* Project Image */}
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={getProjectImage(project)}
                              alt={project.project_name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-property.svg';
                              }}
                            />
                          {/* Verified Badge */}
                          <div className="absolute bottom-3 left-3">
                            <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center shadow">
                              <CheckBadgeIcon className="w-3.5 h-3.5 mr-1 text-white" />
                              100% Verified
                            </span>
                          </div>
                            {/* Status Badge */}
                            {project.status && (
                              <div className="absolute top-3 left-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  project.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {project.status}
                                </span>
                              </div>
                            )}
                            {/* Construction Type Badge */}
                            <div className="absolute top-3 right-3">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                {project.construction_type.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* Project Details */}
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                              {project.project_name}
                            </h3>
                            
                            <p className="text-sm text-gray-600 mb-2 flex items-center">
                              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {project.project_location}
                            </p>

                            <p className="text-sm text-gray-500 mb-3">
                              by {project.crafted_by}
                            </p>

                            {/* Amenities */}
                            {getAmenities(project).length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {getAmenities(project).map((amenity, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                  >
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Project Type */}
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-orange-600">
                                {project.project_type.replace('_', ' ').toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(project.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentIndex
                      ? 'bg-orange-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
