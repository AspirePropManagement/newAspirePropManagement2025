'use client';

import React, { useState } from 'react';
import { PropertyImages } from '@/types/Property';
import Image from 'next/image';

interface VirtualTourSectionProps {
  images: PropertyImages;
  className?: string;
}

/**
 * Virtual tour section component that displays virtual tours, videos, and interactive content
 * with support for 360° views and video walkthroughs
 */
export function VirtualTourSection({ images, className = '' }: VirtualTourSectionProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get all virtual content
  const getVirtualContent = () => {
    const content: any[] = [];
    
    if (images.virtual_content) {
      Object.entries(images.virtual_content).forEach(([key, urls]) => {
        if (urls && urls.length > 0) {
          content.push({
            id: key,
            name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            urls: urls,
            type: 'video'
          });
        }
      });
    }

    return content;
  };

  const virtualContent = getVirtualContent();

  const handleVideoPlay = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setIsPlaying(true);
  };

  const handleVideoClose = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
  };

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Virtual Tour Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg sm:rounded-xl border border-purple-200 p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Virtual Experience</h3>
            <p className="text-xs sm:text-sm text-gray-600">Explore the property from anywhere with our virtual tours</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          <div className="text-center p-2 sm:p-3 bg-white/50 rounded-lg">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">{virtualContent.length}</div>
            <div className="text-[10px] sm:text-xs text-gray-600 mt-1">Virtual Tours</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-white/50 rounded-lg">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">360°</div>
            <div className="text-[10px] sm:text-xs text-gray-600 mt-1">Interactive Views</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-white/50 rounded-lg">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">HD</div>
            <div className="text-[10px] sm:text-xs text-gray-600 mt-1">High Quality</div>
          </div>
        </div>
      </div>

      {/* Virtual Content Categories */}
      {virtualContent.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {virtualContent.map((content) => (
            <div key={content.id} className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">{content.name}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {content.urls.map((url: string, index: number) => (
                  <div key={index} className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative bg-gray-100">
                      <Image
                        src={url}
                        alt={`${content.name} ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-opacity" />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={() => handleVideoPlay(url)}
                          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all transform group-hover:scale-110"
                        >
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Video Info */}
                      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                        <div className="bg-white bg-opacity-90 rounded-lg p-1.5 sm:p-2">
                          <p className="text-xs sm:text-sm font-medium text-gray-900">
                            {content.name} {index + 1}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-600">Click to play</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Virtual Tours Available</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">Virtual tours and videos will be available soon.</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
              Request Virtual Tour
            </button>
          </div>
        </div>
      )}

      {/* Interactive Features */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Interactive Features</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1">360° View</h4>
            <p className="text-[10px] sm:text-xs text-gray-600 line-clamp-2">Interactive panoramic views</p>
          </div>
          
          <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1">Video Walkthrough</h4>
            <p className="text-[10px] sm:text-xs text-gray-600 line-clamp-2">Guided property tours</p>
          </div>
          
          <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1">Drone Footage</h4>
            <p className="text-[10px] sm:text-xs text-gray-600 line-clamp-2">Aerial property views</p>
          </div>
          
          <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1">Floor Plans</h4>
            <p className="text-[10px] sm:text-xs text-gray-600 line-clamp-2">Interactive layouts</p>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-2 sm:p-4">
          <div className="relative w-full max-w-4xl max-h-full">
            <button
              onClick={handleVideoClose}
              className="absolute -top-2 -right-2 sm:top-4 sm:right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 sm:p-2.5 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative">
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] sm:max-h-[80vh] rounded-lg"
                onEnded={handleVideoClose}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
