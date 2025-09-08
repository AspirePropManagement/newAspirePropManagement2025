/**
 * Utility functions for generating shareable URLs and tracking
 */

export interface ShareableProperty {
  id: string;
  type: string;
  title: string;
  location: string;
  price: number;
  bhkType?: string;
  carpetArea?: number;
  propertyType?: string;
}

/**
 * Generates a shareable URL for a property
 * Includes UTM parameters for tracking shared links
 */
export function generatePropertyShareUrl(
  property: ShareableProperty,
  baseUrl?: string
): string {
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const propertyUrl = `${origin}/properties/${property.type}/${property.id}`;
  
  // Add UTM parameters for tracking
  const urlParams = new URLSearchParams({
    utm_source: 'property_share',
    utm_medium: 'share_button',
    utm_campaign: 'property_listing',
    shared_at: new Date().toISOString(),
    property_id: property.id,
    property_type: property.type
  });
  
  return `${propertyUrl}?${urlParams.toString()}`;
}

/**
 * Generates share text for different platforms
 */
export function generateShareText(
  property: ShareableProperty,
  platform?: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'telegram' | 'general'
): string {
  const baseText = `Check out this ${property.bhkType || property.propertyType || 'property'} in ${property.location}.`;
  const details = property.carpetArea ? `Carpet Area: ${property.carpetArea} sq ft. ` : '';
  const price = `Price: ₹${property.price.toLocaleString('en-IN')}`;
  
  switch (platform) {
    case 'twitter':
      // Twitter has character limit, keep it shorter
      return `${property.title} - ${property.location} ${price}`;
    
    case 'whatsapp':
      // WhatsApp format
      return `🏠 *${property.title}*\n📍 ${property.location}\n${details}💰 ${price}\n\nCheck out this amazing property!`;
    
    case 'facebook':
    case 'linkedin':
      // Professional format
      return `${property.title}\n\n${baseText} ${details}${price}\n\nView more details and schedule a visit.`;
    
    case 'telegram':
      // Telegram format
      return `🏠 *${property.title}*\n📍 ${property.location}\n${details}💰 ${price}\n\n#Property #RealEstate #${property.location.replace(/\s+/g, '')}`;
    
    default:
      return `${baseText} ${details}${price}`;
  }
}

/**
 * Generates social media share URLs
 */
export function generateSocialShareUrls(property: ShareableProperty, shareUrl: string) {
  const shareText = generateShareText(property, 'general');
  
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(generateShareText(property, 'whatsapp') + ' ' + shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(generateShareText(property, 'twitter'))}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(generateShareText(property, 'telegram'))}`,
    email: `mailto:?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`
  };
}

/**
 * Tracks share events for analytics
 */
export function trackShareEvent(
  property: ShareableProperty,
  platform: string,
  shareUrl: string
): void {
  // Track share event (you can integrate with Google Analytics, Mixpanel, etc.)
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', 'share', {
      method: platform,
      content_type: 'property',
      item_id: property.id,
      property_type: property.type,
      property_title: property.title,
      property_location: property.location,
      property_price: property.price
    });
  }
  
  // Log to console for development
  console.log('Share event tracked:', {
    property: property.title,
    platform,
    url: shareUrl,
    timestamp: new Date().toISOString()
  });
}

/**
 * Truncates a URL for display purposes while keeping it functional
 */
export function truncateUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) {
    return url;
  }
  
  // Keep the beginning and end of the URL
  const start = url.substring(0, maxLength - 10);
  const end = url.substring(url.length - 7);
  return `${start}...${end}`;
}

/**
 * Validates if a URL is a valid property share URL
 */
export function isValidPropertyShareUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    // Should be /properties/[type]/[id]
    return pathParts.length === 3 && 
           pathParts[0] === 'properties' && 
           ['resale', 'rental', 'new-projects'].includes(pathParts[1]) &&
           pathParts[2].length > 0;
  } catch {
    return false;
  }
}

/**
 * Extracts property information from a share URL
 */
export function extractPropertyFromUrl(url: string): { type: string; id: string } | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    if (pathParts.length === 3 && pathParts[0] === 'properties') {
      return {
        type: pathParts[1],
        id: pathParts[2]
      };
    }
    
    return null;
  } catch {
    return null;
  }
}
