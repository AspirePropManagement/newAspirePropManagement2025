# Firebase Integration Setup

This document outlines the Firebase integration for the Aspire Property Management application.

## Overview

The application has been integrated with Firebase to provide:
- **Authentication**: Email/password and phone number authentication
- **Firestore Database**: User data storage and management
- **Storage**: File storage for property images and documents
- **Analytics**: User behavior tracking and insights

## Architecture

The Firebase integration follows SOLID principles and implements a clean architecture:

```
src/
├── lib/
│   ├── firebase.ts          # Main Firebase initialization
│   └── firebaseConfig.ts    # Configuration and environment settings
├── services/
│   └── firebaseAuth.ts      # Authentication service layer
├── components/
│   └── FirebaseProvider.tsx # Firebase initialization provider
└── contexts/
    └── AuthContext.tsx      # Authentication context (updated)
```

## Configuration

### Firebase Configuration
The Firebase configuration is centralized in `src/lib/firebaseConfig.ts` and supports environment variables:

```typescript
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-domain",
  // ... other config
}
```

### Environment Variables
Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your-database-url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Services

### FirebaseAuthService
The `FirebaseAuthService` class provides a clean interface for authentication operations:

- **Singleton Pattern**: Ensures single instance across the application
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Type Safety**: Full TypeScript support with proper typing
- **Firestore Integration**: Automatic user document creation and management

#### Key Methods:
- `signInWithEmail(email, password)`: Email/password authentication
- `createUserWithEmail(email, password, displayName)`: User registration
- `signOut()`: User logout
- `createUserDocument(user, userData)`: Create/update Firestore user document
- `getUserDocument(uid)`: Retrieve user data from Firestore

## Usage

### 1. Wrap Your App
Wrap your application with the `FirebaseProvider` in your root layout:

```tsx
// app/layout.tsx
import { FirebaseProvider } from '@/components/FirebaseProvider'
import { AuthProvider } from '@/contexts/AuthContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <FirebaseProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
  )
}
```

### 2. Use Authentication
The authentication context automatically integrates with Firebase:

```tsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, login, register, logout } = useAuth()
  
  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'password123',
        role: 'buyer'
      })
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
  
  // ... rest of component
}
```

## Development

### Firebase Emulators
For local development, the application automatically connects to Firebase emulators:

- **Auth Emulator**: `localhost:9099`
- **Firestore Emulator**: `localhost:8080`
- **Storage Emulator**: `localhost:9199`

To start the emulators, install Firebase CLI and run:

```bash
npm install -g firebase-tools
firebase login
firebase init emulators
firebase emulators:start
```

### Environment Detection
The application automatically detects the environment and configures accordingly:

```typescript
export const firebaseSettings = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  enableAnalytics: process.env.NODE_ENV === 'production',
  enableEmulators: process.env.NODE_ENV === 'development'
}
```

## Security Rules

### Firestore Security Rules
Set up proper security rules in your Firebase console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read access for properties
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Security Rules
Configure storage rules for file uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload files to their own folder
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read access for property images
    match /properties/{propertyId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Error Handling

The application includes comprehensive error handling:

- **Authentication Errors**: User-friendly error messages for common auth issues
- **Network Errors**: Proper handling of connection issues
- **Validation Errors**: Client-side validation with Firebase integration
- **Graceful Degradation**: Fallback behavior when Firebase services are unavailable

## Performance

### Optimization Features:
- **Lazy Loading**: Firebase services are initialized only when needed
- **Connection Pooling**: Efficient connection management
- **Caching**: Firestore offline persistence and caching
- **Bundle Splitting**: Firebase SDKs are loaded efficiently

## Monitoring

### Analytics Integration:
- **User Behavior**: Track user interactions and flows
- **Performance Metrics**: Monitor app performance and loading times
- **Error Tracking**: Automatic error reporting and monitoring
- **Custom Events**: Track business-specific user actions

## Troubleshooting

### Common Issues:

1. **Firebase not initializing**:
   - Check environment variables
   - Verify Firebase project configuration
   - Check browser console for errors

2. **Authentication not working**:
   - Verify Firebase Auth is enabled in console
   - Check authentication methods are configured
   - Verify domain is whitelisted

3. **Firestore access denied**:
   - Check security rules configuration
   - Verify user authentication state
   - Check Firestore database exists

4. **Emulator connection issues**:
   - Ensure emulators are running
   - Check port configurations
   - Verify firewall settings

## Next Steps

### Planned Enhancements:
- [ ] Phone number authentication with SMS
- [ ] Social media login (Google, Facebook)
- [ ] Multi-factor authentication
- [ ] Advanced user roles and permissions
- [ ] Real-time data synchronization
- [ ] Offline support and data sync

### Integration Points:
- [ ] Property management system
- [ ] User dashboard
- [ ] Admin panel
- [ ] Notification system
- [ ] Payment processing

## Support

For Firebase-related issues:
1. Check Firebase console for service status
2. Review Firebase documentation
3. Check application logs and error messages
4. Verify configuration and environment setup

For application-specific issues:
1. Review this documentation
2. Check component implementation
3. Verify service layer integration
4. Review authentication flow
