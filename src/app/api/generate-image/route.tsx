// app/api/generate-image/route.tsx
import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const score = searchParams.get('score');
    const correct = searchParams.get('correct');
    const total = searchParams.get('total');
    const category = searchParams.get('category');
    const time = searchParams.get('time');

    if (!score || !correct || !total || !category || !time) {
      return new Response('Missing required parameters', { status: 400 });
    }

    // Helper functions
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatCategory = (cat: string) => {
      return cat
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            fontFamily: 'system-ui, sans-serif',
            padding: 40,
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              opacity: 0.3,
            }}
          />

          {/* Logo Area */}
          <div style={{ 
            display: 'flex', 
            position: 'absolute', 
            top: 40, 
            left: 40,
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              display: 'flex',
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              border: '2px solid #fbbf24',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              color: '#fbbf24',
            }}>
              T
            </div>
            <div style={{
              display: 'flex',
              fontSize: 24,
              fontWeight: 'bold',
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}>
              Triviaah
            </div>
          </div>

          {/* Main Content Container */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: 800,
          }}>
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              fontSize: 48, 
              fontWeight: 'bold', 
              color: 'white',
              marginBottom: 30,
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              textAlign: 'center',
            }}>
              Quiz Results
            </div>
            
            {/* Score Circle */}
            <div style={{ 
              display: 'flex',
              position: 'relative',
              marginBottom: 30,
            }}>
              {/* Outer glow */}
              <div
                style={{
                  display: 'flex',
                  position: 'absolute',
                  top: -10,
                  left: -10,
                  right: -10,
                  bottom: -10,
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '50%',
                  filter: 'blur(20px)',
                }}
              />
              
              {/* Main circle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  background: 'white',
                  border: '8px solid #fbbf24',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Score */}
                <div style={{ 
                  display: 'flex',
                  fontSize: 56, 
                  fontWeight: 'bold', 
                  color: '#1f2937',
                }}>
                  {score}
                </div>
              </div>
            </div>
            
            {/* Category */}
            <div style={{ 
              display: 'flex', 
              fontSize: 32, 
              fontWeight: 'bold', 
              color: '#fbbf24',
              marginBottom: 30,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              textAlign: 'center',
            }}>
              {formatCategory(category)} Trivia Quiz
            </div>
            
            {/* Stats Container */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: 50, 
              marginBottom: 40,
            }}>
              {/* Correct Answers */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px 24px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 12,
                border: '2px solid rgba(255,255,255,0.2)',
              }}>
                <div style={{ 
                  display: 'flex',
                  fontSize: 24, 
                  fontWeight: 'bold', 
                  color: 'white',
                }}>
                  {correct}/{total}
                </div>
                <div style={{ 
                  display: 'flex',
                  fontSize: 18, 
                  color: '#e5e7eb', 
                  marginTop: 6,
                }}>
                  Correct
                </div>
              </div>
              
              {/* Time */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                padding: '16px 24px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 12,
                border: '2px solid rgba(255,255,255,0.2)',
              }}>
                <div style={{ 
                  display: 'flex',
                  fontSize: 24, 
                  fontWeight: 'bold', 
                  color: 'white',
                }}>
                  {formatTime(Number(time))}
                </div>
                <div style={{ 
                  display: 'flex',
                  fontSize: 18, 
                  color: '#e5e7eb', 
                  marginTop: 6,
                }}>
                  Time
                </div>
              </div>
            </div>
            
            {/* Footer CTA - Centered */}
            <div style={{ 
              display: 'flex', 
              fontSize: 20, 
              color: '#e5e7eb',
              background: 'rgba(0,0,0,0.3)',
              padding: '14px 28px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)',
              alignItems: 'center',
              gap: 10,
              justifyContent: 'center',
              textAlign: 'center',
            }}>
              <span>🎯</span>
              Can you beat this score? Play at triviaah.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response('Image generation failed', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { score, correct, total, category, time } = body;

    if (!score || !correct || !total || !category || !time) {
      return Response.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const baseUrl = request.nextUrl.origin;
    const imageUrl = `${baseUrl}/api/generate-image?score=${score}&correct=${correct}&total=${total}&category=${encodeURIComponent(category)}&time=${time}`;
    
    return Response.json({ 
      imageUrl,
      shareUrl: `${baseUrl}/share/${category}/${score}/${correct}/${total}/${time}`
    });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return Response.json(
      { error: 'Image generation failed' },
      { status: 500 }
    );
  }
}