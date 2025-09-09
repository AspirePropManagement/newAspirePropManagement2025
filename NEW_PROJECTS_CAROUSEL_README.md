# New Projects Carousel Feature

## Overview
A horizontal carousel component that displays new real estate projects on the home page, showing 4 cards at a time with navigation controls.

## Components Created

### 1. NewProjectsCarousel Component
**File:** `src/components/NewProjectsCarousel.tsx`

**Features:**
- Horizontal carousel with 4 cards visible at a time
- Navigation arrows for previous/next slides
- Dot indicators for direct slide navigation
- Responsive design (1 column on mobile, 2 on tablet, 4 on desktop)
- Image fallback handling with placeholder
- Amenities display (first 3 amenities)
- Status and construction type badges
- Hover effects and smooth transitions
- "View All" button linking to properties listing

**Props:**
- `projects`: Array of NewProject objects

### 2. useNewProjects Hook
**File:** `src/hooks/useNewProjects.ts`

**Features:**
- Fetches new projects from `/api/properties/new-projects`
- Filters only active projects
- Limits to 12 projects for home page display
- Provides loading state and error handling
- Includes refetch functionality

**Returns:**
- `projects`: Array of new projects
- `loading`: Boolean loading state
- `error`: Error message if any
- `refetch`: Function to refetch data

### 3. Test Page
**File:** `src/app/test-new-projects/page.tsx`

**Purpose:**
- Test the carousel component in isolation
- Verify data fetching and display
- Debug any issues with the component

## Integration

### Home Page Integration
The carousel is integrated into the home page (`src/app/page.tsx`) after the services section:

```tsx
{/* New Projects Section */}
<NewProjectsCarousel projects={newProjects} />
```

### Data Structure
The component expects projects with the following structure:
```typescript
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
```

## Styling
- Uses Tailwind CSS for styling
- Responsive grid layout
- Smooth transitions and hover effects
- Orange color scheme matching the site theme
- Card-based design with shadows and borders

## Features
1. **Carousel Navigation**: Arrow buttons and dot indicators
2. **Image Handling**: Fallback to placeholder SVG when images are missing
3. **Amenities Display**: Shows first 3 amenities as tags
4. **Status Badges**: Shows project status and construction type
5. **Responsive Design**: Adapts to different screen sizes
6. **Loading States**: Skeleton loading animation
7. **Error Handling**: Graceful error display
8. **Accessibility**: ARIA labels and keyboard navigation

## Usage
The carousel automatically loads and displays new projects on the home page. No additional configuration is required.

## Testing
Visit `/test-new-projects` to test the carousel component in isolation.
