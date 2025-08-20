import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const score = searchParams.get('score');
  const correct = searchParams.get('correct');
  const total = searchParams.get('total');
  const category = searchParams.get('category');
  const time = searchParams.get('time');
  const fbclid = searchParams.get('fbclid');
  const isFacebookCrawler = request.headers.get('user-agent')?.includes('facebookexternalhit') || 
                           request.headers.get('user-agent')?.includes('Facebot');

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

  // Decode the category first, then format it
  const decodedCategory = decodeURIComponent(category);
  const formattedCategory = formatCategory(decodedCategory);
  
  // Determine the base URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  (request.url.includes('localhost') ? 'http://localhost:3000' : 'https://triviaah.com');

  // Generate clean URL without fbclid for sharing
  const cleanUrl = new URL(request.url);
  cleanUrl.searchParams.delete('fbclid');
  cleanUrl.searchParams.delete('h');
  cleanUrl.searchParams.delete('__tn__');
  cleanUrl.searchParams.delete('c[0]');
  const shareUrl = cleanUrl.toString();

  // Generate image URL with timestamp to prevent caching issues
  const imageUrl = `${baseUrl}/api/generate-image?score=${score}&correct=${correct}&total=${total}&category=${encodeURIComponent(formattedCategory)}&time=${time}&t=${Date.now()}`;
  
  const formattedTime = formatTime(time);

  // If this is Facebook crawler, return just the meta tags without redirect
  if (isFacebookCrawler) {
    const crawlerHtml = `
    <!DOCTYPE html>
    <html prefix="og: https://ogp.me/ns#">
    <head>
      <meta charset="utf-8">
      <title>I scored ${score} points in ${formattedCategory} trivia!</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      
      <!-- Primary Meta Tags -->
      <meta name="title" content="I scored ${score} points in ${formattedCategory} trivia!">
      <meta name="description" content="I got ${correct} out of ${total} correct in ${formattedTime} - can you beat my score?">
      
      <!-- Open Graph / Facebook -->
      <meta property="og:type" content="website">
      <meta property="og:url" content="${shareUrl}">
      <meta property="og:title" content="I scored ${score} points in ${formattedCategory} trivia!">
      <meta property="og:description" content="I got ${correct} out of ${total} correct in ${formattedTime} - can you beat my score?">
      <meta property="og:image" content="${imageUrl}">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">
      <meta property="og:image:alt" content="Fun Triviaah Challenge">
      <meta property="og:site_name" content="Triviaah">
      
      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:url" content="${shareUrl}">
      <meta name="twitter:title" content="I scored ${score} points in ${formattedCategory} trivia!">
      <meta name="twitter:description" content="I got ${correct} out of ${total} correct in ${formattedTime} - can you beat my score?">
      <meta name="twitter:image" content="${imageUrl}">
      
      <!-- WhatsApp Specific -->
      <meta property="og:image:secure_url" content="${imageUrl}">
    </head>
    <body>
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Triviaah Score Share",
        "description": "I scored ${score} points in ${formattedCategory} trivia!",
        "url": "${shareUrl}"
      }
      </script>
    </body>
    </html>
    `;

    return new NextResponse(crawlerHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate'
      }
    });
  }

  // For regular users, redirect to the main app with the score parameters
  const redirectUrl = new URL(`${baseUrl}/`);
  redirectUrl.searchParams.set('score', score);
  redirectUrl.searchParams.set('correct', correct);
  redirectUrl.searchParams.set('total', total);
  redirectUrl.searchParams.set('category', category);
  redirectUrl.searchParams.set('time', time);

  const userHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Redirecting to Triviaah...</title>
    <meta http-equiv="refresh" content="0;url=${redirectUrl.toString()}" />
    <script>
      window.location.href = "${redirectUrl.toString()}";
    </script>
  </head>
  <body>
    <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
      <h1>Redirecting to your results...</h1>
      <p>If you're not redirected automatically, <a href="${redirectUrl.toString()}">click here</a>.</p>
    </div>
  </body>
  </html>
  `;

  return new NextResponse(userHtml, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate'
    }
  });
}