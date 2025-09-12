/**
 * Image utility functions for handling both URL and base64 images
 * Supports mixed image formats in property data
 */

/**
 * Checks if a string is a base64 image data URL
 * @param str - String to check
 * @returns boolean indicating if it's a base64 image
 */
export function isBase64Image(str: string): boolean {
  if (typeof str !== 'string') return false;
  
  // Check for data URL format: data:image/...;base64,...
  const base64ImageRegex = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/i;
  return base64ImageRegex.test(str);
}

/**
 * Checks if a string is a valid HTTP/HTTPS URL
 * @param str - String to check
 * @returns boolean indicating if it's a URL
 */
export function isImageUrl(str: string): boolean {
  if (typeof str !== 'string') return false;
  
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates if a string is a valid image source (either URL or base64)
 * @param str - String to validate
 * @returns boolean indicating if it's a valid image source
 */
export function isValidImageSource(str: string): boolean {
  return isBase64Image(str) || isImageUrl(str);
}

/**
 * Gets the image source type
 * @param str - Image source string
 * @returns 'base64' | 'url' | 'invalid'
 */
export function getImageSourceType(str: string): 'base64' | 'url' | 'invalid' {
  if (isBase64Image(str)) return 'base64';
  if (isImageUrl(str)) return 'url';
  return 'invalid';
}

/**
 * Filters an array of image sources to only include valid ones
 * @param images - Array of image source strings
 * @returns Array of valid image sources
 */
export function filterValidImages(images: string[]): string[] {
  if (!Array.isArray(images)) return [];
  
  return images.filter(img => 
    img && 
    typeof img === 'string' && 
    img.trim() !== '' && 
    isValidImageSource(img)
  );
}

/**
 * Gets the appropriate src attribute for Next.js Image component
 * For base64 images, returns the data URL directly
 * For URL images, returns the URL
 * @param imageSource - Image source string
 * @returns string suitable for Next.js Image src
 */
export function getImageSrc(imageSource: string): string {
  if (isBase64Image(imageSource)) {
    return imageSource;
  }
  
  if (isImageUrl(imageSource)) {
    return imageSource;
  }
  
  // Fallback for invalid sources
  return '';
}

/**
 * Extracts images from property data structure
 * Handles both URL and base64 images
 * @param property - Property object
 * @returns Array of valid image sources
 */
export function extractPropertyImages(property: any): string[] {
  if (!property) return [];
  
  const images: string[] = [];
  
  // First, try to use the direct images array
  if (property.images && Array.isArray(property.images)) {
    images.push(...filterValidImages(property.images));
  }
  
  // Then try to extract images from the property_images JSONB structure
  if (property.property_images && typeof property.property_images === 'object') {
    // Check general_photos
    if (property.property_images.general_photos) {
      Object.values(property.property_images.general_photos).forEach((categoryImages: any) => {
        if (Array.isArray(categoryImages)) {
          images.push(...filterValidImages(categoryImages));
        }
      });
    }
    
    // Check floor_plans
    if (property.property_images.floor_plans) {
      Object.values(property.property_images.floor_plans).forEach((planImages: any) => {
        if (Array.isArray(planImages)) {
          images.push(...filterValidImages(planImages));
        }
      });
    }
    
    // Check project_images (for new projects)
    if (property.property_images.project_images) {
      Object.values(property.property_images.project_images).forEach((projectImages: any) => {
        if (Array.isArray(projectImages)) {
          images.push(...filterValidImages(projectImages));
        }
      });
    }
  }
  
  return images;
}

/**
 * Gets images by category from property data
 * @param property - Property object
 * @param category - Image category (e.g., 'exterior', 'interior', 'bedrooms')
 * @returns Array of valid image sources for the category
 */
export function getImagesByCategory(property: any, category: string): string[] {
  if (!property || !property.property_images) return [];
  
  const categoryImages = property.property_images.general_photos?.[category];
  if (Array.isArray(categoryImages)) {
    return filterValidImages(categoryImages);
  }
  
  return [];
}

/**
 * Creates a fallback image component props
 * @param alt - Alt text for the image
 * @param className - CSS classes
 * @returns Object with fallback image props
 */
export function createFallbackImageProps(alt: string, className: string = '') {
  return {
    src: '/placeholder-property.svg',
    alt,
    className,
    width: 400,
    height: 300,
  };
}
