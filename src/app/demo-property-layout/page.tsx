'use client';

import React from 'react';
import { PropertyLayout } from '@/components/PropertyLayout';
import { PropertyImages } from '@/types/Property';

/**
 * Demo page showcasing the complete property layout UI
 * with sample data matching the Greenfront project structure
 */
export default function DemoPropertyLayoutPage() {
  // Sample property images matching Greenfront project structure
  const samplePropertyImages: PropertyImages = {
    general_photos: {
      exterior: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'
      ],
      interior: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'
      ],
      bedrooms: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'
      ],
      kitchen: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
      ],
      bathrooms: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'
      ],
      living_dining_balcony: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
      ],
      amenities: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
      ]
    },
    floor_plans: {
      floor_plan: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      ],
      site_plan: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      ],
      master_plan: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      ],
      blueprint: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      ],
      elevation: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      ],
      layout_2d: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      ],
      layout_3d: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      ]
    },
    project_images: {
      club_house: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
      ],
      swimming_pool: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
      ],
      gym: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
      ],
      children_play_area: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'
      ],
      park: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
      ],
      reception_lounge: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
      ],
      banquet_hall: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'
      ],
      retail_area: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
      ],
      parking_area: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
      ]
    },
    legal_docs: {
      rera_certificate: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      ],
      approval_documents: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      ],
      legal_documents: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      ],
      brochures: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      ]
    },
    virtual_content: {
      virtual_tour: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      ],
      video_walkthrough: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      ],
      drone_footage: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      ],
      promotional_videos: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      ]
    }
  };

  // Sample property details
  const propertyDetails = {
    id: 'demo-property-1',
    type: 'new-projects',
    title: 'The Greenfront at Godrej Park World',
    price: 11800000, // ₹1.18 Crore
    location: 'Hinjawadi Phase 1, Pune',
    bhkType: '2 BHK',
    carpetArea: 944,
    squareFeet: 1200,
    propertyType: 'Apartment',
    status: 'Available',
    description: 'Experience luxury living at The Greenfront, a premium residential project by Godrej Properties. This 2 BHK apartment offers modern amenities, spacious interiors, and a prime location in Hinjawadi Phase 1. The project features world-class facilities including a clubhouse, swimming pool, gymnasium, and beautifully landscaped gardens.'
  };

  // Sample amenities
  const amenities = [
    'Swimming Pool',
    'Gymnasium',
    'Club House',
    'Children Play Area',
    'Park',
    'Security',
    'Power Backup',
    'Lift Access',
    'Parking',
    'Housekeeping',
    'Maintenance',
    'Concierge',
    'Water Supply',
    'Gas Pipeline',
    'Rainwater Harvesting',
    'Sewage Treatment',
    'Solar Power',
    'Waste Management',
    'Fire Safety',
    'Emergency Response',
    'Access Control',
    'Visitor Management',
    'Spa & Wellness',
    'Banquet Hall',
    'Café & Restaurant',
    'Sports Court',
    'Jogging Track',
    'Garden & Landscaping',
    'Party Lawn',
    'Meditation Area'
  ];

  // Sample specifications
  const specifications = {
    'Construction Type': 'RCC Frame Structure',
    'Flooring': 'Vitrified Tiles',
    'Doors': 'Teak Wood',
    'Windows': 'Aluminum with Glass',
    'Kitchen': 'Modular Kitchen',
    'Bathroom': 'Premium Fittings',
    'Balcony': 'Open Balcony',
    'Parking': 'Covered Parking',
    'Lift': 'High Speed Elevator',
    'Power Backup': '100% Backup',
    'Water Supply': '24/7 Supply',
    'Security': '24/7 Security',
    'Maintenance': 'Professional Management'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PropertyLayout
        propertyImages={samplePropertyImages}
        propertyDetails={propertyDetails}
        amenities={amenities}
        specifications={specifications}
      />
    </div>
  );
}
