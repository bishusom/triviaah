// lib/pexels.ts
export async function fetchPexelsImage(
  keyword: string,
  category?: string
): Promise<string | null> {
  // Clean and validate inputs
  const cleanKeyword = keyword.replace(/[^\w\s]/gi, '').trim();
  const cleanCategory = category?.replace(/[^\w\s]/gi, '').trim();
  
  if (!cleanKeyword && !cleanCategory) return null;

  // Special handling for general-knowledge category
  const isGeneralKnowledge = cleanCategory?.toLowerCase() === 'general-knowledge' || 
                           cleanCategory?.toLowerCase() === 'general knowledge';

  // Create search query
  const searchQuery = isGeneralKnowledge
    ? cleanKeyword
    : cleanCategory
      ? `${cleanCategory} ${cleanKeyword || ''}`.trim()
      : cleanKeyword;

  try {
    const response = await fetch(
      `/api/pexels?search=${encodeURIComponent(searchQuery)}`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.warn('Pexels API error:', data.error);
      return null;
    }

    return data.imageUrl || null;
  } catch (error) {
    console.error('Error fetching Pexels image:', error);
    return null;
  }
}