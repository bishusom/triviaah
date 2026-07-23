import { NextRequest, NextResponse } from 'next/server';

const WORD_PATTERN = /^[a-z-]{1,64}$/i;

export async function GET(request: NextRequest) {
  const word = request.nextUrl.searchParams.get('word')?.trim().toLowerCase();

  if (!word || !WORD_PATTERN.test(word)) {
    return NextResponse.json({ error: 'A valid word is required' }, { status: 400 });
  }

  const apiKey =
    process.env.MW_DICTIONARY_KEY ?? process.env.NEXT_PUBLIC_MW_DICTIONARY_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Dictionary service is not configured' },
      { status: 503 },
    );
  }

  try {
    const url =
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/` +
      `${encodeURIComponent(word)}?key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url, { next: { revalidate: 86_400 } });

    if (!response.ok) {
      console.error(`Dictionary API returned ${response.status} for "${word}"`);
      return NextResponse.json(
        { error: 'Dictionary lookup failed' },
        { status: 502 },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error(`Dictionary lookup failed for "${word}":`, error);
    return NextResponse.json(
      { error: 'Dictionary lookup failed' },
      { status: 502 },
    );
  }
}
