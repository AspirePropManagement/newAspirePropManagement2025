import React from 'react';
import { RentCalculator } from '@/components/tools/RentCalculator';

/**
 * Rent Calculator page
 * Provides rental yield, ROI calculation, and optimal rent determination
 */
export default function RentCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-8">
      <RentCalculator />
    </div>
  );
}
