import { extractKeywords } from './keywords';

export function generateHashtags(content: string, maxHashtags: number = 20): string[] {
  // Extract keywords from content
  const keywords = extractKeywords(content);
  
  // Convert keywords to hashtags
  const hashtags = keywords.map(keyword => {
    // Remove special characters and spaces
    const tag = keyword.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '');
    return `#${tag}`;
  });

  // Filter out duplicates and empty hashtags
  const uniqueHashtags = [...new Set(hashtags)]
    .filter(tag => tag.length > 1);

  // Return limited number of hashtags
  return uniqueHashtags.slice(0, maxHashtags);
}