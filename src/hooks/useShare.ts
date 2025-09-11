import { useState } from 'react';
import { generatePropertyShareUrl, generateShareText, trackShareEvent, ShareableProperty } from '@/utils/shareUtils';

interface ShareData {
  title: string;
  text: string;
  url: string;
}

/**
 * Custom hook for handling share functionality
 * Uses Web Share API when available, falls back to clipboard copy
 */
export const useShare = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000); // Reset after 3 seconds
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  };

  const share = async (shareData: ShareData): Promise<boolean> => {
    setIsSharing(true);
    
    try {
      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return true;
      } else {
        // Fallback to clipboard copy
        const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
        return await copyToClipboard(shareText);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // If sharing was cancelled by user, don't show error
      if (error instanceof Error && error.name === 'AbortError') {
        return false;
      }
      // Fallback to clipboard copy
      const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
      return await copyToClipboard(shareText);
    } finally {
      setIsSharing(false);
    }
  };

  const shareProperty = async (property: {
    title: string;
    location: string;
    price: number;
    bhkType?: string;
    carpetArea?: number;
    propertyType?: string;
    id?: string;
    type?: string;
  }): Promise<boolean> => {
    // Generate the property URL using utility function
    const propertyUrl = property.id && property.type
      ? generatePropertyShareUrl(property as ShareableProperty)
      : window.location.href;
    
    const shareData: ShareData = {
      title: property.title,
      text: generateShareText(property as ShareableProperty),
      url: propertyUrl
    };
    
    // Track the share event
    if (property.id && property.type) {
      trackShareEvent(property as ShareableProperty, 'native_share', propertyUrl);
    }
    
    return await share(shareData);
  };

  return { 
    share, 
    shareProperty, 
    copyToClipboard, 
    isCopied, 
    isSharing 
  };
};
