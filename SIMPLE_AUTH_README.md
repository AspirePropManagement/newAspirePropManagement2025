# Simple Authentication System

This is a simplified authentication system for the Aspire Property Management application that uses Supabase as the database backend with direct table access.

## Features

- **User Registration**: Create new user accounts with role selection
- **User Login**: Authenticate users with email and password
- **Role-Based Access Control**: Four user roles (ADMIN, AGENT, BUYER, BUILDER)
- **Local Storage**: User data stored in browser localStorage after successful login
- **Protected Routes**: Role-based route protection with AuthGuard component
- **Dashboard Redirection**: Automatic redirection to role-specific dashboards

## Database Setup

### 1. Create the Users Table

Run this SQL in your Supabase database:

```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'BUYER' CHECK (role IN ('ADMIN', 'AGENT', 'BUYER', 'BUILDER')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
```

### 2. Environment Variables

Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How It Works

### 1. User Registration

When a user signs up:
1. Form data is collected (email, password, first name, last name, phone, role)
2. Password is hashed using bcryptjs
3. User data is inserted into the `users` table
4. Success message is shown and user is redirected to sign in

### 2. User Login

When a user signs in:
1. Email and password are submitted
2. System queries the `users` table for the email
3. Password is verified using bcryptjs
4. If valid, user data is stored in localStorage
5. User is redirected to their role-specific dashboard

### 3. Role-Based Routing

After successful login, users are redirected based on their role:
- **ADMIN** → `/admin`
- **AGENT** → `/agent`
- **BUYER** → `/buyer`
- **BUILDER** → `/builder`

### 4. Route Protection

Protected routes use the `AuthGuard` component:

```tsx
import AuthGuard from '@/components/AuthGuard'

// Protect a route for all authenticated users
<AuthGuard>
  <YourComponent />
</AuthGuard>

// Protect a route for specific roles
<AuthGuard requiredRole="ADMIN">
  <AdminComponent />
</AuthGuard>

// Protect a route for multiple roles
<AuthGuard requiredRole={['ADMIN', 'AGENT']}>
  <StaffComponent />
</AuthGuard>
```

## Components

### AuthService

The main authentication service class with static methods:

- `registerUser()` - Create new user accounts
- `loginUser()` - Authenticate users
- `storeUserInLocalStorage()` - Store user data locally
- `getUserFromLocalStorage()` - Retrieve user data
- `clearUserFromLocalStorage()` - Clear user data on logout
- `isAuthenticated()` - Check authentication status
- `getUserRole()` - Get user role

### NavigationService

Handles role-based routing:

- `getDashboardRoute()` - Get dashboard route for a role
- `hasRouteAccess()` - Check if user has access to a route

### useAuth Hook

Custom React hook for managing authentication state:

```tsx
const { user, userRole, isAuthenticated, loading, signOut } = useAuth()
```

### AuthGuard Component

Protects routes based on authentication and role requirements:

```tsx
<AuthGuard requiredRole="ADMIN">
  <AdminDashboard />
</AuthGuard>
```

## Usage Examples

### 1. Basic Authentication Check

```tsx
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { isAuthenticated, user } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Please sign in</div>
  }
  
  return <div>Welcome, {user?.first_name}!</div>
}
```

### 2. Role-Based Rendering

```tsx
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { userRole } = useAuth()
  
  if (userRole === 'ADMIN') {
    return <AdminPanel />
  }
  
  if (userRole === 'AGENT') {
    return <AgentPanel />
  }
  
  return <UserPanel />
}
```

### 3. Protected Route

```tsx
import AuthGuard from '@/components/AuthGuard'

export default function AdminPage() {
  return (
    <AuthGuard requiredRole="ADMIN">
      <div>Admin Dashboard Content</div>
    </AuthGuard>
  )
}
```

## Security Features

- **Password Hashing**: Passwords are hashed using bcryptjs with 12 salt rounds
- **Input Validation**: Form inputs are validated before submission
- **Role Verification**: Server-side role verification for protected routes
- **Session Management**: User sessions managed through localStorage

## Testing the System

1. **Start the application**: `npm run dev`
2. **Navigate to** `/auth`
3. **Create a test user** with any role
4. **Sign in** with the created credentials
5. **Verify redirection** to the appropriate dashboard
6. **Test route protection** by trying to access other role dashboards

## Troubleshooting

### Common Issues

1. **"Invalid email or password"**
   - Check if the user exists in the database
   - Verify password was hashed during registration

2. **"Role not found"**
   - Ensure the user has a valid role in the database
   - Check role spelling (must be uppercase: ADMIN, AGENT, BUYER, BUILDER)

3. **"Route access denied"**
   - Verify user has the required role for the route
   - Check AuthGuard component configuration

### Database Queries

To check user data directly:

```sql
-- View all users
SELECT * FROM users;

-- Check specific user
SELECT * FROM users WHERE email = 'user@example.com';

-- Check user roles
SELECT email, role, is_active FROM users;
```

## Future Enhancements

- Password reset functionality
- Email verification
- Session timeout management
- Refresh token implementation
- Multi-factor authentication
- Audit logging
- User activity tracking

## Dependencies

- `bcryptjs` - Password hashing
- `@supabase/supabase-js` - Database client
- `next` - React framework
- `react` - UI library
- `tailwindcss` - Styling
