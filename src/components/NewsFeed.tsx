import React from 'react';
import { NewsItem } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { Newspaper, ExternalLink } from 'lucide-react';

interface NewsFeedProps {
  news: NewsItem[];
  isLoading: boolean;
}

export function NewsFeed({ news, isLoading }: NewsFeedProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-100 h-24 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Dernières Actualités</h2>
      </div>
      
      {news.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-2 whitespace-pre-line">{item.content}</p>
              <div className="flex items-center gap-4">
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(item.pubDate), { addSuffix: true })}
                </p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Lire plus <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}