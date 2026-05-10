import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import Navbar from '@/components/Navbar'
import { ConditionalFooter } from '@/components/ConditionalFooter'
import GlobalChatbot from '@/components/GlobalChatbot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aspire Prop Management',
  description: 'Premium property management and real estate services',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Flaticon UIcons (brands) for fi fi-brands-* icons */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@flaticon/flaticon-uicons/css/brands/all.css" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-1 overflow-x-hidden">
            {children}
          </main>
          <ConditionalFooter />
        </div>
        <GlobalChatbot />
      </body>
    </html>
  )
}
