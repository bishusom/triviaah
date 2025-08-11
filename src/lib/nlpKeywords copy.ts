import nlp from 'compromise';

export function extractKeywords(question: string): string[] {
  // Process the question with NLP
  const doc = nlp(question);

  // Extract nouns and noun phrases (most likely to be good image search terms)
  const nouns = doc.nouns().out('array');
  
  // Extract adjectives (can help with more specific images)
  const adjectives = doc.adjectives().out('array');
  
  // Combine and deduplicate
  const terms = [...nouns, ...adjectives]
    .filter(term => term.length > 3) // Ignore short terms
    .filter((term, index, self) => self.indexOf(term) === index); // Remove duplicates

  console.log('Extracted keywords:', terms);  
  return terms.slice(0, 3); // Return top 3 terms
}