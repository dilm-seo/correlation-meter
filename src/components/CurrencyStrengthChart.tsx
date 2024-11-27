import React from 'react';
import { CurrencyStrength } from '../types';
import { TrendingUp, Info } from 'lucide-react';

interface CurrencyStrengthChartProps {
  strengths: CurrencyStrength[];
}

export function CurrencyStrengthChart({ strengths }: CurrencyStrengthChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Force des Devises</h2>
      </div>

      <div className="space-y-4">
        {strengths.map((currency) => (
          <div key={currency.currency} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">{currency.currency}</span>
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg z-10">
                    {currency.rationale}
                  </div>
                </div>
              </div>
              <span className={`text-sm font-medium ${
                currency.sentiment === 'bullish' ? 'text-green-600' :
                currency.sentiment === 'bearish' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {currency.sentiment === 'bullish' ? 'HAUSSIER' :
                 currency.sentiment === 'bearish' ? 'BAISSIER' :
                 'NEUTRE'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  currency.sentiment === 'bullish' ? 'bg-green-600' :
                  currency.sentiment === 'bearish' ? 'bg-red-600' :
                  'bg-gray-600'
                }`}
                style={{ width: `${Math.abs(currency.strength * 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}