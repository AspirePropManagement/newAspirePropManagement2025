# Google Maps API Setup Guide

## Prerequisites
1. Google Cloud Console account
2. Billing enabled on your Google Cloud project

## Step 1: Enable Google Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to "APIs & Services" > "Library"
4. Search for "Places API" and enable it
5. Also enable "Maps JavaScript API" for additional functionality

## Step 2: Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. **Important**: Restrict the API key for security:
   - Click on the API key to edit it
   - Under "Application restrictions", select "HTTP referrers (web sites)"
   - Add your domain (e.g., `localhost:3000/*`, `yourdomain.com/*`)
   - Under "API restrictions", select "Restrict key" and choose:
     - Places API
     - Maps JavaScript API

## Step 3: Configure Environment Variables
1. Add your API key to your `.env.local` file:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

2. Update your `env.example` file to include the new variable (already done)

## Step 4: Test the Implementation
1. Start your development server: `npm run dev`
2. Go to the property posting form
3. Click on the "Location" field
4. Start typing a location (e.g., "Pune")
5. You should see Google Places suggestions appear

## Features Implemented
- ✅ **Autocomplete Suggestions**: Shows location suggestions as you type
- ✅ **India Focus**: Results are restricted to India for better relevance
- ✅ **Geocoding**: Only shows geocoding results (actual places, not businesses)
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Loading States**: Shows loading indicator while fetching suggestions
- ✅ **Keyboard Navigation**: ESC key closes suggestions
- ✅ **Click to Select**: Click any suggestion to select it

## Usage in Components
The Google Places Autocomplete component is now integrated in:
- ✅ **Property Posting Forms**: Location field in all property types
- ✅ **Contact Page**: Preferred location field

## Component Props
```typescript
interface GooglePlacesAutocompleteProps {
  value: string;                    // Current input value
  onChange: (value: string, place?: PlaceResult) => void; // Callback when value changes
  placeholder?: string;             // Input placeholder text
  className?: string;               // CSS classes for styling
  required?: boolean;               // Whether field is required
  id?: string;                      // HTML id attribute
  name?: string;                    // HTML name attribute
}
```

## Troubleshooting
1. **No suggestions appearing**: Check if API key is correct and Places API is enabled
2. **Console errors**: Ensure API key has proper restrictions and billing is enabled
3. **CORS issues**: Make sure your domain is added to API key restrictions

## Cost Considerations
- Google Places API charges per request
- Autocomplete requests: ~$0.00283 per session
- Consider implementing request throttling for production use
- Monitor usage in Google Cloud Console

## Security Notes
- Never expose your API key in client-side code without restrictions
- Use HTTP referrer restrictions to limit usage to your domains
- Consider using environment variables for different environments (dev/staging/prod)
- Monitor API usage regularly to prevent unexpected charges
