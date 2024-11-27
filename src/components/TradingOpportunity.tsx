import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { useQuery } from 'react-query';
import { NewsItem, Settings } from '../types';
import { analyzeTradingOpportunity } from '../services/trading';

interface TradingOpportunityProps {
  news: NewsItem[];
  settings: Settings;
}

export function TradingOpportunity({ news, settings }: TradingOpportunityProps) {
  const {
    data: opportunity,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['tradingOpportunity', news, settings],
    () => analyzeTradingOpportunity(news, settings),
    {
      enabled: false,
      retry: 1,
      staleTime: 30000,
    }
  );

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error instanceof Error ? error.message : 'Failed to analyze trading opportunity'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Trading Opportunity</h2>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Now'}
        </button>
      </div>

      {opportunity && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-md">
            <h3 className="font-semibold text-lg text-blue-900 mb-2">
              {opportunity.summary}
            </h3>
            <p className="text-blue-800">{opportunity.analysis}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">Entry Points</h4>
              <ul className="list-disc list-inside text-gray-600">
                {opportunity.entryPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">Risk Management</h4>
              <ul className="list-disc list-inside text-gray-600">
                {opportunity.riskManagement.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}