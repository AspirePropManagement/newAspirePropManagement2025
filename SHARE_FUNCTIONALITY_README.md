# Share Functionality Implementation

## Overview
This implementation provides comprehensive share functionality for property listings with Web Share API support, social media integration, and URL tracking.

## Features

### 🚀 **Core Features**
- **Web Share API**: Native device sharing when available
- **Social Media Integration**: WhatsApp, Facebook, Twitter, LinkedIn, Telegram, Email
- **Clipboard Fallback**: Works on all browsers and devices
- **URL Tracking**: UTM parameters for analytics
- **Multiple Variants**: Default, icon, and text button styles
- **Responsive Design**: Works on mobile and desktop

### 📱 **Share Options**
1. **Native Sharing**: Uses device's built-in share options
2. **Social Media**: Direct links to popular platforms
3. **Copy to Clipboard**: Link, text, and HTML embed code
4. **Email Sharing**: Pre-formatted email with property details

## Components

### 1. `useShare` Hook
**Location**: `src/hooks/useShare.ts`

Custom hook that handles all share operations with fallback support.

```typescript
const { shareProperty, isCopied, isSharing } = useShare();

// Share a property
await shareProperty({
  id: 'property-123',
  type: 'resale',
  title: 'Luxury Apartment',
  location: 'Pune',
  price: 10000000,
  bhkType: '3 BHK',
  carpetArea: 1200
});
```

### 2. `ShareButton` Component
**Location**: `src/components/ShareButton.tsx`

Reusable share button with multiple variants and sizes.

```tsx
<ShareButton 
  property={propertyDetails}
  variant="default" // 'default' | 'icon' | 'text'
  size="md"        // 'sm' | 'md' | 'lg'
/>
```

### 3. `ShareModal` Component
**Location**: `src/components/ShareModal.tsx`

Advanced sharing modal with all sharing options.

```tsx
<ShareModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  property={propertyDetails}
/>
```

### 4. Share Utilities
**Location**: `src/utils/shareUtils.ts`

Utility functions for URL generation and tracking.

```typescript
// Generate shareable URL
const shareUrl = generatePropertyShareUrl(property);

// Generate share text
const shareText = generateShareText(property, 'whatsapp');

// Generate social media URLs
const socialUrls = generateSocialShareUrls(property, shareUrl);
```

## URL Structure

### Generated URLs
```
https://yourdomain.com/properties/resale/property-123?utm_source=property_share&utm_medium=share_button&utm_campaign=property_listing&shared_at=2024-01-15T10:30:00.000Z&property_id=property-123&property_type=resale
```

### URL Parameters
- `utm_source=property_share`: Identifies the source as property sharing
- `utm_medium=share_button`: Identifies the medium as share button
- `utm_campaign=property_listing`: Campaign identifier
- `shared_at=timestamp`: When the property was shared
- `property_id=property-123`: Unique property identifier
- `property_type=resale`: Type of property (resale/rental/new-projects)

## Integration

### 1. Property Layout Component
```tsx
// In PropertyLayout component
<ShareButton 
  property={propertyDetails}
  variant="icon"
  size="sm"
/>
<button onClick={() => setIsShareModalOpen(true)}>
  More Share Options
</button>
```

### 2. Property Detail Pages
```tsx
// In property detail pages
<ShareButton 
  property={{
    title: property.title,
    location: property.location,
    price: property.asking_price,
    bhkType: property.bhk_type,
    carpetArea: property.carpet_area,
    propertyType: property.property_type,
    id: property.id,
    type: property.type
  }}
  variant="default"
  size="md"
/>
```

## Social Media Integration

### Supported Platforms
1. **WhatsApp**: `https://wa.me/?text=...`
2. **Facebook**: `https://www.facebook.com/sharer/sharer.php?u=...`
3. **Twitter**: `https://twitter.com/intent/tweet?text=...&url=...`
4. **LinkedIn**: `https://www.linkedin.com/sharing/share-offsite/?url=...`
5. **Telegram**: `https://t.me/share/url?url=...&text=...`
6. **Email**: `mailto:?subject=...&body=...`

### Platform-Specific Formatting
- **WhatsApp**: Rich formatting with emojis and line breaks
- **Twitter**: Character-limited text
- **Facebook/LinkedIn**: Professional formatting
- **Telegram**: Hashtag support

## Analytics & Tracking

### Event Tracking
The system automatically tracks share events for analytics:

