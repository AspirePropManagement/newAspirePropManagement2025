# Authentication System Documentation

## Overview

This document describes the authentication system implemented for the Aspire Property Management application. The system follows modern web development best practices and implements SOLID principles for maintainable and scalable code.

## Architecture

### System Design Principles

The authentication system is built following these key principles:

1. **Single Responsibility Principle (SRP)**: Each component has a single, well-defined responsibility
2. **Open/Closed Principle (OCP)**: Components are open for extension but closed for modification
3. **Interface Segregation Principle (ISP)**: Interfaces are focused and specific to their use cases
4. **Dependency Inversion Principle (DIP)**: High-level modules don't depend on low-level modules

### Component Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication state management
├── components/
│   ├── AuthForm.tsx             # Login/Register form with dual login options and role selection
│   ├── FormInput.tsx            # Reusable input component with validation and password toggle
│   ├── ProtectedRoute.tsx       # Route protection wrapper
│   └── Header.tsx               # Updated header with auth integration and role display
├── utils/
│   └── validation.ts            # Comprehensive validation and sanitization utilities
├── types/
│   └── Auth.ts                  # TypeScript interfaces with user roles and dual login
└── app/
    ├── auth/
    │   └── page.tsx             # Authentication page
    └── profile/
        └── page.tsx             # Protected profile page with role information
```

## Features

### 1. User Authentication
- **Dual Login Options**: 
  - Traditional email/password login
  - OTP-based login with phone and role
- **Registration**: New user account creation with role selection
- **Phone OTP Verification**: Two-factor authentication using phone-based OTP
- **Session Management**: Persistent authentication state
- **Role-Based Access**: Four distinct user roles (Buyer, Agent, Builder, Admin)

### 2. User Interface
- **Tabbed Design**: Single page with tabs for login and register
- **Dual Login Methods**: Toggle between password and OTP login
- **Role Selection**: Dropdown selection for user roles in all forms
- **Responsive Layout**: Mobile-first design approach
- **Form Validation**: Real-time validation and error handling
- **Loading States**: User feedback during authentication processes

### 3. Security Features
- **Protected Routes**: Authentication-required page access
- **Route Guards**: Automatic redirection for unauthenticated users
- **Session Persistence**: Secure token-based authentication
- **Phone Verification**: OTP sent to registered phone numbers
- **Flexible Authentication**: Users can choose their preferred login method

### 4. Enhanced Form Features
- **Password Visibility Toggle**: Eye icon to show/hide password
- **Real-time Validation**: Instant feedback on field validation
- **Input Sanitization**: Automatic removal of dangerous characters
- **Phone Number Formatting**: Automatic +91 prefix and 10-digit validation
- **Field-level Validation**: Individual field validation with visual feedback
- **Form-level Error Display**: Comprehensive error summary

## Implementation Details

### User Roles

The system supports four distinct user roles:

1. **Buyer** - Property seekers looking to purchase properties
2. **Agent** - Real estate agents and brokers
3. **Builder** - Property developers and construction companies
4. **Admin** - System administrators with full access

### Dual Login System

#### Password Login
- Email address (with validation)
- Password (with strength requirements and visibility toggle)
- User role selection
- Traditional authentication flow

#### OTP Login
- Phone number (with +91 prefix and 10-digit validation)
- User role selection
- OTP sent to phone
- Secure verification flow

### Comprehensive Validation System

#### Input Validation Rules

**Email Validation:**
- Required field
- Valid email format
- Maximum length: 254 characters
- Automatic lowercase conversion

**Phone Validation:**
- Required field
- Automatic +91 prefix
- Exactly 10 digits
- Only numeric characters allowed
- Real-time formatting

**Password Validation:**
- Required field
- Minimum length: 8 characters
- Maximum length: 128 characters
- Must contain uppercase, lowercase, and numbers
- Password visibility toggle

**Name Validation:**
- Required field
- Minimum length: 2 characters
- Maximum length: 50 characters
- Only letters, spaces, hyphens, apostrophes, and dots allowed

**OTP Validation:**
- Required field
- Exactly 6 digits
- Only numeric characters allowed

#### Input Sanitization

- **HTML Tag Removal**: Prevents XSS attacks
- **JavaScript Protocol Removal**: Blocks script injection
- **Event Handler Removal**: Prevents event-based attacks
- **Whitespace Trimming**: Clean input processing
- **Character Filtering**: Only allowed characters accepted

### Form Components

#### FormInput Component
- **Unified Input Handling**: Consistent behavior across all input types
- **Password Toggle**: Eye icon for password visibility
- **Real-time Validation**: Instant feedback with visual indicators
- **Error Display**: Clear error messages with icons
- **Success Indicators**: Green checkmarks for valid fields
- **Phone Formatting**: Automatic +91 prefix and digit counting
- **Accessibility**: Proper labels and ARIA attributes

#### AuthForm Component
- **Tab Navigation**: Seamless switching between login and register
- **Dual Login Methods**: Toggle between password and OTP login
- **Role Selection**: Dropdown for selecting user role in all forms
- **Form Validation**: Client-side validation with real-time feedback
- **Phone OTP Integration**: Automatic OTP verification flow via phone
- **Error Handling**: Comprehensive error display and management
- **Field-level Validation**: Individual field validation on blur
- **Form-level Validation**: Complete form validation on submit

#### ProtectedRoute Component
- **Authentication Check**: Verifies user authentication status
- **Route Protection**: Prevents access to protected pages
- **Loading States**: Provides feedback during authentication checks
- **Automatic Redirection**: Redirects unauthenticated users to login

### User Experience Flow

1. **Initial Access**: Users see login/register tabs on the auth page
2. **Login Method Selection**: Users choose between password or OTP login
3. **Role Selection**: Users select their role (Buyer, Agent, Builder, Admin)
4. **Real-time Validation**: Fields validate as users type and on blur
5. **Authentication**: Users complete login or registration with chosen method
6. **Phone OTP Verification**: System sends OTP to registered phone number
7. **Profile Access**: Verified users can access protected profile pages
8. **Session Management**: Authentication state persists across page refreshes

## Usage Examples

### Basic Authentication with Role

```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, login, loginWithOTP, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Please log in</div>
  }
  
  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Dual Login Methods

