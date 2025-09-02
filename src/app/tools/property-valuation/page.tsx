import React from 'react';
import { PropertyValuation } from '@/components/tools/PropertyValuation';

/**
 * Property Valuation page
 * Provides property valuation and market price estimation functionality
 */
export default function PropertyValuationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-8">
      <PropertyValuation />
    </div>
  );
}
