/**
 * Environment variable validation utility
 * Provides safe access to environment variables with fallbacks
 */

export const env = {
  // Supabase Configuration
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  
  // OpenAI Configuration
  openaiKey: process.env.OPENAI_KEY || '',
  
  // SMTP Configuration
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: parseInt(process.env.SMTP_PORT || '587'),
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  adminEmail: process.env.ADMIN_EMAIL || '',
  
  // NextAuth Configuration
  nextAuthSecret: process.env.NEXTAUTH_SECRET || '',
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  
  // Database Configuration
  databaseUrl: process.env.DATABASE_URL || '',
} as const

/**
 * Check if required environment variables are available
 */
export function validateEnvironment() {
  const missing: string[] = []
  
  if (!env.supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!env.supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  
  return {
    isValid: missing.length === 0,
    missing,
  }
}

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured() {
  return !!(env.supabaseUrl && env.supabaseAnonKey)
}

/**
 * Check if OpenAI is properly configured
 */
export function isOpenAIConfigured() {
  return !!env.openaiKey
}
