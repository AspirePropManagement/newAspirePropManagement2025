# Simplified Authentication System

This project now uses a simplified authentication system with a single `users` table instead of multiple role-specific tables.

## Database Structure

### Users Table
```sql
CREATE TABLE users (
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
```

### Available Roles
- **ADMIN** - Platform administrators with full access
- **AGENT** - Real estate agents who can manage properties
- **BUYER** - Property buyers (default role)
- **BUILDER** - Property developers/builders

## Frontend Integration

### 1. Authentication Components

The system includes:
- `SupabaseAuthForm` - Handles sign in/sign up with role selection
- `SupabaseProvider` - Provides authentication context
- `useSupabaseUser` - Hook for accessing user data and role

### 2. Key Features

- **Role-based Registration**: Users select their role during signup
- **Real-time Validation**: Email and phone number availability checked as user types
- **Duplicate Prevention**: Prevents registration with existing email or phone numbers
- **User-friendly Errors**: Clear error messages with helpful suggestions
- **Automatic Redirects**: Users are redirected to role-specific dashboards
- **Simplified State Management**: Single user object with embedded role
- **Type Safety**: Full TypeScript support with proper types

### 3. Usage Examples

#### Basic Authentication
```tsx
import { useSupabase } from '@/components/SupabaseProvider'
import { useSupabaseUser } from '@/hooks/useSupabaseUser'

function MyComponent() {
  const { signIn, signUp, signOut } = useSupabase()
  const { user, role, isAdmin, isAgent } = useSupabaseUser()

  // Check user role
  if (isAdmin()) {
    // Show admin features
  }

  // Sign up with phone number
  const handleSignUp = async () => {
    const { error } = await signUp(email, password, firstName, lastName, phone, role)
    if (!error) {
      // User will be automatically redirected based on role
    }
  }

  // Sign in
  const handleSignIn = async () => {
    const { error } = await signIn(email, password)
    if (!error) {
      // User will be automatically redirected based on role
    }
  }
}
```

#### Role-based Access Control
```tsx
function ProtectedComponent() {
  const { hasRole, hasAnyRole } = useSupabaseUser()

  // Check specific role
  if (hasRole('ADMIN')) {
    return <AdminDashboard />
  }

  // Check multiple roles
  if (hasAnyRole(['AGENT', 'BUILDER'])) {
    return <PropertyManagement />
  }

  return <BuyerDashboard />
}
```

## Migration

### 1. Run the Migration Script
```bash
# Execute the migration script in your Supabase database
psql -h your-host -U your-user -d your-database -f tables/migrate_to_simplified_users.sql
```

### 2. Update Environment Variables
Ensure your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Test the System
1. Start your development server
2. Navigate to `/auth` to test registration and login
3. Verify role-based redirects work correctly

## Benefits of Simplified Structure

1. **Easier Maintenance**: Single table instead of multiple related tables
2. **Better Performance**: Fewer joins and simpler queries
3. **Cleaner Code**: Simplified authentication logic
4. **Easier Scaling**: Simpler to add new roles or modify existing ones
5. **Better Type Safety**: Cleaner TypeScript definitions

## Validation & Error Handling

### Real-time Validation
- **Email Validation**: Checks for existing email addresses as user types
- **Phone Validation**: Verifies phone number availability after 10+ characters
- **Debounced Checks**: API calls are delayed by 500ms to avoid excessive requests
- **Visual Feedback**: Loading states and clear error messages

### Duplicate Prevention
- **Email Uniqueness**: Prevents registration with existing email addresses
- **Phone Uniqueness**: Ensures phone numbers are unique across all users
- **Helpful Messages**: Suggests signing in instead of creating duplicate accounts

### Error Messages
- **Clear Instructions**: Users know exactly what to do next
- **Actionable Feedback**: Specific guidance for resolving issues
- **Form Validation**: Submit button disabled until all errors are resolved

## Security Considerations

- Passwords are handled by Supabase Auth (secure by default)
- Role validation is enforced at the database level
- User sessions are managed securely by Supabase
- No sensitive data is stored in plain text
- Duplicate prevention at both frontend and backend levels

## Troubleshooting

### Common Issues

1. **Role not being set**: Ensure the migration script ran successfully
2. **Authentication errors**: Check Supabase configuration and environment variables
3. **Redirect loops**: Verify role-based routing logic in components

### Debug Mode

Enable debug logging by setting:
```env
NEXT_PUBLIC_SUPABASE_DEBUG=true
```

## Next Steps

1. **Customize Roles**: Add new roles or modify existing ones
2. **Add Permissions**: Implement fine-grained permission system if needed
3. **Profile Management**: Add user profile editing capabilities
4. **Role Switching**: Allow users to request role changes (admin approval)
