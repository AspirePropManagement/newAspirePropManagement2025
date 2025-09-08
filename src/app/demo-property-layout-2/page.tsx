'use client';

import React from 'react';
import { PropertyLayout } from '@/components/PropertyLayout';
import { PropertyImages } from '@/types/Property';

/**
 * Second demo page showcasing a 3 BHK property layout UI
 * with different image categories and amenities
 */
export default function DemoPropertyLayout2Page() {
  // Sample property images for 3 BHK apartment
  const samplePropertyImages: PropertyImages = {
    general_photos: {
      exterior: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
      ],
      interior: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
      ],
      bedrooms: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
      ],
      kitchen: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
      ],
      bathrooms: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
      ],
      living_dining: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'
      ],
      balcony: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
      ],
      amenities: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'
      ]
    },
    floor_plans: {
      floor_plan: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
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
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
      ],
      gym: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'
      ],
      children_play_area: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
      ],
      park: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
      ],
      reception_lounge: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'
      ],
      banquet_hall: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
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

  // Sample property details for 3 BHK
  const propertyDetails = {
    id: 'demo-property-2',
    type: 'resale',
    title: 'Luxury 3 BHK Apartment - Premium Location',
    price: 15400000, // ₹1.54 Crore
    location: 'Baner, Pune',
    bhkType: '3 BHK',
    carpetArea: 1198,
    squareFeet: 1500,
    propertyType: 'Apartment',
    status: 'Ready to Move',
    description: 'Spacious 3 BHK apartment in a prime location with modern amenities and premium finishes. This ready-to-move property offers excellent connectivity, world-class facilities, and a perfect blend of comfort and luxury. The apartment features three well-designed bedrooms, modern kitchen, premium bathrooms, and a spacious living area with balcony access.'
  };

  // Sample amenities for 3 BHK
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
    'Meditation Area',
    'Library',
    'Business Center',
    'Guest Rooms',
    'Laundry Service',
    'Car Wash'
  ];

  // Sample specifications for 3 BHK
  const specifications = {
    'Construction Type': 'RCC Frame Structure',
    'Flooring': 'Marble & Vitrified Tiles',
    'Doors': 'Teak Wood with Hardware',
    'Windows': 'UPVC with Double Glazing',
    'Kitchen': 'Modular Kitchen with Granite',
    'Bathroom': 'Premium Fittings & Tiles',
    'Balcony': 'Open Balcony with Railing',
    'Parking': 'Covered Parking (2 Cars)',
    'Lift': 'High Speed Elevator (2 Nos)',
    'Power Backup': '100% Backup with Inverter',
    'Water Supply': '24/7 Supply with Filtration',
    'Security': '24/7 Security with CCTV',
    'Maintenance': 'Professional Management',
    'Air Conditioning': 'Pre-wired for AC',
    'Internet': 'Fiber Optic Ready',
    'Cable TV': 'DTH Ready',
    'Intercom': 'Video Intercom System'
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
