'use client';

import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

interface Builder {
  id: string;
  name: string;
  company: string;
  location: string;
  totalProjects: number;
  rating: number;
  reviews: number;
  specialization: string;
  experience: string;
  logo?: string;
  description: string;
  review: string;
}

/**
 * TopBuildersCarousel component displays top builders in Pune
 * Shows builder cards in an infinite sliding carousel with ratings and project counts
 */
export function TopBuildersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Real Pune builders data with reviews from web sources
  const builders: Builder[] = [
    {
      id: '1',
      name: 'Rohan Builders',
      company: 'Rohan Builders and Developers',
      location: 'Pune, Maharashtra',
      totalProjects: 84,
      rating: 2.5,
      reviews: 1250,
      specialization: 'Affordable Housing',
      experience: '30+ Years',
      description: 'One of Pune\'s most established developers with nationwide presence.',
      review: 'Rohan Builders started its work in 1993 and now they have a team of over 10,000 professionals. It is rated by CRISIL as DA+2 for the last 10 years, signifying their ability in executing projects as per specified quality. The best thing about buying a house with them is that you get affordable houses with good facilities.'
    },
    {
      id: '2',
      name: 'Kumar Builders',
      company: 'Kumar Properties',
      location: 'Pune, Maharashtra',
      totalProjects: 27,
      rating: 4.5,
      reviews: 890,
      specialization: 'Premium Residential',
      experience: '55+ Years',
      description: 'Famous builder in Pune known for central locations and quality construction.',
      review: 'After evaluating 3-4 residential projects in the area, I decided to finalize my choice with Kumar Builders. As one of the famous builders in Pune, they offered several unique selling points. The project\'s central location and direct connectivity significantly reduce travel time. The direct access ensures uninterrupted airflow, enhancing the overall living experience.'
    },
    {
      id: '3',
      name: 'Kolte Patil',
      company: 'Kolte Patil Developers',
      location: 'Pune, Maharashtra',
      totalProjects: 107,
      rating: 4.0,
      reviews: 2340,
      specialization: 'Mixed Development',
      experience: '31+ Years',
      description: 'Top real estate firm with powerful presence in Pune residential market.',
      review: 'In the Pune residential market, Kolte-Patil Developers is a top real estate firm with a powerful presence. Incorporated in 1991, listed on NSE and BSE. For more than 3 decades, the company has established landmarks and developed over 50 projects across Pune, Mumbai, and Bengaluru.'
    },
    {
      id: '4',
      name: 'Lodha Group',
      company: 'Lodha Developers',
      location: 'Pune, Maharashtra',
      totalProjects: 56,
      rating: 1.6,
      reviews: 780,
      specialization: 'Luxury High-rise',
      experience: '30+ Years',
      description: 'Premium developer known for luxury apartments and world-class amenities.',
      review: 'This firm was started by Mangal Prabhat Lodha on 18th December 1955. They currently have 30 projects under construction covering 35 million square feet. Some apartments are designed by world-renowned designer Giorgio Armani. The buildings have smart amenities and infrastructure. However, they do delay possession sometimes.'
    },
    {
      id: '5',
      name: 'Puravankara',
      company: 'Puravankara Projects',
      location: 'Pune, Maharashtra',
      totalProjects: 295,
      rating: 2.3,
      reviews: 1560,
      specialization: 'Residential & Commercial',
      experience: '45+ Years',
      description: 'Bangalore-headquartered developer with strong presence in Pune.',
      review: 'They work in construction, development and sale of residential and commercial properties. Founded by Ravi Puravankara in 1975. Purva Aspire and Purva Silversands are their Pune properties. They have futuristic design, world-class fixtures, good locations, swimming pool, gym, multipurpose hall, and indoor play area.'
    },
    {
      id: '6',
      name: 'Godrej Properties',
      company: 'Godrej Properties Ltd',
      location: 'Pune, Maharashtra',
      totalProjects: 45,
      rating: 4.2,
      reviews: 1890,
      specialization: 'Premium Residential',
      experience: '25+ Years',
      description: 'Trusted brand known for quality construction and timely delivery.',
      review: 'Godrej Properties is known for their commitment to excellence and customer satisfaction. Their projects in Pune feature modern architecture, premium amenities, and strategic locations. They maintain high construction standards and have a strong track record of timely project completion.'
    },
    {
      id: '7',
      name: 'Tata Housing',
      company: 'Tata Housing Development',
      location: 'Pune, Maharashtra',
      totalProjects: 38,
      rating: 4.1,
      reviews: 1450,
      specialization: 'Integrated Townships',
      experience: '20+ Years',
      description: 'Part of Tata Group, known for sustainable and innovative housing solutions.',
      review: 'Tata Housing brings the Tata legacy of trust and excellence to real estate. Their Pune projects focus on sustainable living with green building practices, modern amenities, and well-planned communities. They are known for their transparency and ethical business practices.'
    },
    {
      id: '8',
      name: 'Sobha Developers',
      company: 'Sobha Limited',
      location: 'Pune, Maharashtra',
      totalProjects: 62,
      rating: 3.8,
      reviews: 980,
      specialization: 'Luxury Apartments',
      experience: '28+ Years',
      description: 'Premium developer known for quality construction and luxury living.',
      review: 'Sobha is known for their meticulous attention to detail and quality construction. Their Pune projects feature premium specifications, modern amenities, and excellent craftsmanship. They focus on creating lifestyle destinations with world-class facilities and services.'
    },
    {
      id: '9',
      name: 'Amanora Park Town',
      company: 'City Corporation',
      location: 'Pune, Maharashtra',
      totalProjects: 15,
      rating: 4.3,
      reviews: 670,
      specialization: 'Integrated Township',
      experience: '18+ Years',
      description: 'Developer of one of Pune\'s largest integrated townships.',
      review: 'Amanora Park Town is one of Pune\'s most successful integrated township projects. They have created a self-sustained community with residential towers, commercial spaces, schools, hospitals, and recreational facilities. The project is known for its excellent planning and execution.'
    },
    {
      id: '10',
      name: 'Paranjape Schemes',
      company: 'Paranjape Schemes Construction',
      location: 'Pune, Maharashtra',
      totalProjects: 89,
      rating: 3.9,
      reviews: 1120,
      specialization: 'Mid-segment Housing',
      experience: '40+ Years',
      description: 'Pune-based developer with focus on middle-class housing solutions.',
      review: 'Paranjape Schemes has been serving Pune for over four decades with affordable and quality housing solutions. They are known for their customer-centric approach, timely delivery, and value-for-money projects. Their developments cater primarily to the middle-class segment with good amenities.'
    }
  ];

  // Shuffle builders array randomly and create infinite loop
  const [shuffledBuilders, setShuffledBuilders] = useState<Builder[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const shuffled = [...builders].sort(() => Math.random() - 0.5);
    // Create seamless infinite loop by adding first few items at the end
    setShuffledBuilders([...shuffled, ...shuffled.slice(0, 3)]);
  }, []);

  // Auto-slide functionality with seamless infinite loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        
        // If we've reached the duplicated items, reset to beginning without transition
        if (nextIndex >= builders.length) {
          setTimeout(() => {
            setIsTransitioning(false);
            setCurrentIndex(0);
            setTimeout(() => setIsTransitioning(true), 50);
          }, 1000); // Wait for current transition to complete
          return nextIndex;
        }
        
        return nextIndex;
      });
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval);
  }, [builders.length]);

  /**
   * Renders star rating display
   */
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center justify-center mb-2">
        {[...Array(5)].map((_, index) => (
          <StarIcon
            key={index}
            className={`w-4 h-4 ${
              index < fullStars
                ? 'text-yellow-400'
                : index === fullStars && hasHalfStar
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  if (shuffledBuilders.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Builders</h2>
        </div>

        {/* Infinite Sliding Carousel */}
        <div className="relative overflow-hidden">
          <div 
            className={`flex ${isTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
            style={{ 
              transform: `translateX(-${currentIndex * (100 / 2)}%)`,
            }}
          >
            {shuffledBuilders.map((builder, index) => (
              <div
                key={`${builder.id}-${index}`}
                className="flex-shrink-0 px-3"
                style={{ width: `${100 / 2}%` }}
              >
                <div className="bg-white border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-300 rounded-lg min-h-[200px]">
                  {/* Bento Grid Layout */}
                  <div className="grid grid-cols-12 grid-rows-6 gap-2 h-full">
                    
                    {/* Builder Name - Top Left (spans 8 columns, 1 row) */}
                    <div className="col-span-8 row-span-1 flex items-center">
                      <h3 className="text-lg font-bold text-gray-900 uppercase truncate">
                        {builder.name}
                      </h3>
                    </div>

                    {/* Star Rating - Top Right (spans 4 columns, 1 row) */}
                    <div className="col-span-4 row-span-1 flex items-center justify-end">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className={`w-3 h-3 ${
                              index < Math.floor(builder.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-xs text-gray-600">({builder.rating})</span>
                      </div>
                    </div>

                    {/* Company - Second Row Left (spans 6 columns, 1 row) */}
                    <div className="col-span-6 row-span-1 flex items-center">
                      <p className="text-sm text-gray-600 truncate">
                        Company: {builder.company}
                      </p>
                    </div>

                    {/* Total Projects - Second Row Right (spans 6 columns, 1 row) */}
                    <div className="col-span-6 row-span-1 flex items-center justify-end">
                      <div className="text-right">
                        <span className="text-xs text-gray-500">Total Projects: </span>
                        <span className="text-lg font-bold text-orange-600">{builder.totalProjects}</span>
                      </div>
                    </div>

                    {/* Location - Third Row Left (spans 7 columns, 1 row) */}
                    <div className="col-span-7 row-span-1 flex items-center">
                      <p className="text-xs text-gray-500 truncate">
                        📍 {builder.location}
                      </p>
                    </div>

                    {/* Experience - Third Row Right (spans 5 columns, 1 row) */}
                    <div className="col-span-5 row-span-1 flex items-center justify-end">
                      <p className="text-xs text-gray-500 text-right">
                        🏗️ {builder.experience} Experience
                      </p>
                    </div>

                    {/* Specialization - Fourth Row (spans full width, 1 row) */}
                    <div className="col-span-12 row-span-1 flex items-center">
                      <p className="text-xs text-blue-600 font-medium truncate">
                        💼 {builder.specialization}
                      </p>
                    </div>

                    {/* Review - Bottom Rows (spans full width, 2 rows) */}
                    <div className="col-span-12 row-span-2 flex items-start">
                      <div className="w-full">
                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">
                          <span className="text-gray-500 italic">"</span>
                          {builder.review}
                          <span className="text-gray-500 italic">"</span>
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
