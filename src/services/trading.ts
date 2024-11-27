import OpenAI from 'openai';
import { NewsItem, Settings, TradingOpportunity } from '../types';

export async function analyzeTradingOpportunity(
  news: NewsItem[],
  settings: Settings
): Promise<TradingOpportunity> {
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

    const systemPrompt = `You are an expert Forex trader. Analyze the provided news and identify the best trading opportunity. Consider:
1. Market sentiment and trends
2. Key support and resistance levels
3. Risk/reward ratio
4. Technical and fundamental factors

Format your response as JSON with this structure:
{
  "summary": "Brief opportunity description",
  "analysis": "Detailed market analysis",
  "entryPoints": ["Entry point 1", "Entry point 2"],
  "riskManagement": ["Stop loss strategy", "Take profit levels"]
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
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const analysis = JSON.parse(content);
    
    return {
      summary: String(analysis.summary || ''),
      analysis: String(analysis.analysis || ''),
      entryPoints: Array.isArray(analysis.entryPoints) 
        ? analysis.entryPoints.map(String)
        : [],
      riskManagement: Array.isArray(analysis.riskManagement)
        ? analysis.riskManagement.map(String)
        : []
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Analysis error: ${error.message}`);
    }
    throw new Error('An unexpected error occurred during analysis');
  }
}