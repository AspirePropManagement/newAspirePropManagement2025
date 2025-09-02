'use client';

import React, { useState, useEffect } from 'react';

/**
 * EMI Calculator component for calculating monthly EMI payments
 * Supports home loans, personal loans, and other property-related loans
 */
export const EMICalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [tenure, setTenure] = useState<string>('20');
  const [emi, setEmi] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  // Calculate EMI when inputs change
  useEffect(() => {
    if (principal && interestRate && tenure) {
      const p = parseFloat(principal);
      const r = parseFloat(interestRate) / 12 / 100; // Monthly interest rate
      const n = parseFloat(tenure) * 12; // Total months

      if (p > 0 && r >= 0 && n > 0) {
        const emiAmount = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const total = emiAmount * n;
        const interest = total - p;

        setEmi(emiAmount);
        setTotalAmount(total);
        setTotalInterest(interest);
      }
    } else {
      setEmi(0);
      setTotalAmount(0);
      setTotalInterest(0);
    }
  }, [principal, interestRate, tenure]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Validation function to allow only numbers and decimal point
  const validateNumberInput = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const cleaned = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    return cleaned;
  };

  // Handle input changes with validation
  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validated = validateNumberInput(e.target.value);
    setPrincipal(validated);
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validated = validateNumberInput(e.target.value);
    setInterestRate(validated);
  };

  const handleReset = () => {
    setPrincipal('');
    setInterestRate('');
    setTenure('20');
  };

  return (
    <div className="w-full h-screen pt-20 px-4 pb-4 bg-white overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">EMI Calculator</h1>
        <p className="text-sm text-gray-600">Calculate your monthly EMI payments for home loans and property investments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Form */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Loan Details</h2>
          
          <div className="space-y-4">
            {/* Principal Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Principal Amount (₹)
              </label>
              <input
                type="text"
                value={principal}
                onChange={handlePrincipalChange}
                placeholder="Enter loan amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Interest Rate (%)
              </label>
              <input
                type="text"
                value={interestRate}
                onChange={handleInterestRateChange}
                placeholder="Enter interest rate"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>

            {/* Tenure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Tenure: {tenure} Years
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #f97316 0%, #f97316 ${((parseFloat(tenure || '1') - 1) / 99) * 100}%, #e5e7eb ${((parseFloat(tenure || '1') - 1) / 99) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 Year</span>
                  <span>100 Years</span>
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Loan Summary</h2>
          
          {emi > 0 ? (
            <div className="space-y-3">
              {/* Monthly EMI */}
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-xs text-orange-600 font-medium mb-1">You will pay monthly</div>
                <div className="text-lg font-bold text-orange-600">{formatCurrency(emi)}</div>
                <div className="text-xs text-orange-500 mt-1">Every month for {tenure} years</div>
              </div>

              {/* Total Amount */}
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-blue-600 font-medium mb-1">Total you will pay</div>
                <div className="text-lg font-bold text-blue-600">{formatCurrency(totalAmount)}</div>
                <div className="text-xs text-blue-500 mt-1">Over the entire loan period</div>
              </div>

              {/* Total Interest */}
              <div className="bg-red-50 rounded-lg p-3">
                <div className="text-xs text-red-600 font-medium mb-1">Interest you will pay</div>
                <div className="text-lg font-bold text-red-600">{formatCurrency(totalInterest)}</div>
                <div className="text-xs text-red-500 mt-1">Extra amount to the bank</div>
              </div>

              {/* Principal Amount */}
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs text-green-600 font-medium mb-1">Amount you borrowed</div>
                <div className="text-lg font-bold text-green-600">{formatCurrency(parseFloat(principal))}</div>
                <div className="text-xs text-green-500 mt-1">The actual loan amount</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">Enter loan details to calculate EMI</p>
            </div>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-4 bg-blue-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">How This Works</h3>
        <div className="text-xs text-blue-800 space-y-1">
          <p>• <strong>Monthly Payment:</strong> What you'll pay every month to the bank</p>
          <p>• <strong>Total Payment:</strong> Total amount you'll pay over the entire loan period</p>
          <p>• <strong>Interest Amount:</strong> Extra money you pay to the bank for borrowing</p>
          <p>• <strong>Loan Amount:</strong> Actual money you receive from the bank</p>
        </div>
      </div>
    </div>
  );
};