```typescript
// Password-based login
const handlePasswordLogin = async () => {
  await login({
    email: 'user@example.com',
    password: 'Password123',
    role: 'buyer'
  })
}

// OTP-based login
const handleOTPLogin = async () => {
  await loginWithOTP({
    phone: '+91 9876543210',
    role: 'agent'
  })
}
```

### Form Validation

```typescript
import { validateEmail, validatePhone, validatePassword } from '@/utils/validation'

// Validate individual fields
const emailValidation = validateEmail('user@example.com')
const phoneValidation = validatePhone('+91 9876543210')
const passwordValidation = validatePassword('Password123')

// Check validation results
if (emailValidation.isValid && phoneValidation.isValid && passwordValidation.isValid) {
  // Proceed with form submission
}
```

### Role-Based Component Rendering

```typescript
function RoleBasedComponent() {
  const { user } = useAuth()
  
  switch (user?.role) {
    case 'buyer':
      return <BuyerDashboard />
    case 'agent':
      return <AgentDashboard />
    case 'builder':
      return <BuilderDashboard />
    case 'admin':
      return <AdminDashboard />
    default:
      return <div>Please select a role</div>
  }
}
```

### Protected Routes

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute'

function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  )
}
```

## Configuration

### Environment Variables

The system is designed to work with environment-specific configurations:

```env
# Authentication API endpoints
NEXT_PUBLIC_AUTH_API_URL=https://api.example.com/auth
NEXT_PUBLIC_OTP_API_URL=https://api.example.com/otp

# SMS/Phone configuration
SMS_PROVIDER_API_KEY=your-sms-provider-key
SMS_PROVIDER_URL=https://sms-provider.com/api

# JWT configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

### Customization

The authentication system can be customized through:

1. **Styling**: Tailwind CSS classes for consistent theming
2. **Validation Rules**: Custom validation logic for forms
3. **OTP Configuration**: Adjustable OTP length and expiration
4. **Role Definitions**: Customizable user roles and permissions
5. **Login Methods**: Configurable authentication methods
6. **Redirect Paths**: Configurable authentication redirects
7. **Validation Messages**: Customizable error and success messages
8. **Input Sanitization**: Configurable character filtering rules

## Security Considerations

### Best Practices Implemented

1. **Token Storage**: Secure token handling (localStorage for demo, HTTP-only cookies for production)
2. **Input Validation**: Comprehensive form validation and sanitization
3. **Error Handling**: Secure error messages without information leakage
4. **Session Management**: Proper session lifecycle management
5. **Role-Based Security**: User role validation and access control
6. **Dual Authentication**: Multiple secure login methods
7. **XSS Prevention**: Input sanitization and HTML encoding
8. **CSRF Protection**: Token-based request validation

### Production Recommendations

1. **HTTPS**: Always use HTTPS in production
2. **Cookie Security**: Implement secure, HTTP-only cookies
3. **Rate Limiting**: Add rate limiting for authentication attempts
4. **Audit Logging**: Implement comprehensive authentication logging
5. **Multi-Factor Authentication**: Consider additional MFA options
6. **SMS Verification**: Use reliable SMS providers for OTP delivery
7. **Login Method Security**: Implement proper security for both login methods
8. **Input Validation**: Server-side validation in addition to client-side
9. **Security Headers**: Implement proper security headers
10. **Regular Security Audits**: Conduct periodic security reviews

## Testing

### Component Testing

