import axios from 'axios';
import { NewsItem } from '../types/news';
import { ApiError } from '../types/errors';
import { parseRSSContent } from './rss-parser';
import OpenAI from 'openai';
import { Settings, CurrencyStrength, Correlation } from '../types';
import { extractMarketContext, analyzeTechnicalFactors } from './market-analysis';

const FOREX_FEED_URL = 'https://www.forexlive.com/feed/news';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export async function fetchForexNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(FOREX_FEED_URL)}`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
      }
    });

    if (!response.data) {
      throw new Error('No data received from RSS feed');
    }

    return await parseRSSContent(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Server response timeout');
      }
      if (error.response) {
        throw new Error(`Server error: ${error.response.status}`);
      }
      throw new Error(`Network error: ${error.message}`);
    }
    
    if (error instanceof Error) {
      throw new Error(`RSS feed error: ${error.message}`);
    }
    
    throw new Error('An unexpected error occurred');
  }
}

export async function analyzeNews(news: NewsItem[], settings: Settings): Promise<{
  strengths: CurrencyStrength[];
  correlations: Correlation[];
}> {
  if (!settings.apiKey) {
    throw new Error('OpenAI API key is required');
  }

  if (!news.length) {
    throw new Error('No news available for analysis');
  }

  try {
    const openai = new OpenAI({
      apiKey: settings.apiKey,
      dangerouslyAllowBrowser: true
    });

    const marketContext = extractMarketContext(news);
    const technicalFactors = analyzeTechnicalFactors(news);

    const systemPrompt = `You are an expert Forex market analyst with deep knowledge of technical and fundamental analysis. Analyze the provided news and market context to:

1. Calculate strength scores (-1 to 1) for major currencies (USD, EUR, GBP, JPY, AUD, NZD, CAD, CHF) considering:
   - Central bank policies and interest rate expectations
   - Economic indicators and their impact
   - Market sentiment and risk appetite
   - Technical patterns and price action

2. Determine sentiment (bullish/bearish/neutral) based on:
   - Strength score trend
   - Market positioning
   - News impact assessment
   - Technical analysis signals

3. Identify correlations between currency pairs considering:
   - Historical price relationships
   - Common economic factors
   - Risk sentiment impact
   - Technical pattern alignment

4. Provide detailed trading recommendations based on:
   - Correlation strength and stability
   - Risk/reward scenarios
   - Entry and exit levels
   - Risk management guidelines

Market Context Summary:
${JSON.stringify(marketContext, null, 2)}

Technical Analysis:
${JSON.stringify(technicalFactors, null, 2)}

Format your response as JSON with this structure:
{
  "strengths": [
    {
      "currency": "USD",
      "strength": 0.8,
      "sentiment": "bullish",
      "rationale": "Strong economic data, hawkish Fed stance, safe-haven flows"
    }
  ],
  "correlations": [
    {
      "pair1": "EUR/USD",
      "pair2": "GBP/USD",
      "strength": 0.85,
      "recommendation": "Strong positive correlation - consider parallel trades",
      "rationale": "Similar economic conditions, aligned central bank policies"
    }
  ]
}`;

    const newsText = news
      .map(item => `${item.title}\n${item.description}`)
      .join('\n\n')
      .slice(0, 4000);

    const response = await openai.chat.completions.create({
      model: settings.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: newsText }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch {
      throw new Error('Invalid response from OpenAI');
    }
    
    if (!analysis.strengths?.length || !analysis.correlations?.length) {
      throw new Error('Incomplete analysis data');
    }

    return {
      strengths: analysis.strengths.map((s: any) => ({
        currency: String(s.currency || ''),
        strength: Math.max(-1, Math.min(1, parseFloat(s.strength) || 0)),
        sentiment: (['bullish', 'bearish', 'neutral'].includes(s.sentiment) 
          ? s.sentiment 
          : 'neutral') as 'bullish' | 'bearish' | 'neutral',
        rationale: String(s.rationale || '')
      })),
      correlations: analysis.correlations.map((c: any) => ({
        pair1: String(c.pair1 || ''),
        pair2: String(c.pair2 || ''),
        strength: Math.max(-1, Math.min(1, parseFloat(c.strength) || 0)),
        recommendation: String(c.recommendation || ''),
        rationale: String(c.rationale || '')
      }))
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Analysis error: ${error.message}`);
    }
    throw new Error('An unexpected error occurred during analysis');
  }
}