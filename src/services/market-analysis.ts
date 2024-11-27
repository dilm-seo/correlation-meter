import { NewsItem, MarketContext, TechnicalFactors } from '../types';

export function extractMarketContext(news: NewsItem[]): MarketContext {
  const keywordPatterns = {
    monetary: /(interest rate|monetary policy|central bank|fed|ecb|boe|boj)/i,
    economic: /(gdp|inflation|employment|retail sales|pmi|manufacturing)/i,
    geopolitical: /(war|conflict|sanctions|trade tension|political|election)/i,
    sentiment: /(risk|sentiment|confidence|outlook|forecast)/i
  };

  const context: MarketContext = {
    monetaryPolicy: [],
    economicData: [],
    geopoliticalEvents: [],
    marketSentiment: []
  };

  news.forEach(item => {
    const text = `${item.title} ${item.description}`;
    
    if (keywordPatterns.monetary.test(text)) {
      context.monetaryPolicy.push(item);
    }
    if (keywordPatterns.economic.test(text)) {
      context.economicData.push(item);
    }
    if (keywordPatterns.geopolitical.test(text)) {
      context.geopoliticalEvents.push(item);
    }
    if (keywordPatterns.sentiment.test(text)) {
      context.marketSentiment.push(item);
    }
  });

  return context;
}

export function analyzeTechnicalFactors(news: NewsItem[]): TechnicalFactors {
  const patterns = {
    support: /support\s*(at|near|around)?\s*(\d+\.?\d*)/i,
    resistance: /resistance\s*(at|near|around)?\s*(\d+\.?\d*)/i,
    trend: /(bullish|bearish|upward|downward|sideways)\s*trend/i,
    breakout: /(breakout|breakdown|break)\s*(above|below|through)/i
  };

  const factors: TechnicalFactors = {
    supportLevels: new Set(),
    resistanceLevels: new Set(),
    trendPatterns: new Set(),
    breakoutSignals: []
  };

  news.forEach(item => {
    const text = `${item.title} ${item.description}`;
    
    const supportMatch = text.match(patterns.support);
    if (supportMatch?.[2]) {
      factors.supportLevels.add(parseFloat(supportMatch[2]));
    }

    const resistanceMatch = text.match(patterns.resistance);
    if (resistanceMatch?.[2]) {
      factors.resistanceLevels.add(parseFloat(resistanceMatch[2]));
    }

    const trendMatch = text.match(patterns.trend);
    if (trendMatch?.[1]) {
      factors.trendPatterns.add(trendMatch[1].toLowerCase());
    }

    const breakoutMatch = text.match(patterns.breakout);
    if (breakoutMatch) {
      factors.breakoutSignals.push({
        type: breakoutMatch[1].toLowerCase(),
        direction: breakoutMatch[2].toLowerCase(),
        source: item
      });
    }
  });

  return {
    supportLevels: Array.from(factors.supportLevels).sort((a, b) => a - b),
    resistanceLevels: Array.from(factors.resistanceLevels).sort((a, b) => a - b),
    trendPatterns: Array.from(factors.trendPatterns),
    breakoutSignals: factors.breakoutSignals
  };
}