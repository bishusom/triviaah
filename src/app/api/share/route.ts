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
  
  const imageUrl = `${baseUrl}/api/generate-image?score=${score}&correct=${correct}&total=${total}&category=${encodeURIComponent(formattedCategory)}&time=${time}`;
  
  // Check if this is a preview request
  const isPreview = searchParams.get('preview') === 'true';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>My Quiz Score - ${formattedCategory}</title>
        <meta property="og:title" content="I scored ${score} points in ${formattedCategory} trivia!" />
        <meta property="og:description" content="Got ${correct}/${total} correct in ${formatTime(time)}" />
        <meta property="og:image" content="${imageUrl}" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="450" />
        <meta property="og:url" content="${request.url}" />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="I scored ${score} points in ${formattedCategory} trivia!" />
        <meta name="twitter:description" content="Got ${correct}/${total} correct in ${formatTime(time)}" />
        <meta name="twitter:image" content="${imageUrl}" />
        <meta name="twitter:url" content="${request.url}" />
      </head>
      <body>
        ${isPreview ? '' : `
        <script>
          // Redirect to home page after a brief delay to allow social crawlers to read meta tags
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        </script>
        `}
        <div style="text-align: center; margin-top: 50px; font-family: Arial, sans-serif; max-width: 600px; margin-left: auto; margin-right: auto;">
          <h1 style="color: #3b82f6;">🎉 Quiz Results</h1>
          <div style="background: #f3f4f6; padding: 30px; border-radius: 12px; margin: 20px;">
            <h2 style="color: #1e40af; font-size: 48px; margin: 10px 0;">${score} points</h2>
            <p style="font-size: 18px; margin: 10px 0;"><strong>${correct}/${total} correct</strong> in ${formattedCategory}</p>
            <p style="font-size: 16px; margin: 10px 0;">Time: ${formatTime(time)}</p>
          </div>
          
          <div style="margin: 30px 0;">
            <h3>Share Image Preview:</h3>
            <img src="${imageUrl}" alt="Share preview" style="max-width: 100%; border: 2px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" />
          </div>
          
          <div style="margin: 30px 0;">
            <a href="${imageUrl}" target="_blank" style="background: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-right: 10px;">View Image</a>
            <a href="/?preview=true" style="background: #6b7280; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Back to Home</a>
          </div>
          
          ${!isPreview ? '<p style="color: #6b7280;">Redirecting to home page in 2 seconds...</p>' : ''}
        </div>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html'
    }
  });
}