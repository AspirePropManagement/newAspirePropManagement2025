"use client";

import React, { useMemo, useState } from "react";

export default function RoiCalculatorPage() {
  const [purchasePrice, setPurchasePrice] = useState<number | string>(10000000);
  const [monthlyRent, setMonthlyRent] = useState<number | string>(30000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number | string>(8000); // maintenance, taxes, mgmt, etc.
  const [cashInvested, setCashInvested] = useState<number | string>(2500000); // down payment + closing/repair

  const toNum = (v: number | string) => (typeof v === "number" ? v : parseFloat(v || "0"));

  const results = useMemo(() => {
    const price = toNum(purchasePrice);
    const rent = toNum(monthlyRent);
    const expenses = toNum(monthlyExpenses);
    const cash = toNum(cashInvested);

    const annualRent = rent * 12;
    const annualExpenses = expenses * 12;
    const noi = Math.max(annualRent - annualExpenses, 0); // Net Operating Income

    const capRate = price > 0 ? (noi / price) * 100 : 0; // %
    const simpleROI = cash > 0 ? (noi / cash) * 100 : 0; // % based on cash invested
    const rentalYield = price > 0 ? (annualRent / price) * 100 : 0; // % gross yield

    return { annualRent, annualExpenses, noi, capRate, simpleROI, rentalYield };
  }, [purchasePrice, monthlyRent, monthlyExpenses, cashInvested]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">ROI Calculator</h1>
          <p className="text-gray-600 mt-2">Quickly estimate ROI, Cap Rate and Rental Yield for your property investment.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price (₹)</label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  min={0}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Expenses (₹)</label>
                  <input
                    type="number"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    min={0}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Cash Invested (₹)</label>
                <input
                  type="number"
                  value={cashInvested}
                  onChange={(e) => setCashInvested(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">Includes down payment + closing/repair/other initial costs.</p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <p className="text-xs text-orange-700">Net Operating Income (Year)</p>
                <p className="text-2xl font-bold text-orange-700">₹{results.noi.toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-xs text-emerald-700">Cap Rate</p>
                <p className="text-2xl font-bold text-emerald-700">{results.capRate.toFixed(2)}%</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs text-blue-700">Simple ROI (Cash-on-Cash)</p>
                <p className="text-2xl font-bold text-blue-700">{results.simpleROI.toFixed(2)}%</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <p className="text-xs text-purple-700">Gross Rental Yield</p>
                <p className="text-2xl font-bold text-purple-700">{results.rentalYield.toFixed(2)}%</p>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600 space-y-2">
              <p>Cap Rate = NOI / Purchase Price. Simple ROI = NOI / Cash Invested.</p>
              <p>NOI = (Monthly Rent × 12) − (Monthly Expenses × 12).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