```typescript
trackShareEvent(property, platform, shareUrl);
```

### Tracked Data
- Property ID and type
- Share platform
- Share URL
- Timestamp
- Property details (title, location, price)

### Google Analytics Integration
```typescript
// Automatic gtag integration
gtag('event', 'share', {
  method: platform,
  content_type: 'property',
  item_id: property.id,
  property_type: property.type,
  property_title: property.title,
  property_location: property.location,
  property_price: property.price
});
```

## Testing

### Test Page
Visit `/test-share` to test all share functionality:

1. **Button Variants**: Test all button styles and sizes
2. **URL Generation**: View generated URLs and parameters
3. **Social Links**: Test all social media sharing
4. **Modal**: Test the advanced share modal
5. **Link Testing**: Click generated links to verify they work

### Manual Testing
1. **Mobile Devices**: Test native sharing
2. **Desktop**: Test social media links and clipboard
3. **Different Browsers**: Test fallback functionality
4. **URL Validation**: Verify generated URLs work correctly

## Browser Support

### Web Share API Support
- **Mobile Safari**: iOS 12.2+
- **Chrome Mobile**: Android 61+
- **Samsung Internet**: 8.2+
- **Edge Mobile**: 79+

### Fallback Support
- **All Browsers**: Clipboard copy
- **All Devices**: Social media links
- **All Platforms**: Email sharing

## Error Handling

### Graceful Degradation
1. **Web Share API Unavailable**: Falls back to clipboard
2. **Clipboard Unavailable**: Shows error message
3. **Share Cancelled**: No error shown (user choice)
4. **Network Issues**: Retry mechanism

### User Feedback
- **Loading States**: Shows when sharing is in progress
- **Success Feedback**: Confirms when link is copied
- **Error Messages**: Clear error communication

## Customization

### Styling
All components use Tailwind CSS and can be customized:

```tsx
<ShareButton 
  property={property}
  className="custom-class"
  variant="default"
  size="lg"
/>
```

### Text Customization
Modify share text in `shareUtils.ts`:

```typescript
export function generateShareText(property, platform) {
  // Customize text for different platforms
}
```

### URL Customization
Modify URL generation in `shareUtils.ts`:

```typescript
export function generatePropertyShareUrl(property, baseUrl) {
  // Customize URL structure
}
```

## Security Considerations

### URL Validation
- Validates property IDs and types
- Prevents malicious URL injection
- Sanitizes user input

### Privacy
- No sensitive data in URLs
- UTM parameters for analytics only
- Respects user privacy settings

## Performance

### Optimizations
- **Lazy Loading**: Components load only when needed
- **Memoization**: Prevents unnecessary re-renders
- **Efficient URLs**: Minimal URL parameters
- **Fast Fallbacks**: Quick clipboard operations

### Bundle Size
- **Minimal Impact**: Small utility functions
- **Tree Shaking**: Unused code eliminated
- **No Dependencies**: Uses native APIs only

## Future Enhancements

### Planned Features
1. **QR Code Generation**: For easy mobile sharing
2. **Deep Linking**: App-to-app sharing
3. **Custom Short URLs**: Branded short links
4. **Share Analytics**: Detailed sharing statistics
5. **A/B Testing**: Different share text variants

### Integration Opportunities
1. **CRM Integration**: Track leads from shares
2. **Email Marketing**: Follow-up campaigns
3. **Social Media Management**: Automated posting
4. **Analytics Platforms**: Enhanced tracking

## Troubleshooting

### Common Issues

#### Share Button Not Working
1. Check if property has required fields (id, type)
2. Verify browser supports Web Share API or clipboard
3. Check console for error messages

#### Generated URLs Not Working
1. Verify property ID and type are correct
2. Check if the property page exists
3. Test URL manually in browser

#### Social Media Links Not Opening
1. Check if popup blockers are enabled
2. Verify social media URLs are correct
3. Test on different devices/browsers

### Debug Mode
Enable debug logging:

```typescript
// In shareUtils.ts
console.log('Share event tracked:', {
  property: property.title,
  platform,
  url: shareUrl,
  timestamp: new Date().toISOString()
});
```

## Support

For issues or questions:
1. Check the test page at `/test-share`
2. Review browser console for errors
3. Test on different devices and browsers
4. Verify property data is complete

The share functionality is designed to work seamlessly across all platforms while providing excellent user experience and comprehensive tracking capabilities.
