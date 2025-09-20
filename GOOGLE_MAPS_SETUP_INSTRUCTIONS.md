# Google Maps API Setup Instructions

## Step 1: Create .env.local file

Create a `.env.local` file in your project root with the following content:

```bash
# Google Maps Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyA8OS85kH4VaC64SPpO1dH--cG_pyv3IQ8
```

## Step 2: Restart your development server

After creating the `.env.local` file, restart your Next.js development server:

```bash
npm run dev
# or
yarn dev
```

## Step 3: Test the autocomplete

1. Go to your home page
2. Try typing in any location field (New Projects, Rental, or Resale tabs)
3. You should see a debug info box showing the API status
4. Type at least 2 characters and you should see suggestions

## Step 4: Check browser console

Open your browser's developer console (F12) and look for:
- "Google Places API initialized successfully"
- "API Key found: Yes"
- Autocomplete request/response logs

## Troubleshooting

### If you see "API Key found: No"
- Make sure your `.env.local` file is in the project root
- Restart your development server
- Check that the environment variable name is exactly `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### If you see "Failed to load Google Maps API"
- Check your internet connection
- Verify the API key is correct
- Make sure the Google Maps API is enabled in your Google Cloud Console

### If suggestions don't appear
- Check the browser console for error messages
- Make sure you're typing at least 2 characters
- Try typing "Pune" or "Mumbai" to test

## API Key Security

For production deployment:
1. Go to Google Cloud Console
2. Navigate to "APIs & Services" > "Credentials"
3. Click on your API key
4. Under "Application restrictions", add your domain
5. Under "API restrictions", select "Restrict key" and choose "Places API" and "Maps JavaScript API"

## Required APIs

Make sure these APIs are enabled in your Google Cloud Console:
- Places API
- Maps JavaScript API
