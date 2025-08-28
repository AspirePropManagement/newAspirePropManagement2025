# Hero Carousel System

A comprehensive image carousel management system for the Aspire Properties landing page hero section.

## Features

### 🖼️ **Image Management**
- Upload images as base64 strings
- Support for JPEG, PNG, WebP formats
- Automatic file size calculation
- Image preview during upload

### 🎯 **Content Control**
- Custom titles and descriptions for each image
- Alt text for accessibility
- Display order management
- Active/inactive status toggle

### 🎮 **User Experience**
- Drag & drop reordering
- Responsive grid layout
- Real-time preview
- Intuitive admin interface

### 🔒 **Security & Permissions**
- Admin-only access
- Role-based protection
- Secure image storage
- User activity tracking

## Database Schema

The system uses a dedicated `hero_carousel_images` table:

```sql
CREATE TABLE hero_carousel_images (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_data TEXT NOT NULL, -- Base64 encoded
    image_type VARCHAR(100) NOT NULL,
    file_size INTEGER,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    alt_text VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);
```

## Components

### 1. HeroCarouselManager
**Location**: `src/components/HeroCarouselManager.tsx`
**Purpose**: Admin interface for managing carousel images

**Features**:
- Image upload with drag & drop
- Grid view of all images
- Edit/delete functionality
- Status toggle (active/inactive)
- Drag & drop reordering

### 2. HeroCarousel
**Location**: `src/components/HeroCarousel.tsx`
**Purpose**: Public display component for landing page

**Features**:
- Auto-play with configurable interval
- Navigation arrows
- Indicator dots
- Progress bar
- Responsive design
- Accessibility support

## Services

### HeroCarouselService
**Location**: `src/lib/heroCarouselService.ts`
**Purpose**: Backend operations for carousel management

**Methods**:
- `getAllImages()` - Fetch all images
- `getActiveImages()` - Fetch only active images
- `createImage()` - Upload new image
- `updateImage()` - Modify existing image
- `deleteImage()` - Remove image
- `toggleImageStatus()` - Toggle active status
- `reorderImages()` - Update display order

## Hooks

### useHeroCarousel
**Location**: `src/hooks/useHeroCarousel.ts`
**Purpose**: React hook for state management

**State**:
- `images` - Array of carousel images
- `loading` - Loading state
- `error` - Error handling

**Functions**:
- All CRUD operations
- Status management
- Reordering functionality

## Usage

### For Admins

1. **Access**: Navigate to Admin Panel → Hero Carousel
2. **Upload**: Click "Add Image" and select image file
3. **Configure**: Set title, description, alt text, and display order
4. **Manage**: Edit, delete, or toggle status of existing images
5. **Reorder**: Drag and drop images to change display order

### For Developers

1. **Import Component**:
```tsx
import { HeroCarousel } from '../components/HeroCarousel';
```

2. **Basic Usage**:
```tsx
<HeroCarousel />
```

3. **Customized Usage**:
```tsx
<HeroCarousel
  autoPlay={true}
  autoPlayInterval={3000}
  showNavigation={true}
  showIndicators={true}
  className="custom-class"
/>
```

## File Structure

```
src/
├── components/
│   ├── HeroCarouselManager.tsx    # Admin interface
│   └── HeroCarousel.tsx          # Public display
├── hooks/
│   └── useHeroCarousel.ts        # State management
├── lib/
│   └── heroCarouselService.ts    # Backend operations
├── types/
│   └── HeroCarousel.ts           # TypeScript interfaces
└── app/
    ├── admin/
    │   └── hero-carousel/        # Admin page
    └── demo-hero-carousel/       # Demo page
```

## API Endpoints

The system integrates with Supabase and provides these operations:

- **GET** `/hero_carousel_images` - Fetch all images
- **GET** `/hero_carousel_images?is_active=true` - Fetch active images
- **POST** `/hero_carousel_images` - Create new image
- **PUT** `/hero_carousel_images/:id` - Update image
- **DELETE** `/hero_carousel_images/:id` - Delete image

## Styling

The system uses Tailwind CSS with:
- Responsive grid layouts
- Hover effects and transitions
- Consistent spacing and typography
- Mobile-first design approach
- Accessible color contrasts

## Performance Considerations

- Images are stored as base64 for immediate display
- Lazy loading for better performance
- Optimized database queries with indexes
- Efficient state management with React hooks
- Minimal re-renders with proper memoization

## Security Features

- Admin-only access control
- Role-based permissions
- Input validation and sanitization
- Secure file handling
- User activity logging

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Touch-friendly interactions
- Progressive enhancement

## Troubleshooting

### Common Issues

1. **Images not loading**: Check database connection and permissions
2. **Upload failures**: Verify file size and format restrictions
3. **Permission errors**: Ensure user has admin role
4. **Display issues**: Check responsive breakpoints and CSS

### Debug Mode

Enable console logging for debugging:
```tsx
// In HeroCarousel component
console.log('Carousel images:', images);
console.log('Current index:', currentIndex);
```

## Future Enhancements

- Image compression and optimization
- Multiple image formats support
- Advanced animation effects
- Analytics and performance metrics
- Bulk upload functionality
- Image cropping and editing tools

## Support

For technical support or feature requests, contact the development team or create an issue in the project repository.
