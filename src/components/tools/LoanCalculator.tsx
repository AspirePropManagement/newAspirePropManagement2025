'use client';

import React, { useState, useEffect } from 'react';

/**
 * Loan Calculator component for determining loan eligibility and maximum loan amount
 */
export const LoanCalculator: React.FC = () => {
  const [monthlyIncome, setMonthlyIncome] = useState<string>('');
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>('');
  const [existingEMI, setExistingEMI] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('8.5');
  const [tenure, setTenure] = useState<string>('20');
  const [maxLoanAmount, setMaxLoanAmount] = useState<number>(0);
  const [eligibleEMI, setEligibleEMI] = useState<number>(0);
  const [debtToIncomeRatio, setDebtToIncomeRatio] = useState<number>(0);

  // Calculate loan eligibility when inputs change
  useEffect(() => {
    if (monthlyIncome && monthlyExpenses) {
      const income = parseFloat(monthlyIncome);
      const expenses = parseFloat(monthlyExpenses);
      const existing = parseFloat(existingEMI) || 0;
      const rate = parseFloat(interestRate) / 12 / 100;
      const years = parseFloat(tenure);

      if (income > 0 && expenses >= 0 && rate >= 0 && years > 0) {
        // Calculate available income (40% of income - existing EMI)
        const availableIncome = (income * 0.4) - existing;
        
        if (availableIncome > 0) {
          const months = years * 12;
          const maxLoan = (availableIncome * (Math.pow(1 + rate, months) - 1)) / (rate * Math.pow(1 + rate, months));
          
          setMaxLoanAmount(maxLoan);
          setEligibleEMI(availableIncome);
          setDebtToIncomeRatio(((existing + availableIncome) / income) * 100);
        } else {
          setMaxLoanAmount(0);
          setEligibleEMI(0);
          setDebtToIncomeRatio((existing / income) * 100);
        }
      }
    } else {
      setMaxLoanAmount(0);
      setEligibleEMI(0);
      setDebtToIncomeRatio(0);
    }
  }, [monthlyIncome, monthlyExpenses, existingEMI, interestRate, tenure]);

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
  const handleMonthlyIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validated = validateNumberInput(e.target.value);
    setMonthlyIncome(validated);
  };

  const handleMonthlyExpensesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validated = validateNumberInput(e.target.value);
    setMonthlyExpenses(validated);
  };

  const handleExistingEMIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validated = validateNumberInput(e.target.value);
    setExistingEMI(validated);
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validated = validateNumberInput(e.target.value);
    setInterestRate(validated);
  };

  const handleReset = () => {
    setMonthlyIncome('');
    setMonthlyExpenses('');
    setExistingEMI('');
    setInterestRate('8.5');
    setTenure('20');
  };

  const getEligibilityStatus = () => {
    if (debtToIncomeRatio > 50) return { status: 'Not Eligible', color: 'text-red-600', bg: 'bg-red-50' };
    if (debtToIncomeRatio > 40) return { status: 'Limited Eligibility', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'Eligible', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const eligibility = getEligibilityStatus();

  return (
    <div className="w-full h-screen pt-20 px-4 pb-4 bg-white overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Loan Calculator</h1>
        <p className="text-sm text-gray-600">Determine your loan eligibility and calculate maximum loan amount you can get</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Form */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h2>
          
          <div className="space-y-4">
            {/* Monthly Income */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Income (₹)
              </label>
              <input
                type="text"
                value={monthlyIncome}
                onChange={handleMonthlyIncomeChange}
                placeholder="Enter your monthly income"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>

            {/* Monthly Expenses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Expenses (₹)
              </label>
              <input
                type="text"
                value={monthlyExpenses}
                onChange={handleMonthlyExpensesChange}
                placeholder="Enter your monthly expenses"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>

            {/* Existing EMI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Existing EMI (₹) - Optional
              </label>
              <input
                type="text"
                value={existingEMI}
                onChange={handleExistingEMIChange}
                placeholder="Enter existing EMI payments"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Interest Rate (%)
              </label>
              <input
                type="text"
                value={interestRate}
                onChange={handleInterestRateChange}
                placeholder="Enter expected interest rate"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>

            {/* Tenure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Tenure: {tenure} Years
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Loan Eligibility</h2>
          
          {maxLoanAmount > 0 ? (
            <div className="space-y-3">
              {/* Eligibility Status */}
              <div className={`${eligibility.bg} rounded-lg p-3`}>
                <div className="text-xs font-medium mb-1">Can you get a loan?</div>
                <div className={`text-lg font-bold ${eligibility.color}`}>{eligibility.status}</div>
                <div className="text-xs mt-1">
                  {eligibility.status === 'Eligible' && 'Great! You can apply for a loan'}
                  {eligibility.status === 'Limited Eligibility' && 'You might get a smaller loan amount'}
                  {eligibility.status === 'Not Eligible' && 'You may need to increase your income or reduce expenses'}
                </div>
              </div>

              {/* Maximum Loan Amount */}
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-xs text-orange-600 font-medium mb-1">Maximum loan you can get</div>
                <div className="text-lg font-bold text-orange-600">{formatCurrency(maxLoanAmount)}</div>
                <div className="text-xs text-orange-500 mt-1">Based on your income and expenses</div>
              </div>

              {/* Eligible EMI */}
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-blue-600 font-medium mb-1">Monthly payment you can afford</div>
                <div className="text-lg font-bold text-blue-600">{formatCurrency(eligibleEMI)}</div>
                <div className="text-xs text-blue-500 mt-1">This fits your budget comfortably</div>
              </div>

              {/* Debt to Income Ratio */}
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-xs text-purple-600 font-medium mb-1">Your debt percentage</div>
                <div className="text-lg font-bold text-purple-600">{debtToIncomeRatio.toFixed(1)}%</div>
                <div className="text-xs text-purple-500 mt-1">
                  {debtToIncomeRatio <= 40 ? 'Good! Below 40% is ideal' : 
                   debtToIncomeRatio <= 50 ? 'Moderate risk - consider reducing' : 
                   'High risk - try to reduce debt'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">Enter your financial details to check loan eligibility</p>
            </div>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-4 bg-blue-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">How Banks Decide Your Loan</h3>
        <div className="text-xs text-blue-800 space-y-1">
          <p>• <strong>Income Rule:</strong> Banks allow you to use 40% of your monthly income for loan payments</p>
          <p>• <strong>Debt Percentage:</strong> Keep your total debt below 40% of income for better chances</p>
          <p>• <strong>Existing Loans:</strong> If you already have loans, they reduce how much new loan you can get</p>
          <p>• <strong>Remember:</strong> This is just an estimate. Banks also check your credit score, job stability, and property value</p>
        </div>
      </div>
    </div>
  );
};