The authentication components are designed for easy testing:

```typescript
// Example test structure
describe('AuthForm', () => {
  it('should switch between login and register tabs', () => {
    // Test implementation
  })
  
  it('should toggle between password and OTP login methods', () => {
    // Test implementation
  })
  
  it('should validate form inputs including role selection', () => {
    // Test implementation
  })
  
  it('should handle phone-based OTP verification', () => {
    // Test implementation
  })
  
  it('should validate role selection for all forms', () => {
    // Test implementation
  })
  
  it('should sanitize input to prevent XSS attacks', () => {
    // Test implementation
  })
  
  it('should show password visibility toggle', () => {
    // Test implementation
  })
  
  it('should format phone numbers with +91 prefix', () => {
    // Test implementation
  })
})
```

### Validation Testing

Test the comprehensive validation system:

```typescript
describe('Validation Utils', () => {
  it('should validate email format correctly', () => {
    // Test implementation
  })
  
  it('should validate phone number format with +91 prefix', () => {
    // Test implementation
  })
  
  it('should validate password strength requirements', () => {
    // Test implementation
  })
  
  it('should sanitize dangerous input characters', () => {
    // Test implementation
  })
  
  it('should validate OTP format (6 digits)', () => {
    // Test implementation
  })
})
```

### Integration Testing

Test the complete authentication flow:

1. **Password Login**: Complete password-based authentication
2. **OTP Login**: Complete OTP-based authentication
3. **User Registration**: Complete registration process with role selection
4. **Phone OTP Verification**: Verify OTP functionality via phone
5. **Route Protection**: Verify protected route access
6. **Session Management**: Test authentication persistence
7. **Role-Based Access**: Verify role-specific functionality
8. **Input Validation**: Test all validation rules
9. **Input Sanitization**: Test XSS prevention
10. **Form Submission**: Test complete form workflows

## Maintenance and Updates

### Code Quality

- **TypeScript**: Full type safety and IntelliSense support
- **ESLint**: Code quality and consistency enforcement
- **Prettier**: Consistent code formatting
- **Documentation**: Comprehensive inline documentation
- **Unit Tests**: Comprehensive test coverage for validation logic

### Future Enhancements

1. **Social Authentication**: Google, Facebook, Apple login
2. **Advanced MFA**: Hardware tokens, biometric authentication
3. **Role-Based Permissions**: Granular permission system for each role
4. **Audit Trail**: Comprehensive user activity logging
5. **API Integration**: Real backend service integration
6. **SMS Gateway Integration**: Multiple SMS providers for OTP delivery
7. **Additional Login Methods**: Biometric, hardware key authentication
8. **Enhanced Validation**: Custom validation rules and messages
9. **Accessibility**: Improved screen reader and keyboard navigation
10. **Internationalization**: Multi-language support

## Troubleshooting

### Common Issues

1. **Authentication State Not Persisting**: Check localStorage and context setup
2. **OTP Not Working**: Verify OTP verification logic and mock data
3. **Protected Routes Not Working**: Ensure ProtectedRoute component is properly implemented
4. **Form Validation Errors**: Check validation rules and error handling
5. **Role Selection Issues**: Verify role dropdown functionality
6. **Login Method Toggle Issues**: Check login method state management
7. **Phone Number Formatting**: Verify phone validation and formatting logic
8. **Password Toggle Not Working**: Check password visibility state management
9. **Validation Not Showing**: Verify showValidation prop and touchedFields state
10. **Input Sanitization Issues**: Check sanitization functions and character filtering

### Debug Mode

Enable debug mode for development:

```typescript
// In AuthContext.tsx
const DEBUG_MODE = process.env.NODE_ENV === 'development'

if (DEBUG_MODE) {
  console.log('Auth state:', state)
  console.log('Auth actions:', { login, loginWithOTP, register, verifyOTP })
  console.log('User role:', user?.role)
  console.log('Login method:', loginMethod)
}

// In validation.ts
const DEBUG_VALIDATION = process.env.NODE_ENV === 'development'

if (DEBUG_VALIDATION) {
  console.log('Validation result:', validationResult)
  console.log('Sanitized input:', sanitizedInput)
}
```

## Conclusion

This authentication system provides a robust, secure, and user-friendly foundation for the Aspire Property Management application. It follows modern development practices and is designed for easy maintenance and future enhancements.

The system now includes:
- **Dual login options** (password and OTP-based)
- **Role-based authentication** for different user types
- **Phone-based OTP verification** for enhanced security
- **Comprehensive user management** with role display
- **Professional UI/UX** with role-specific styling
- **Flexible authentication methods** for user preference
- **Advanced form validation** with real-time feedback
- **Input sanitization** for security
- **Password visibility toggle** for better UX
- **Phone number formatting** with +91 prefix and validation

For questions or support, refer to the component documentation and type definitions in the source code.
