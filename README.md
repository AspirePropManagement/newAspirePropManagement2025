# Aspire Property Management - Multi-Role Authentication System

A modern, secure property management platform built with Next.js, TypeScript, Tailwind CSS, and Supabase authentication. This system implements a comprehensive multi-role authentication flow with custom forms and role-based access control.

## 🚀 Features

### Authentication & Authorization
- **Multi-Role Authentication**: Support for Buyer, Agent, Builder, and Admin roles
- **Custom Auth Forms**: Beautiful, responsive authentication forms built from scratch
- **Role-Based Access Control**: Different dashboards and permissions for each role
- **Secure Authentication**: Powered by Supabase with custom UI components
- **Session Management**: Automatic role assignment and session handling

### User Interface
- **Modern Navbar**: Professional navigation with role-specific menu items
- **Hero Section**: Dynamic image carousel with property showcases
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Elements**: Smooth animations and transitions
- **Role Selection**: Intuitive role selection during sign-up

### System Architecture
- **Next.js 14**: App Router with TypeScript
- **SOLID Principles**: Clean, maintainable code architecture
- **Object-Oriented Design**: Proper separation of concerns
- **Custom Hooks**: Reusable authentication and role management logic
- **Type Safety**: Full TypeScript implementation

## 🏗️ System Design

### Authentication Flow
```
User visits home page → Sees navbar with Sign In/Sign Up buttons
↓
User clicks Sign In/Sign Up → Custom auth form displayed
↓
User selects role (for sign-up) → Fills form and submits
↓
Supabase handles authentication → User redirected to profile
↓
Role assignment hook → Automatically assigns selected role
↓
User redirected to role-specific dashboard
```

### Role Structure
- **Buyer**: Property search, favorites, inquiries
- **Agent**: Property listing, client management, sales tracking
- **Builder**: Project showcase, portfolio management
- **Admin**: System administration, user management

### Component Architecture
```
src/
├── app/                    # Next.js app router
│   ├── page.tsx          # Home page with navbar + hero + auth
│   ├── auth/             # Auth routes (redirects to home)
│   └── [role]/           # Role-specific dashboards
├── components/            # Reusable UI components
│   ├── Header.tsx        # Navigation bar with auth buttons
│   ├── SupabaseAuthForm.tsx # Multi-role authentication form
│   ├── ImageCarousel.tsx # Hero section image carousel
│   └── RoleProtectedRoute.tsx # Route protection by role
├── hooks/                 # Custom React hooks
│   ├── useSupabaseRoleAssignment.ts # Role management logic
│   ├── useSupabaseUser.ts # User role utilities
│   └── usePropertyData.ts # Property data management
└── types/                 # TypeScript type definitions
    ├── Auth.ts           # Authentication types
    └── Property.ts       # Property-related types
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account for authentication and database

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation Steps
```bash
# Clone the repository
git clone <repository-url>
cd NewAspireProp2025

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

## 🔐 How Multi-Role Authentication Works

### 1. User Registration Flow
1. **Role Selection**: User chooses their role during sign-up
2. **Form Submission**: Custom form handles user input
3. **Supabase Integration**: Supabase manages secure authentication
4. **Role Storage**: Selected role stored temporarily in localStorage
5. **Automatic Assignment**: Role automatically assigned after successful registration

### 2. Role Assignment Process
```typescript
// The useRoleAssignment hook automatically handles role assignment
useEffect(() => {
  if (!isLoaded || !isSignedIn || !user) return
  
  const currentRole = user.publicMetadata?.role as string
  
  if (!currentRole) {
    const selectedRole = localStorage.getItem('selectedUserRole')
    
    if (selectedRole) {
      assignRoleToUser(selectedRole)
      localStorage.removeItem('selectedUserRole')
    } else {
      router.push('/profile')
    }
  }
}, [isLoaded, isSignedIn, user, router])
```

### 3. Role-Based Routing
- **Buyer**: `/buyer` - Property search and favorites
- **Agent**: `/agent` - Property listing and client management
- **Builder**: `/builder` - Project portfolio and showcase
- **Admin**: `/admin` - System administration

### 4. Custom Authentication Forms
The system uses completely custom authentication forms instead of Clerk's default components:

