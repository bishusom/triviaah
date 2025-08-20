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

  // Decode the category first, then format it
  const decodedCategory = decodeURIComponent(category);
  const formattedCategory = formatCategory(decodedCategory);
  
  // Determine the base URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  (request.url.includes('localhost') ? 'http://localhost:3000' : 'https://triviaah.com');

  // Generate image URL with timestamp to prevent caching issues
  const imageUrl = `${baseUrl}/api/generate-image?score=${score}&correct=${correct}&total=${total}&category=${encodeURIComponent(formattedCategory)}&time=${time}&t=${Date.now()}`;
  
  const shareUrl = request.url;
  const formattedTime = formatTime(time);

  // Generate the HTML response with proper meta tags
  const html = `
  <!DOCTYPE html>
  <html prefix="og: https://ogp.me/ns#">
  <head>
    <meta charset="utf-8">
    <title>Triviaah Score</title>
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
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${shareUrl}">
    <meta name="twitter:title" content="I scored ${score} points in ${formattedCategory} trivia!">
    <meta name="twitter:description" content="I got ${correct} out of ${total} correct in ${formattedTime} - can you beat my score?">
    <meta name="twitter:image" content="${imageUrl}">
    
    <!-- WhatsApp Specific -->
    <meta property="og:image:secure_url" content="${imageUrl}">
    
    <!-- Redirect to prevent service worker issues -->
    <script>
      // Clean up any service worker interference
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          registrations.forEach(function(registration) {
            registration.unregister();
          });
        });
      }
      
      // Optional: Add a small delay before showing content
      setTimeout(() => {
        document.body.style.display = 'block';
      }, 100);
    </script>
    <style>
      body { display: none; }
    </style>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h1 style="color: #3498db; text-align: center;">Triviaah Results</h1>
      
      <div style="text-align: center; margin: 30px 0;">
        <img src="${imageUrl}" alt="Triviaah Score" style="max-width: 100%; border-radius: 8px; border: 2px solid #e0e0e0;">
      </div>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="font-size: 18px;"><strong>Score:</strong> ${score}</p>
        <p style="font-size: 18px;"><strong>Correct Answers:</strong> ${correct}/${total}</p>
        <p style="font-size: 18px;"><strong>Category:</strong> ${formattedCategory}</p>
        <p style="font-size: 18px;"><strong>Time:</strong> ${formattedTime}</p>
      </div>
      
      <div style="text-align: center;">
        <a href="${baseUrl}" style="display: inline-block; background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;">
          Play Now at triviaah.com
        </a>
        <a href="${baseUrl}/?category=${encodeURIComponent(category)}" style="display: inline-block; background: #27ae60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;">
          Play Same Category
        </a>
      </div>
      
      <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">
        <p>Share this URL to challenge your friends!</p>
      </div>
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