export interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  sentiment: string;
  impact: 'low' | 'medium' | 'high';
  category: string;
}