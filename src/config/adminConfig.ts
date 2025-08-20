/**
 * Admin Configuration
 * List of authorized admin emails for the system
 * Only users with these emails can access admin functionality
 */

export const AUTHORIZED_ADMIN_EMAILS = [
  'admin@aspireprop.com',
  'sanjugsonowalofficials@gmail.com',
  'admin@yourcompany.com',
  // Add more authorized admin emails here
]

/**
 * Check if an email is authorized for admin access
 */
export function isAuthorizedAdmin(email: string): boolean {
  if (!email) return false
  return AUTHORIZED_ADMIN_EMAILS.includes(email.toLowerCase())
}
