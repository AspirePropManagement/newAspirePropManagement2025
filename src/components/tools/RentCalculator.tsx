'use client';

import React, { useState, useEffect } from 'react';

/**
 * Rent Calculator component for calculating rental yield, ROI, and optimal rent
 */
export const RentCalculator: React.FC = () => {
  const [propertyValue, setPropertyValue] = useState<string>('');
  const [monthlyRent, setMonthlyRent] = useState<string>('');
  const [annualRent, setAnnualRent] = useState<string>('');
  const [maintenanceCost, setMaintenanceCost] = useState<string>('');
  const [propertyTax, setPropertyTax] = useState<string>('');
  const [insurance, setInsurance] = useState<string>('');
  const [rentalYield, setRentalYield] = useState<number>(0);
  const [netRentalYield, setNetRentalYield] = useState<number>(0);
  const [annualROI, setAnnualROI] = useState<number>(0);
  const [optimalRent, setOptimalRent] = useState<number>(0);

  // Calculate rental metrics when inputs change
  useEffect(() => {
    if (propertyValue && (monthlyRent || annualRent)) {
      const value = parseFloat(propertyValue);
      const monthly = parseFloat(monthlyRent) || 0;
      const annual = parseFloat(annualRent) || 0;
      const maintenance = parseFloat(maintenanceCost) || 0;
      const tax = parseFloat(propertyTax) || 0;
      const insuranceCost = parseFloat(insurance) || 0;

      if (value > 0 && (monthly > 0 || annual > 0)) {
        const actualAnnualRent = annual > 0 ? annual : monthly * 12;
        const grossYield = (actualAnnualRent / value) * 100;
        const totalExpenses = maintenance + tax + insuranceCost;
        const netAnnualRent = actualAnnualRent - totalExpenses;
        const netYield = (netAnnualRent / value) * 100;
        
        // Calculate optimal rent for 8% yield (industry standard)
        const optimalAnnualRent = value * 0.08;
        const optimalMonthlyRent = optimalAnnualRent / 12;

        setRentalYield(grossYield);
        setNetRentalYield(netYield);
        setAnnualROI(netYield);
        setOptimalRent(optimalMonthlyRent);
      }
    } else {
      setRentalYield(0);
      setNetRentalYield(0);
      setAnnualROI(0);
      setOptimalRent(0);
    }
  }, [propertyValue, monthlyRent, annualRent, maintenanceCost, propertyTax, insurance]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleReset = () => {
    setPropertyValue('');
    setMonthlyRent('');
    setAnnualRent('');
    setMaintenanceCost('');
    setPropertyTax('');
    setInsurance('');
  };

  const getYieldStatus = (yieldValue: number) => {
    if (yieldValue >= 8) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (yieldValue >= 6) return { status: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (yieldValue >= 4) return { status: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'Low', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const yieldStatus = getYieldStatus(netRentalYield);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rent Calculator</h1>
        <p className="text-gray-600">Calculate rental yield, ROI, and determine optimal rent for your property</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details</h2>
          
          <div className="space-y-6">
            {/* Property Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Value (₹)
              </label>
              <input
                type="number"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
                placeholder="Enter property value"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              />
            </div>

            {/* Monthly Rent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Rent (₹)
              </label>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="Enter monthly rent"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              />
            </div>

            {/* Annual Rent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Rent (₹) - Optional
              </label>
              <input
                type="number"
                value={annualRent}
                onChange={(e) => setAnnualRent(e.target.value)}
                placeholder="Enter annual rent"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              />
            </div>

            {/* Maintenance Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Maintenance Cost (₹)
              </label>
              <input
                type="number"
                value={maintenanceCost}
                onChange={(e) => setMaintenanceCost(e.target.value)}
                placeholder="Enter maintenance cost"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              />
            </div>

            {/* Property Tax */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Property Tax (₹)
              </label>
              <input
                type="number"
                value={propertyTax}
                onChange={(e) => setPropertyTax(e.target.value)}
                placeholder="Enter property tax"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              />
            </div>

            {/* Insurance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Insurance (₹)
              </label>
              <input
                type="number"
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                placeholder="Enter insurance cost"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Rental Analysis</h2>
          
          {rentalYield > 0 ? (
            <div className="space-y-6">
              {/* Yield Status */}
              <div className={`${yieldStatus.bg} rounded-lg p-4`}>
                <div className="text-sm font-medium mb-1">Rental Yield Status</div>
                <div className={`text-2xl font-bold ${yieldStatus.color}`}>{yieldStatus.status}</div>
              </div>

              {/* Gross Rental Yield */}
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-orange-600 font-medium mb-1">Gross Rental Yield</div>
                <div className="text-3xl font-bold text-orange-600">{rentalYield.toFixed(2)}%</div>
              </div>

              {/* Net Rental Yield */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 font-medium mb-1">Net Rental Yield</div>
                <div className="text-2xl font-bold text-blue-600">{netRentalYield.toFixed(2)}%</div>
              </div>

              {/* Annual ROI */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-600 font-medium mb-1">Annual ROI</div>
                <div className="text-2xl font-bold text-green-600">{annualROI.toFixed(2)}%</div>
              </div>

              {/* Optimal Rent */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-purple-600 font-medium mb-1">Optimal Monthly Rent</div>
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(optimalRent)}</div>
                <div className="text-xs text-purple-500 mt-1">For 8% yield</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <p className="text-gray-500">Enter property details to calculate rental metrics</p>
            </div>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">About Rental Yield</h3>
        <div className="text-blue-800 space-y-2">
          <p>• Rental yield is the annual rental income as a percentage of the property value.</p>
          <p>• A good rental yield typically ranges from 6-8% in most Indian cities.</p>
          <p>• Net rental yield accounts for expenses like maintenance, taxes, and insurance.</p>
          <p>• Higher rental yields indicate better investment potential, but consider location and property appreciation.</p>
        </div>
      </div>
    </div>
  );
};
