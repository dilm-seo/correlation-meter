import { XMLParser } from 'fast-xml-parser';
import { ApiError } from '../types/errors';

export function createXMLParser(): XMLParser {
  return new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    parseAttributeValue: true,
    trimValues: true,
    parseTagValue: false,
    cdataTagName: '__cdata',
    processEntities: false,
  });
}

export function cleanXMLData(xmlData: string): string {
  return xmlData
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '')
    .replace(/&(?!(amp|lt|gt|quot|apos);)/g, '&amp;');
}

export function validateXMLData(xmlData: string): void {
  if (!xmlData.trim()) {
    throw {
      code: 'EMPTY_RSS',
      message: 'RSS feed content is empty',
    } as ApiError;
  }
}