'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Footer } from './Footer'
import { footerConfig } from '@/config/footerConfig'

/**
 * ConditionalFooter component that conditionally renders the footer
 * based on the current route and other conditions
 */
export function ConditionalFooter() {
  const pathname = usePathname()
  
  // Check if current path should hide footer
  const shouldHideFooter = footerConfig.hiddenPaths.some(path => 
    pathname.startsWith(path)
  )
  
  // Don't render footer on specific pages
  if (shouldHideFooter) {
    return null
  }
  
  return <Footer />
}

/**
 * Hook to check if footer should be shown
 */
export function useShouldShowFooter() {
  const pathname = usePathname()
  
  return !footerConfig.hiddenPaths.some(path => pathname.startsWith(path))
}
