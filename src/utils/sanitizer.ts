export function sanitizeHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, '') // Remove HTML entities
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
    .trim();
}