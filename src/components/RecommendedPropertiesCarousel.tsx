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
 * Minimal carousel showing 5 items per slide (image + name) with auto-scroll.
 */
export function RecommendedPropertiesCarousel({ projects }: RecommendedPropertiesCarouselProps) {
  const [index, setIndex] = useState(0);
  const slideCount = Math.max(1, Math.ceil(projects.length / 5));
  const maxIndex = Math.max(0, slideCount - 1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recommended Properties</h2>
				</div>

				<div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {Array.from({ length: slideCount }, (_, slideIdx) => (
            <div key={slideIdx} className="w-full flex-shrink-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }, (_, k) => {
                  const proj = projects[(slideIdx * 5 + k) % projects.length];
                  return (
                    <Link
                      key={`${slideIdx}-${k}-${proj.id}`}
                      href={`/properties/new_project/${proj.id}`}
                      className="group rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="relative h-28 sm:h-32 bg-gray-100">
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
                        <div className="absolute bottom-2 left-2">
                          <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center shadow">
                            <CheckBadgeIcon className="w-3.5 h-3.5 mr-1" />
                            100% Verified
                          </span>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-orange-600">
                          {proj.project_name}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
				</div>
			</div>
		</div>
	);
}


