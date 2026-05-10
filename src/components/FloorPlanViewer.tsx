'use client';

import React, { useState } from 'react';
import { PropertyImages } from '@/types/Property';
import Image from 'next/image';
import { getImageSrc, isBase64Image } from '@/utils/imageUtils';

interface FloorPlanViewerProps {
  images: PropertyImages;
  className?: string;
}

/**
 * Floor plan viewer component that displays floor plans, master plans, and layouts
 * with zoom and pan functionality
 */
export function FloorPlanViewer({ images, className = '' }: FloorPlanViewerProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Get all available floor plan images
  const getFloorPlanImages = () => {
    const plans: any[] = [];

    // Parse floor_plans if stored as a JSON string (defensive — JSONB usually comes parsed)
    let floorPlansData: any = images.floor_plans;
    if (typeof floorPlansData === 'string') {
      try {
        floorPlansData = JSON.parse(floorPlansData);
      } catch {
        floorPlansData = null;
      }
    }

    if (floorPlansData && typeof floorPlansData === 'object') {
      // If it's an array directly (e.g., flat list of floor plan URLs), wrap it.
      if (Array.isArray(floorPlansData)) {
        if (floorPlansData.length > 0) {
          plans.push({
            id: 'floor_plan',
            name: 'Floor Plan',
            images: floorPlansData,
            type: 'floor_plan'
          });
        }
      } else {
        Object.entries(floorPlansData).forEach(([key, urls]) => {
          const list = Array.isArray(urls) ? urls : (urls ? [urls] : []);
          if (list.length > 0) {
            plans.push({
              id: key,
              name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              images: list,
              type: 'floor_plan'
            });
          }
        });
      }
    }

    return plans;
  };

  const floorPlans = getFloorPlanImages();
  const currentPlan = floorPlans.find(plan => plan.id === selectedPlan);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Floor Plan Categories */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Floor Plans & Layouts</h3>
        <div className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2">
          {floorPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                selectedPlan === plan.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {plan.name}
              <span className="ml-1.5 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                {plan.images.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Floor Plan Viewer */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            {currentPlan ? currentPlan.name : 'Select a Floor Plan'}
          </h3>
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
              className="p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-xs sm:text-sm text-gray-600 min-w-[2.5rem] sm:min-w-[3rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.1))}
              className="p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={resetView}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm whitespace-nowrap"
            >
              Reset
            </button>
          </div>
        </div>

        {currentPlan ? (
          <div className="space-y-3 sm:space-y-4">
            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              {currentPlan.images.map((imageUrl: string, index: number) => (
                <div
                  key={index}
                  className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedPlan(currentPlan.id)}
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={getImageSrc(imageUrl)}
                      alt={`${currentPlan.name} ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized={isBase64Image(imageUrl)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white bg-opacity-90 rounded-full p-1">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Viewer */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-3 sm:px-4 py-2 border-b border-gray-200">
                <h4 className="text-xs sm:text-sm font-medium text-gray-700">Interactive Viewer</h4>
                <p className="text-[10px] sm:text-xs text-gray-500">Click and drag to pan, scroll to zoom</p>
              </div>
              <div
                className="relative h-64 sm:h-80 md:h-96 bg-gray-100 overflow-hidden cursor-grab active:cursor-grabbing touch-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              >
                {currentPlan.images[0] && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                      transformOrigin: 'center center'
                    }}
                  >
                    <Image
                      src={getImageSrc(currentPlan.images[0])}
                      alt={`${currentPlan.name} - Interactive View`}
                      width={800}
                      height={600}
                      className="max-w-full max-h-full object-contain"
                      unoptimized={isBase64Image(currentPlan.images[0])}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Floor Plans Available</h3>
            <p className="text-sm sm:text-base text-gray-500">No floor plans have been uploaded for this property.</p>
          </div>
        )}
      </div>

      {/* Full Screen Modal */}
      {selectedPlan && currentPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-2 sm:p-4">
          <div className="relative w-full max-w-6xl max-h-full">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute -top-2 -right-2 sm:top-4 sm:right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 sm:p-2.5 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative">
              <Image
                src={getImageSrc(currentPlan.images[0])}
                alt={`${currentPlan.name} - Full Size`}
                width={1200}
                height={800}
                className="max-w-full max-h-[85vh] sm:max-h-[80vh] object-contain rounded-lg"
                unoptimized={isBase64Image(currentPlan.images[0])}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
