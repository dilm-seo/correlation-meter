import { NewsItem } from '../types/news';
import { ApiError } from '../types/errors';
import { createXMLParser, cleanXMLData, validateXMLData } from '../utils/xml-parser';
import { extractContent, decodeContent, cleanDescription } from '../utils/content-extractor';
import { sanitizeHtml } from '../utils/sanitizer';
import { parseDate } from '../utils/date-parser';

function isValidItem(item: any): boolean {
  return (
    item &&
    (item.title || item['title']?.['__cdata']) &&
    (item.description || item['description']?.['__cdata']) &&
    (item.link || item['link']?.['__cdata'])
  );
}

function transformRSSItem(item: any): NewsItem {
  const title = extractContent(item.title);
  const description = extractContent(item.description);
  const category = extractContent(item.category) || 'Uncategorized';
  const link = extractContent(item.link);
  const pubDate = parseDate(extractContent(item.pubDate));

  return {
    title: sanitizeHtml(decodeContent(title)),
    description: sanitizeHtml(decodeContent(cleanDescription(description))),
    link,
    pubDate: pubDate.toISOString(),
    sentiment: '',
    impact: 'low',
    category: sanitizeHtml(decodeContent(category))
  };
}

export async function parseRSSContent(xmlData: string): Promise<NewsItem[]> {
  validateXMLData(xmlData);

  try {
    const cleanXml = cleanXMLData(xmlData);
    const parser = createXMLParser();
    const result = parser.parse(cleanXml);

    if (!result?.rss?.channel?.item) {
      throw {
        code: 'INVALID_RSS_FORMAT',
        message: 'Invalid RSS feed structure',
      } as ApiError;
    }

    const items = Array.isArray(result.rss.channel.item)
      ? result.rss.channel.item
      : [result.rss.channel.item];

    return items
      .filter(item => isValidItem(item))
      .map(item => transformRSSItem(item))
      .slice(0, 30);
  } catch (error) {
    if (error instanceof Error) {
      throw {
        code: 'RSS_PARSE_ERROR',
        message: 'Failed to parse RSS content',
        details: error.message,
      } as ApiError;
    }
    throw error;
  }
}