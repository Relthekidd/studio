export function generateKeywords(...terms: string[]): string[] {
  const keywords = new Set<string>();

  terms.forEach((term) => {
    if (!term) return;
    const lowerTerm = term.toLowerCase();

    // Add the full term
    keywords.add(lowerTerm);

    // Add individual words
    lowerTerm.split(' ').forEach((word) => {
      if (word.trim()) {
        keywords.add(word);
      }
    });
  });

  return Array.from(keywords);
}
