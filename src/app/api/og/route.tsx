// src/app/api/og/route.tsx
// This file should ONLY contain API route handlers - no page components!
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters from URL
    const score = searchParams.get('score') ?? '0';
    const correct = searchParams.get('correct') ?? '0';
    const total = searchParams.get('total') ?? '0';
    const category = searchParams.get('category') ?? 'Trivia';
    const time = searchParams.get('time') ?? '0';

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
            backgroundColor: '#1f2937',
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 40,
              margin: 40,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 'bold',
                color: '#2563eb',
                marginBottom: 20,
              }}
            >
              {score} Points!
            </div>
            <div
              style={{
                fontSize: 24,
                color: '#374151',
                marginBottom: 10,
                textAlign: 'center',
              }}
            >
              {category} Trivia
            </div>
            <div
              style={{
                fontSize: 20,
                color: '#6b7280',
                textAlign: 'center',
              }}
            >
              {correct}/{total} correct in {time}s
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    console.log(errorMessage);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}