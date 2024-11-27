export interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  sentiment: string;
  impact: 'low' | 'medium' | 'high';
  category: string;
}

export interface ApiError extends Error {
  code: string;
  message: string;
  details?: string;
}

export interface Settings {
  apiKey: string;
  model: string;
}

export interface CurrencyStrength {
  currency: string;
  strength: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  rationale: string;
}

export interface Correlation {
  pair1: string;
  pair2: string;
  strength: number;
  recommendation: string;
  rationale: string;
}

export interface TradingOpportunity {
  summary: string;
  analysis: string;
  entryPoints: string[];
  riskManagement: string[];
}

export interface MarketContext {
  monetaryPolicy: NewsItem[];
  economicData: NewsItem[];
  geopoliticalEvents: NewsItem[];
  marketSentiment: NewsItem[];
}

export interface BreakoutSignal {
  type: string;
  direction: string;
  source: NewsItem;
}

export interface TechnicalFactors {
  supportLevels: number[];
  resistanceLevels: number[];
  trendPatterns: string[];
  breakoutSignals: BreakoutSignal[];
}