import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const score = searchParams.get('score');
  const correct = searchParams.get('correct');
  const total = searchParams.get('total');
  const category = searchParams.get('category');
  const time = searchParams.get('time');

  // Validate required parameters
  if (!score || !correct || !total || !category || !time) {
    return NextResponse.json(
      { error: 'Missing required parameters' }, 
      { status: 400 }
    );
  }

  const formatCategory = (cat: string) => {
    return cat
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatTime = (seconds: string) => {
    const secs = parseInt(seconds);
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const formattedCategory = formatCategory(category);
  // Determine the base URL (for local development vs production)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                (request.url.includes('localhost') ? 'http://localhost:3000' : 'https://triviaah.com');

  const shareUrl = `${baseUrl}/api/share?score=${score}&correct=${correct}&total=${total}&category=${encodeURIComponent(formattedCategory)}&time=${time}`;
  const imageUrl = `${baseUrl}/api/generate-image?score=${score}&correct=${correct}&total=${total}&category=${encodeURIComponent(formattedCategory)}&time=${time}`;
  
  // Generate the HTML response
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>My Quiz Score - ${formattedCategory}</title>
      <meta property="fb:app_id" content="${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}" />
      <meta property="og:title" content="I scored ${score} points in ${formattedCategory} trivia!" />
      <meta property="og:description" content="Got ${correct}/${total} correct in ${formatTime(time)}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:url" content="${shareUrl}" />
      <meta property="og:type" content="website" />
      <meta property="twitter:image" content="${imageUrl}"} />
      <meta property="twitter:card" content="summary_large_image" />
    </head>
    <body>
      <div style="text-align: center; padding: 20px;">
        <h1>Loading your results...</h1>
        <p>If you're not redirected automatically, <a href="${request.url}">click here</a>.</p>
      </div>
    </body>
  </html>
`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate'
    }
  });
}