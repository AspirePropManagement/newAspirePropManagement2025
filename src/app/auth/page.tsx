'use client'

import { useState } from 'react'
import SupabaseAuthForm from '@/components/SupabaseAuthForm'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  const handleModeChange = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Aspire Property Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>
        
        <SupabaseAuthForm mode={mode} onModeChange={handleModeChange} />
      </div>
    </div>
  )
}
