# Authentication System Implementation

## Overview

This document describes the implementation of a comprehensive authentication system for the Aspire Property Management application. The system follows SOLID principles and implements proper system design patterns for maintainable and scalable code.

## Architecture

### Core Components

#### 1. Authentication Service (`src/lib/authService.ts`)
- **Interface**: `IAuthenticationService` - Defines contract for authentication operations
- **Implementation**: `AuthenticationService` - Concrete implementation with credential validation
- **Factory**: `AuthenticationServiceFactory` - Creates service instances following Factory pattern

**Key Features:**
- Validates email/password against users table
- Checks user account status (active/inactive)
- Verifies credentials using Supabase Auth
- Manages user sessions

#### 2. Navigation Service (`src/lib/authService.ts`)
- **Purpose**: Handles role-based routing and access control
- **Methods**:
  - `getDashboardRoute(role)` - Returns appropriate dashboard path
  - `hasRouteAccess(userRole, requiredRole)` - Checks route permissions

#### 3. Custom Hook (`src/hooks/useAuth.ts`)
- **Purpose**: Manages authentication state and provides authentication methods
- **Features**:
  - Login/logout functionality
  - Role-based access control
  - Session management
  - Automatic redirection

#### 4. AuthGuard Component (`src/components/AuthGuard.tsx`)
- **Purpose**: Protects routes based on authentication and role requirements
- **Features**:
  - Role-based route protection
  - Automatic redirection for unauthorized access
  - Loading states and error handling
  - Higher-order component support

## Authentication Flow

### 1. Login Process
```
User Input → validateCredentials() → Check users table → Verify with Supabase Auth → Create session → Redirect to role-specific dashboard
```

### 2. Credential Validation
- **Email Check**: Verifies email exists in users table
- **Account Status**: Ensures account is active
- **Password Verification**: Uses Supabase Auth for secure password validation
- **User ID Matching**: Ensures authenticated user matches database record

### 3. Role-Based Redirection
- **ADMIN** → `/admin` - Full system access
- **AGENT** → `/agent` - Property management
- **BUYER** → `/buyer` - Property browsing
- **BUILDER** → `/builder` - Property creation

## Database Schema

### Users Table Structure
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'BUYER',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Implementation Details

### SOLID Principles Applied

#### 1. Single Responsibility Principle (SRP)
- `AuthenticationService`: Handles only authentication logic
- `NavigationService`: Manages only routing logic
- `AuthGuard`: Protects routes only

#### 2. Open/Closed Principle (OCP)
- Service interfaces allow for extension without modification
- Factory pattern enables easy service creation

#### 3. Liskov Substitution Principle (LSP)
- All authentication services implement the same interface
- Components can be swapped without breaking functionality

#### 4. Interface Segregation Principle (ISP)
- Clean, focused interfaces for each service
- No unnecessary dependencies

#### 5. Dependency Inversion Principle (DIP)
- High-level modules depend on abstractions
- Low-level modules implement abstractions

### Error Handling

#### Authentication Errors
- **User Not Found**: "User does not exist or account is inactive"
- **Invalid Credentials**: "Invalid email or password"
- **Account Inactive**: "Account is deactivated"
- **System Errors**: "An unexpected error occurred during authentication"

#### Validation Errors
- **Email Format**: Real-time email validation
- **Phone Format**: Phone number format checking
- **Duplicate Data**: Prevents duplicate email/phone registration

### Security Features

#### 1. Password Security
- Passwords handled by Supabase Auth (bcrypt hashing)
- No plain text password storage
- Secure password reset functionality

#### 2. Session Management
- JWT-based authentication via Supabase
- Secure session storage
- Automatic session expiration

#### 3. Role-Based Access Control
- Granular permission system
- Route-level protection
- Automatic unauthorized access prevention

## Usage Examples

### Basic Route Protection
```tsx
import { AuthGuard } from '@/components/AuthGuard'

function ProtectedPage() {
  return (
    <AuthGuard requiredRole="ADMIN">
      <AdminContent />
    </AuthGuard>
  )
}
```

### Role-Specific Guards
```tsx
import { AdminGuard, AgentGuard } from '@/components/AuthGuard'

function AdminPage() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  )
}

function AgentPage() {
  return (
    <AgentGuard>
      <AgentContent />
    </AgentGuard>
  )
}
```

### Custom Authentication Hook
```tsx
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { login, logout, isAuthenticated, role, user } = useAuth()
  
  const handleLogin = async () => {
    const success = await login(email, password)
    if (success) {
      // User will be automatically redirected
    }
  }
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  )
}
```

## Testing

### Unit Tests
- Service layer testing
- Hook testing with React Testing Library
- Component testing with Jest

### Integration Tests
- Authentication flow testing
- Role-based access testing
- Session management testing

## Deployment Considerations

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Setup
1. Run migration scripts in `tables/` directory
2. Set up Supabase project with proper authentication
3. Configure RLS policies for security

## Maintenance

### Code Quality
- ESLint configuration for code standards
- Prettier for consistent formatting
- TypeScript for type safety

### Monitoring
- Authentication failure logging
- User activity tracking
- Performance monitoring

## Future Enhancements

### Planned Features
- Multi-factor authentication (MFA)
- OAuth integration (Google, Facebook)
- Advanced role permissions
- Audit logging
- Rate limiting

### Scalability
- Microservice architecture support
- Redis session storage
- Load balancing considerations

## Troubleshooting

### Common Issues

#### 1. Authentication Failures
- Check user exists in database
- Verify account is active
- Confirm Supabase configuration

#### 2. Role Assignment Issues
- Check users table role column
- Verify role enum values
- Check database constraints

#### 3. Redirect Loops
- Verify AuthGuard implementation
- Check role-based routing logic
- Review authentication state management

## Support

For technical support or questions about the authentication system:
- Review this documentation
- Check console logs for errors
- Verify database connectivity
- Test with known good credentials
