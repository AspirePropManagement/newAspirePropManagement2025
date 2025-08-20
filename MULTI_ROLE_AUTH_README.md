# 🚀 Multi-Role Authentication System

## 📋 **Overview**

This project now implements a comprehensive multi-role authentication system using **Supabase** instead of Clerk. The system supports four distinct user roles:

- **🏠 Buyer** - Property seekers
- **👔 Agent** - Real estate professionals  
- **🏗️ Builder** - Property developers
- **⚙️ Admin** - System administrators

## 🏗️ **Architecture**

### **Database Schema**
```
users (base profile)
├── admins (admin roles & permissions)
├── agents (real estate agents)
├── buyers (property buyers)
└── builders (property developers)
```

### **Key Features**
- ✅ **Role-based access control** with granular permissions
- ✅ **Row Level Security (RLS)** on all tables
- ✅ **Automatic role assignment** during user onboarding
- ✅ **Role-specific dashboards** with tailored functionality
- ✅ **Permission-based features** (admin only functions)

## 🚀 **Getting Started**

### **1. Environment Setup**
```bash
# Copy your Supabase credentials to .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **2. Database Setup**
1. Go to your Supabase Dashboard → SQL Editor
2. Execute the SQL files in the `tables/` folder in order:
   - `01_users.sql`
   - `02_admins.sql`
   - `03_agents.sql`
   - `04_buyers.sql`
   - `05_builders.sql`
   - `06_properties.sql`
   - `07_functions.sql`

### **3. Install Dependencies**
```bash
npm install
```

### **4. Run the Application**
```bash
npm run dev
```

## 🔐 **Authentication Flow**

### **User Registration**
1. User signs up with email/password
2. **Role Selection Form** appears
3. User chooses their role (buyer, agent, builder, admin)
4. **Role-specific form** collects additional information
5. User profile is created in the appropriate role table
6. User is redirected to their role-specific dashboard

### **User Sign In**
1. User signs in with email/password
2. System checks if user has a role assigned
3. If no role: Shows role selection form
4. If has role: Redirects to appropriate dashboard

## 🎯 **Role-Specific Features**

### **🏠 Buyer Dashboard**
- View property preferences and budget
- Browse recommended properties
- Save favorite properties
- Contact agents
- Schedule property viewings

### **👔 Agent Dashboard**
- Manage property listings
- View client inquiries
- Track sales performance
- Manage commission rates
- Access market analytics

### **🏗️ Builder Dashboard**
- Manage development projects
- List new properties
- Track construction progress
- Manage warranties and insurance
- View project analytics

### **⚙️ Admin Dashboard**
- User management and role assignment
- System configuration
- Analytics and reporting
- Security monitoring
- Database administration

## 🛠️ **Technical Implementation**

### **Hooks & Context**
- `useSupabase()` - Authentication and basic Supabase operations
- `useSupabaseUser()` - User profile and role management
- `useSupabaseRoleAssignment()` - Role assignment and management

### **Components**
- `SupabaseAuthForm` - Sign in/sign up with role selection
- `RoleSelectionForm` - Role selection and profile completion
- `AuthDashboard` - User profile overview
- Role-specific dashboard pages

### **Database Functions**
- `get_user_role()` - Determine user's current role
- `check_user_permission()` - Check specific permissions
- `update_user_role()` - Change user's role
- `get_user_profile_with_role()` - Get complete user profile

## 🔒 **Security Features**

### **Row Level Security (RLS)**
- Users can only access their own data
- Role-based data access control
- Admin override capabilities

### **Permission System**
- Granular permissions for admins
- Role-based feature access
- Function-level security checks

## 📱 **Usage Examples**

### **Creating a New User with Role**
```typescript
import { useSupabaseRoleAssignment } from '@/hooks/useSupabaseRoleAssignment'

const { completeUserOnboarding } = useSupabaseRoleAssignment()

// Complete user onboarding
await completeUserOnboarding(userId, 'buyer', {
  email: 'user@example.com',
  full_name: 'John Doe',
  phone: '+1234567890',
  roleData: {
    budget_min: 200000,
    budget_max: 500000,
    preferred_locations: ['Downtown', 'Suburbs'],
    property_types: ['residential'],
    bedrooms_min: 2,
    bathrooms_min: 1
  }
})
```

### **Checking User Permissions**
```typescript
import { useSupabaseUser } from '@/hooks/useSupabaseUser'

const { canManageUsers, canManageProperties, isAdmin } = useSupabaseUser()

if (canManageUsers()) {
  // Show user management features
}

if (isAdmin()) {
  // Show admin-only features
}
```

### **Role-Based Navigation**
```typescript
const handleRoleNavigation = () => {
  switch (role) {
    case 'buyer':
      router.push('/buyer')
      break
    case 'agent':
      router.push('/agent')
      break
    case 'builder':
      router.push('/builder')
      break
    case 'admin':
      router.push('/admin')
      break
    default:
      router.push('/dashboard')
  }
}
```

## 🧪 **Testing**

### **Test User Creation**
1. Sign up with a new email
2. Complete role selection
3. Verify profile creation in database
4. Test role-specific dashboard access

### **Test Role Switching**
1. Use admin account to change user roles
2. Verify data access changes
3. Test permission updates

### **Test Security**
1. Try accessing role-specific pages without proper role
2. Verify RLS policies are working
3. Test permission-based feature access

## 🚨 **Troubleshooting**

### **Common Issues**

#### **"Function not found" Error**
- Ensure all SQL functions were created in the correct order
- Check Supabase SQL Editor for function creation errors

#### **"Permission denied" Error**
- Verify RLS policies are enabled
- Check user role assignment
- Ensure proper database permissions

#### **Role Selection Not Showing**
- Check if user is properly authenticated
- Verify `useSupabaseUser` hook is working
- Check browser console for errors

### **Debug Steps**
1. Check browser console for errors
2. Verify Supabase connection in Network tab
3. Check database tables and functions exist
4. Verify environment variables are correct

## 🔄 **Migration from Clerk**

### **What Was Changed**
- ✅ Replaced Clerk with Supabase authentication
- ✅ Implemented multi-role database schema
- ✅ Created role-based access control
- ✅ Added role selection during onboarding
- ✅ Built role-specific dashboards

### **What Was Removed**
- ❌ Clerk dependencies and configuration
- ❌ Organization-based user management
- ❌ Clerk-specific components and hooks

### **What Was Added**
- ✅ Supabase client and provider
- ✅ Multi-role database tables
- ✅ Role assignment system
- ✅ Permission-based features
- ✅ Role-specific dashboards

## 📚 **Additional Resources**

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

## 🤝 **Support**

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the database setup in the `tables/` folder
3. Verify your Supabase configuration
4. Check browser console for detailed error messages

---

**🎉 Your multi-role authentication system is now ready!**
