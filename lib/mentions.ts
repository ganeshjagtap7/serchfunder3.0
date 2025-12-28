/**
 * Extract @username mentions from text
 * Returns unique, lowercase usernames (excluding duplicates)
 */
export function extractMentions(text: string): string[] {
  if (!text) return [];

  // Regex: @([a-z0-9_]{3,20})
  const mentionRegex = /@([a-z0-9_]{3,20})/gi;
  const matches = text.matchAll(mentionRegex);

  const usernames = new Set<string>();

  for (const match of matches) {
    const username = match[1].toLowerCase();
    usernames.add(username);
  }

  return Array.from(usernames);
}
