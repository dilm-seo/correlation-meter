import he from 'he';
import { sanitizeHtml } from './sanitizer';

export function extractContent(field: any): string {
  if (!field) return '';
  
  if (typeof field === 'object') {
    if (field['__cdata']) {
      return field['__cdata'];
    }
    if (field['#text']) {
      return field['#text'];
    }
  }
  
  return String(field);
}

export function decodeContent(content: string): string {
  return he.decode(content)
    .replace(/\u0000/g, '')
    .replace(/\uFFFD/g, '')
    .trim();
}

export function cleanDescription(description: string): string {
  return description
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}