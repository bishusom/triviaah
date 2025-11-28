export async function fetchPixabayImage(
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

  // Create search query - for general knowledge, use keyword only
  const searchQuery = isGeneralKnowledge
    ? cleanKeyword
    : cleanCategory
      ? `${cleanCategory} ${cleanKeyword || ''}`.trim()
      : cleanKeyword;

  try {
    const response = await fetch(
      `/api/pixabay?search=${encodeURIComponent(searchQuery)}`,
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
      console.warn('Pixabay API error:', data.error);
      return null;
    }

    return data.imageUrl || null;
  } catch (error) {
    console.error('Error fetching Pixabay image:', error);
    return null;
  }
}