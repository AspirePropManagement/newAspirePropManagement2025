import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'New Aspire Property Management',
  description: 'Modern property management system built with Next.js',
}

/**
 * Root layout component that wraps all pages
 * Implements the Single Responsibility Principle by only handling layout concerns
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="aspire">
      <body className={inter.className}>
        <AuthProvider>
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
