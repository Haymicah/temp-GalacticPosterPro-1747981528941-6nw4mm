export function extractKeywords(text: string): string[] {
  // Remove URLs
  text = text.replace(/https?:\/\/[^\s]+/g, '');
  
  // Split into words
  const words = text.split(/\s+/);
  
  // Common words to exclude
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for',
    'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on',
    'that', 'the', 'to', 'was', 'were', 'will', 'with', 'the',
    'this', 'but', 'they', 'have', 'had', 'what', 'when', 'where',
    'who', 'which', 'why', 'how'
  ]);

  // Filter words
  const keywords = words.filter(word => {
    const cleaned = word.toLowerCase().replace(/[^\w\s]/g, '');
    return (
      cleaned.length > 2 && // Longer than 2 characters
      !stopWords.has(cleaned) && // Not a stop word
      !/^\d+$/.test(cleaned) // Not just numbers
    );
  });

  // Get word frequency
  const frequency: Record<string, number> = {};
  keywords.forEach(word => {
    const cleaned = word.toLowerCase().replace(/[^\w\s]/g, '');
    frequency[cleaned] = (frequency[cleaned] || 0) + 1;
  });

  // Sort by frequency and get unique words
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .map(([word]) => word);
}