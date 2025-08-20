/**
 * Authentication-related type definitions
 * Implements Interface Segregation Principle by separating concerns into focused interfaces
 */

export type UserRole = 'builder' | 'agent' | 'admin' | 'buyer'

export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  isVerified: boolean
  phoneVerified?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
  role: UserRole
}

export interface OTPLoginCredentials {
  phone: string
  role: UserRole
}

export interface RegisterCredentials {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  role: UserRole
}

export interface OTPVerification {
  phone: string
  otp: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  loginWithOTP: (credentials: OTPLoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  verifyOTP: (verification: OTPVerification) => Promise<void>
  logout: () => void
  resendOTP: (phone: string) => Promise<void>
  sendOTP: (phone: string, verifier: any) => Promise<any>
  verifyOTPAndSignIn: (confirmationResult: any, otpCode: string, role: UserRole) => Promise<void>
  signInWithGoogle: (role: UserRole) => Promise<void>
}
