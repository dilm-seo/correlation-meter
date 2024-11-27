import React from 'react';
import { Correlation } from '../types';
import { GitCompare, Info } from 'lucide-react';

interface CorrelationTableProps {
  correlations: Correlation[];
}

export function CorrelationTable({ correlations }: CorrelationTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <GitCompare className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Corrélations des Paires</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paire 1
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paire 2
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Corrélation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recommandation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Analyse
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {correlations.map((correlation, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {correlation.pair1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {correlation.pair2}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(correlation.strength * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {correlation.recommendation}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 relative group">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg z-10">
                    {correlation.rationale}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}