# Migration from Clerk to Supabase

This document outlines the complete migration of the Aspire Property Management application from Clerk authentication to Supabase authentication and database.

## Overview

The application has been successfully migrated from Clerk to Supabase, providing:
- **Authentication**: User sign-up, sign-in, and session management
- **Database**: PostgreSQL database with Row Level Security (RLS)
- **Real-time**: Live updates and subscriptions
- **Storage**: File uploads and media management
- **Edge Functions**: Serverless backend functions

## What Was Changed

### 1. Dependencies
**Removed:**
- `@clerk/nextjs` - Clerk authentication package

**Added:**
- `@supabase/supabase-js` - Supabase client library
- `@supabase/auth-helpers-nextjs` - Next.js integration helpers

### 2. Configuration Files
**Updated:**
- `package.json` - Replaced Clerk with Supabase dependencies
- `env.example` - Updated environment variables
- `src/middleware.ts` - Replaced Clerk middleware with Supabase middleware

**New Files:**
- `src/lib/supabase.ts` - Supabase client configuration
- `SUPABASE_SETUP.md` - Comprehensive setup guide

### 3. Components
**Removed:**
- `src/components/ClerkAuthForm.tsx`
- `src/components/ClerkProvider.tsx`
- `src/components/OrganizationAuthForm.tsx`

**Updated:**
- `src/components/AuthDashboard.tsx` - Now uses Supabase hooks
- `src/components/Header.tsx` - Updated to use Supabase authentication
- `src/app/layout.tsx` - Replaced ClerkProvider with SupabaseProvider

**New Components:**
- `src/components/SupabaseProvider.tsx` - Authentication context provider
- `src/components/SupabaseAuthForm.tsx` - Authentication forms

### 4. Hooks
**Removed:**
- All Clerk-related hooks

**New Hooks:**
- `src/hooks/useSupabaseAuth.ts` - Authentication and user profile management
- `src/hooks/useSupabaseUser.ts` - User role and organization management
- `src/hooks/useSupabaseRoleAssignment.ts` - Role assignment and organization management

### 5. Database Schema
**New Tables:**
- `users` - User profiles with roles and organization assignments
- `organizations` - Organization management
- `properties` - Property listings with agent assignments

**Features:**
- Row Level Security (RLS) policies
- Role-based access control
- Organization-based data isolation

## Migration Benefits

### 1. **Cost Efficiency**
- Supabase offers a generous free tier
- Predictable pricing for scaling
- No per-user charges

### 2. **Database Integration**
- Direct SQL access to user data
- Custom user profiles and metadata
- Complex queries and relationships

### 3. **Flexibility**
- Custom authentication flows
- Role-based access control
- Organization management
- Real-time subscriptions

### 4. **Developer Experience**
- TypeScript support with generated types
- SQL-based data modeling
- Built-in Row Level Security
- Real-time subscriptions

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file with:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup
Follow the instructions in `SUPABASE_SETUP.md` to:
- Create Supabase project
- Set up database tables
- Configure RLS policies
- Set up authentication

### 4. Run the Application
```bash
npm run dev
```

## Architecture Changes

### Before (Clerk)
```
User → Clerk Auth → Clerk User Object → Application
```

### After (Supabase)
```
User → Supabase Auth → Custom User Profile → Application
```

### Key Differences
1. **User Data**: Now stored in custom `users` table
2. **Roles**: Managed through database, not Clerk metadata
3. **Organizations**: Full organization management system
4. **Real-time**: Built-in real-time subscriptions
5. **Database**: Direct SQL access to all data

## Security Features

### 1. **Row Level Security (RLS)**
- Users can only access their own data
- Role-based data access
- Organization-based data isolation

### 2. **Authentication**
- Email/password authentication
- Email verification
- Password reset functionality
- Session management

### 3. **Authorization**
- Role-based access control
- Route-level protection
- Component-level permission checks

## Testing the Migration

### 1. **Authentication Flow**
- [ ] User registration
- [ ] User login
- [ ] Password reset
- [ ] Session persistence

### 2. **Role Management**
- [ ] Role assignment
- [ ] Organization creation
- [ ] User-organization linking
- [ ] Role-based routing

### 3. **Data Access**
- [ ] User profile management
- [ ] Property listings
- [ ] Organization data
- [ ] Real-time updates

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check environment variables
   - Verify Supabase project status
   - Check RLS policies

2. **Database Connection**
   - Verify database URL
   - Check network connectivity
   - Verify project region

3. **Type Errors**
   - Run `npm run type-check`
   - Update generated types
   - Check import statements

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [Migration Issues](https://github.com/your-repo/issues)

## Next Steps

### 1. **Immediate**
- Test all authentication flows
- Verify role-based access
- Check data isolation

### 2. **Short Term**
- Implement real-time features
- Add file uploads
- Set up monitoring

### 3. **Long Term**
- Performance optimization
- Advanced RLS policies
- Custom authentication flows

## Rollback Plan

If issues arise, you can rollback by:

1. **Restore Clerk Dependencies**
   ```bash
   npm install @clerk/nextjs
   ```

2. **Restore Clerk Components**
   - Copy from git history
   - Update imports

3. **Update Configuration**
   - Restore Clerk environment variables
   - Update middleware

4. **Test Authentication**
   - Verify Clerk integration
   - Check user sessions

## Conclusion

The migration to Supabase provides a more robust, scalable, and cost-effective solution for the Aspire Property Management application. The new architecture offers better data control, real-time capabilities, and improved developer experience while maintaining security and performance standards.

For questions or support, refer to the Supabase documentation or create an issue in the project repository.
