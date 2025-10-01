'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Dashboard page redirects to admin dashboard
 * The comprehensive dashboard is now located at /admin
 */
export default function DashboardPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to admin dashboard
    router.push('/admin');
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}