```typescript
// Custom form with role selection
export function CustomAuthForm() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer')
  
  // Role options with benefits
  const roleOptions = [
    { 
      value: 'buyer', 
      label: 'Property Buyer', 
      benefits: ['Browse premium properties', 'Get expert guidance']
    },
    // ... more roles
  ]
  
  // Custom form submission handling
  const handleSubmit = async (e: React.FormEvent) => {
    // Handle authentication with Supabase
    // Store selected role for later assignment
  }
}
```

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-First**: Optimized for all device sizes
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Animations**: Smooth transitions and micro-interactions
- **Accessibility**: ARIA labels and keyboard navigation

### Interactive Elements
- **Role Selection Cards**: Visual role selection with benefits
- **Form Validation**: Real-time input validation
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages

### Visual Design
- **Modern Aesthetic**: Clean, professional appearance
- **Color Scheme**: Orange primary with gray accents
- **Typography**: Clear hierarchy and readability
- **Icons**: Meaningful iconography for each role

## 🔒 Security Features

### Authentication Security
- **Supabase Integration**: Enterprise-grade authentication
- **Session Management**: Secure session handling
- **Role Validation**: Server-side role verification
- **Input Sanitization**: XSS and injection protection

### Data Protection
- **Database Storage**: User roles stored in Supabase database
- **Local Storage**: Temporary role storage during sign-up
- **Route Protection**: Role-based access control
- **Secure Redirects**: Protected navigation flows

## 📱 Responsive Behavior

### Breakpoint Strategy
- **Mobile**: < 768px - Stacked layout, compact forms
- **Tablet**: 768px - 1024px - Side-by-side layout
- **Desktop**: > 1024px - Full two-column layout

### Mobile Optimizations
- **Touch-Friendly**: Large touch targets
- **Simplified Navigation**: Collapsible menu
- **Optimized Forms**: Mobile-optimized input fields
- **Performance**: Optimized images and animations

## 🚀 Performance Optimizations

### Code Splitting
- **Dynamic Imports**: Lazy loading of components
- **Route-Based Splitting**: Separate bundles for each role
- **Image Optimization**: Next.js image optimization

### Caching Strategy
- **Static Generation**: Pre-rendered pages where possible
- **Client-Side Caching**: Efficient state management
- **API Caching**: Optimized data fetching

## 🧪 Testing & Quality

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **SOLID Principles**: Clean architecture patterns

### Testing Strategy
- **Unit Tests**: Component and hook testing
- **Integration Tests**: Authentication flow testing
- **E2E Tests**: User journey validation

## 🔧 Customization

### Adding New Roles
1. **Update Types**: Add role to `UserRole` type
2. **Extend Forms**: Add role option to auth form
3. **Create Dashboard**: Build role-specific dashboard
4. **Update Routing**: Add route protection

### Styling Customization
- **Tailwind Config**: Custom color schemes and spacing
- **CSS Variables**: Theme customization
- **Component Props**: Flexible component configuration

## 📚 API Reference

### Hooks
- `useRoleAssignment()`: Manages role assignment logic
- `useUserRole()`: Provides user role utilities
- `usePropertyData()`: Handles property data management

### Components
- `Header`: Navigation with authentication buttons
- `CustomAuthForm`: Multi-role authentication form
- `ImageCarousel`: Hero section image display
- `RoleProtectedRoute`: Route protection component

## 🚨 Troubleshooting

### Common Issues
1. **Role Not Assigned**: Check localStorage and database role assignment
2. **Authentication Errors**: Verify Supabase configuration
3. **Routing Issues**: Ensure proper role-based protection
4. **Styling Problems**: Check Tailwind CSS configuration

### Debug Mode
```typescript
// Enable debug logging
const DEBUG = process.env.NODE_ENV === 'development'

if (DEBUG) {
  console.log('Role assignment process:', { user, selectedRole })
}
```

## 🤝 Contributing

### Development Guidelines
- **SOLID Principles**: Follow clean architecture patterns
- **TypeScript**: Maintain type safety
- **Component Design**: Create reusable, focused components
- **Testing**: Write tests for new features

### Code Style
- **ESLint**: Follow project linting rules
- **Prettier**: Use consistent formatting
- **Comments**: Document complex logic and functions
- **Naming**: Use descriptive variable and function names

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Supabase**: For secure authentication infrastructure
- **Next.js Team**: For the excellent React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Community**: For feedback and contributions

---

**Built with ❤️ for modern property management solutions**
#   B u i l d   f i x e s   a p p l i e d  
 