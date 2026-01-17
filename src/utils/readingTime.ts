/**
 * Calculate estimated reading time for a given text
 * Based on average reading speed of 200-250 words per minute
 */
export function getReadingTime(text: string): string {
  const wordsPerMinute = 225;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  if (minutes === 1) {
    return '1 min read';
  }
  return `${minutes} min read`;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date for datetime attribute
 */
export function formatDateISO(date: Date): string {
  return date.toISOString();
}
