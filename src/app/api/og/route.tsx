// app/api/og/route.ts
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  try {
    const score = searchParams.get('score') || '0';
    const correct = searchParams.get('correct') || '0';
    const total = searchParams.get('total') || '0';
    const category = searchParams.get('category') || 'Trivia';
    const time = searchParams.get('time') || '0';

    const formattedTime = formatTime(parseInt(time));

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1E40AF',
            color: 'white',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '72px', marginBottom: '16px' }}>
            {category} Trivia
          </h1>
          <p style={{ fontSize: '48px', marginBottom: '40px' }}>
            Score: {score} Points
          </p>
          <div style={{ display: 'flex', gap: '32px' }}>
            <div>
              <p style={{ fontSize: '32px' }}>Correct</p>
              <p style={{ fontSize: '40px', fontWeight: 'bold' }}>
                {correct}/{total}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '32px' }}>Time</p>
              <p style={{ fontSize: '40px', fontWeight: 'bold' }}>
                {formattedTime}
              </p>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}