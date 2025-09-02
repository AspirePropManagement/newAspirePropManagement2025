'use client';

import React, { useState, useEffect } from 'react';

/**
 * ScrollArrow component with smart direction detection
 * Shows down arrow at top, up arrow at bottom with smooth scroll functionality
 */
export const ScrollArrow: React.FC = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Check if we're at the top (first 100px)
      const atTop = scrollTop < 100;
      // Check if we're at the bottom (last 100px)
      const atBottom = scrollTop + windowHeight >= documentHeight - 100;
      
      setIsAtTop(atTop);
      setIsVisible(!atBottom); // Hide arrow when at bottom
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Smooth scroll function
  const handleScrollClick = () => {
    if (isAtTop) {
      // Scroll to bottom of page
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    } else {
      // Scroll to top of page
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={handleScrollClick}
        className="group relative w-12 h-12 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-gray-200"
        aria-label={isAtTop ? "Scroll to bottom" : "Scroll to top"}
      >
        {/* Arrow Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className={`w-5 h-5 text-gray-700 group-hover:text-orange-500 transition-all duration-300 ${
              isAtTop ? 'rotate-0' : 'rotate-180'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>

        {/* Hover Effect Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-orange-500 group-hover:border-opacity-50 transition-all duration-300 scale-0 group-hover:scale-110"></div>
        
        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-orange-500 opacity-0 group-hover:opacity-20 animate-ping"></div>
      </button>
    </div>
  );
};
