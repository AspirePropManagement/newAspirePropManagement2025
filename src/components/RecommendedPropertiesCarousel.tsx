'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

interface NewProjectItem {
	id: string;
	project_name: string;
	project_location?: string;
	property_images?: {
		general_photos?: { exterior?: string[]; interior?: string[] };
		project_images?: { club_house?: string[]; swimming_pool?: string[]; gym?: string[] };
	};
}

interface RecommendedPropertiesCarouselProps {
	projects: NewProjectItem[];
}

/**
 * RecommendedPropertiesCarousel
 * Minimal carousel showing 2 items per slide on mobile, 5 on desktop (image + name) with auto-scroll.
 */
export function RecommendedPropertiesCarousel({ projects }: RecommendedPropertiesCarouselProps) {
  const [index, setIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(2);
  const slideCount = Math.max(1, Math.ceil(projects.length / itemsPerSlide));
  const maxIndex = Math.max(0, slideCount - 1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Update items per slide based on screen size
	useEffect(() => {
		const updateItemsPerSlide = () => {
			if (window.innerWidth < 768) {
				setItemsPerSlide(2); // Mobile: 2 items
			} else if (window.innerWidth < 1024) {
				setItemsPerSlide(3); // Tablet: 3 items
			} else {
				setItemsPerSlide(5); // Desktop: 5 items
			}
		};

		updateItemsPerSlide();
		window.addEventListener('resize', updateItemsPerSlide);
		return () => window.removeEventListener('resize', updateItemsPerSlide);
	}, []);

	useEffect(() => {
		// Auto-scroll every 4 seconds
		if (projects.length === 0) return;
		intervalRef.current = setInterval(() => {
			setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
		}, 4000);
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [projects.length, maxIndex]);

	const getPrimaryImage = (p: NewProjectItem): string => {
		const images = p.property_images;
		if (images?.general_photos?.exterior?.length) return images.general_photos.exterior[0]!;
		if (images?.project_images?.club_house?.length) return images.project_images.club_house[0]!;
		if (images?.project_images?.swimming_pool?.length) return images.project_images.swimming_pool[0]!;
		if (images?.project_images?.gym?.length) return images.project_images.gym[0]!;
		if (images?.general_photos?.interior?.length) return images.general_photos.interior[0]!;
		return '/placeholder-property.svg';
	};

  if (!projects || projects.length === 0) return null;

	return (
		<div className="bg-white border-t border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<div className="text-center mb-6">
					<h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Zero Brokerage Home</h2>
					<p className="text-sm sm:text-base text-gray-600">Discover premium properties with zero brokerage fees. Exclusive deals on verified projects.</p>
				</div>

				<div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {Array.from({ length: slideCount }, (_, slideIdx) => (
            <div key={slideIdx} className="w-full flex-shrink-0">
              <div className={`grid gap-3 sm:gap-4 ${
                itemsPerSlide === 2 ? 'grid-cols-2' :
                itemsPerSlide === 3 ? 'grid-cols-3' :
                'grid-cols-5'
              }`}>
                {Array.from({ length: itemsPerSlide }, (_, k) => {
                  const projIndex = slideIdx * itemsPerSlide + k;
                  if (projIndex >= projects.length) return null;
                  const proj = projects[projIndex];
                  return (
                    <Link
                      key={`${slideIdx}-${k}-${proj.id}`}
                      href={`/properties/new_project/${proj.id}`}
                      className="group rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="relative h-24 sm:h-28 md:h-32 bg-gray-100">
                        <Image
                          src={getPrimaryImage(proj)}
                          alt={proj.project_name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-property.svg';
                          }}
                        />
                        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2">
                          <span className="bg-green-600 text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium flex items-center shadow">
                            <CheckBadgeIcon className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 mr-0.5 sm:mr-1" />
                            <span className="hidden sm:inline">100% </span>Verified
                          </span>
                        </div>
                      </div>
                      <div className="p-1.5 sm:p-2">
                        <p className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-orange-600">
                          {proj.project_name}
                        </p>
                      </div>
                    </Link>
                  );
                }).filter(Boolean)}
              </div>
            </div>
          ))}
        </div>
				</div>
			</div>
		</div>
	);
}


