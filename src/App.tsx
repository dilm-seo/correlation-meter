import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Settings } from './types';
import { SettingsPanel } from './components/SettingsPanel';
import { NewsFeed } from './components/NewsFeed';
import { CurrencyStrengthChart } from './components/CurrencyStrengthChart';
import { CorrelationTable } from './components/CorrelationTable';
import { fetchForexNews, analyzeNews } from './services/api';
import { AlertCircle } from 'lucide-react';

function App() {
  const [settings, setSettings] = useState<Settings>({
    apiKey: '',
    model: 'gpt-4-turbo-preview',
  });

  const { 
    data: news = [], 
    isLoading: isLoadingNews, 
    error: newsError,
    refetch: refetchNews
  } = useQuery(
    'forexNews',
    fetchForexNews,
    { 
      refetchInterval: 300000,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error) => console.error('Error fetching news:', error)
    }
  );

  const { 
    data: analysis, 
    isLoading: isLoadingAnalysis,
    error: analysisError
  } = useQuery(
    ['analysis', news, settings],
    () => analyzeNews(news, settings),
    { 
      enabled: news.length > 0 && !!settings.apiKey,
      retry: 2,
      retryDelay: 1000,
      onError: (error) => console.error('Error analyzing news:', error)
    }
  );

  const error = newsError || analysisError;
  const showError = error ? (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            {error instanceof Error ? error.message : 'Une erreur est survenue. Veuillez réessayer.'}
          </p>
          <button
            onClick={() => refetchNews()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Analyse Forex en Direct
        </h1>

        {showError}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <SettingsPanel
              settings={settings}
              onSettingsChange={setSettings}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-8">
              {analysis?.strengths.length > 0 && (
                <CurrencyStrengthChart
                  strengths={analysis.strengths}
                />
              )}
              
              {analysis?.correlations.length > 0 && (
                <CorrelationTable
                  correlations={analysis.correlations}
                />
              )}

              <NewsFeed
                news={news}
                isLoading={isLoadingNews}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;