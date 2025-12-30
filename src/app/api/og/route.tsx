import { ImageResponse } from 'next/og';
import React from 'react';

// Add these for static export compatibility
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Triviaah Quiz';

  return new ImageResponse(
    React.createElement(
      'div',
      {
        style: {
          background: 'linear-gradient(to bottom, #2563eb, #1e40af)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '0 60px'
        }
      },
      [
        React.createElement(
          'h1',
          {
            key: 'title',
            style: { fontSize: 72, textAlign: 'center' }
          },
          title
        ),
        React.createElement(
          'p',
          {
            key: 'subtitle',
            style: { fontSize: 28 }
          },
          'Play now on triviaah.com'
        )
      ]
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}