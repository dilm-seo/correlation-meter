export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
}

export interface CurrencyStrength {
  currency: string;
  strength: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface Correlation {
  pair1: string;
  pair2: string;
  strength: number;
  recommendation: string;
}

export interface Settings {
  apiKey: string;
  model: string;
}