/**
 * Validation utility functions for form fields
 * Implements comprehensive input validation and sanitization
 */

export interface ValidationResult {
  isValid: boolean
  error: string | null
}

/**
 * Validates email format and sanitizes input
 */
export function validateEmail(email: string): ValidationResult {
  const sanitizedEmail = email.trim().toLowerCase()
  
  if (!sanitizedEmail) {
    return { isValid: false, error: 'Email is required' }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(sanitizedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }
  
  if (sanitizedEmail.length > 254) {
    return { isValid: false, error: 'Email address is too long' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' }
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' }
  }
  
  // Check for at least one uppercase letter, one lowercase letter, and one number
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  
  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return { isValid: false, error: 'Password must contain uppercase, lowercase, and numbers' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validates name (letters, spaces, and common punctuation)
 */
export function validateName(name: string): ValidationResult {
  const sanitizedName = name.trim()
  
  if (!sanitizedName) {
    return { isValid: false, error: 'Name is required' }
  }
  
  if (sanitizedName.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' }
  }
  
  if (sanitizedName.length > 50) {
    return { isValid: false, error: 'Name is too long' }
  }
  
  // Allow letters, spaces, hyphens, apostrophes, and dots
  const nameRegex = /^[a-zA-Z\s\-'\.]+$/
  if (!nameRegex.test(sanitizedName)) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, apostrophes, and dots' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validates OTP (6 digits only)
 */
export function validateOTP(otp: string): ValidationResult {
  const sanitizedOTP = otp.trim()
  
  if (!sanitizedOTP) {
    return { isValid: false, error: 'OTP is required' }
  }
  
  if (sanitizedOTP.length !== 6) {
    return { isValid: false, error: 'OTP must be exactly 6 digits' }
  }
  
  if (!/^\d{6}$/.test(sanitizedOTP)) {
    return { isValid: false, error: 'OTP can only contain digits' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Sanitizes input by removing potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

/**
 * Validates form data for registration
 */
export function validateRegistrationForm(data: {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  role: string
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  
  const nameValidation = validateName(data.name)
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!
  }
  
  const emailValidation = validateEmail(data.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!
  }
  
  // Phone validation removed - allow any phone format
  
  const passwordValidation = validatePassword(data.password)
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error!
  }
  
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }
  
  if (!data.role) {
    errors.role = 'Please select a user role'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates form data for password login
 */
export function validatePasswordLoginForm(data: {
  email: string
  password: string
  role: string
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  
  const emailValidation = validateEmail(data.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!
  }
  
  if (!data.password) {
    errors.password = 'Password is required'
  }
  
  if (!data.role) {
    errors.role = 'Please select a user role'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validates form data for OTP login
 */
export function validateOTPLoginForm(data: {
  phone: string
  role: string
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  
  // Phone validation removed - allow any phone format
  
  if (!data.role) {
    errors.role = 'Please select a user role'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
