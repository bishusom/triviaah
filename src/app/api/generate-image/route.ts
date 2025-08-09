// app/api/generate-image/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Use types from the 'canvas' package
import type { Canvas, createCanvas as createCanvasType } from 'canvas';

let createCanvas: typeof createCanvasType | null = null;
let canvasAvailable = false;
let fontsRegistered = false;

// Initialize canvas and fonts (moved to a separate async function)
async function initializeCanvas() {
  try {
    const canvas = await import('canvas');
    createCanvas = canvas.createCanvas;
    canvasAvailable = true;
    
    try {
      const { registerFont } = canvas;
      const fontPath = path.join(process.cwd(), 'public', 'fonts');
      
      registerFont(path.join(fontPath, 'DejaVuSans-Bold.ttf'), {
        family: 'DejaVu Sans',
        weight: 'bold'
      });
      registerFont(path.join(fontPath, 'DejaVuSans.ttf'), {
        family: 'DejaVu Sans'
      });
      
      fontsRegistered = true;
    } catch (e) {
      console.error('Font registration failed:', e);
    }
  } catch (error) {
    console.log('Canvas library not available:', error instanceof Error ? error.message : String(error));
    canvasAvailable = false;
  }
}

// Initialize immediately (top-level await alternative)
const canvasInitialization = initializeCanvas();

async function generateImage(score: string, correct: string, total: string, category: string, time: string) {
  // Wait for canvas initialization
  await canvasInitialization;
  if (!canvasAvailable || !createCanvas) {
    // Return a simple SVG fallback for local development
    const svg = `
      <svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="450" fill="url(#bg)"/>
        <!-- Add logo in SVG - adjust x and y as needed -->
        <image href="/logo.png" x="300" y="30" width="200" height="auto"/>
        <text x="400" y="280" font-family="DejaVu Sans, Liberation Sans, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">Quiz Results</text>
        <text x="400" y="380" font-family="DejaVu Sans, Liberation Sans, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle">${score} points</text>
        <text x="400" y="430" font-family="DejaVu Sans, Liberation Sans, sans-serif" font-size="28" fill="white" text-anchor="middle">${correct}/${total} correct • ${formatCategory(category)}</text>
        <text x="400" y="470" font-family="DejaVu Sans, Liberation Sans, sans-serif" font-size="24" fill="white" text-anchor="middle">Time: ${formatTime(Number(time))}</text>
        <text x="400" y="520" font-family="DejaVu Sans, Liberation Sans, sans-serif" font-size="20" fill="#e5e7eb" text-anchor="middle">Play more at www.triviaah.com</text>
      </svg>
    `;
    return Buffer.from(svg);
  }

  const width = 800;
  const height = 450;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Draw background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#3b82f6');
  gradient.addColorStop(1, '#1e40af');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  let textStartY = 100; // Default text start Y position
  try {
    // Load and draw logo
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    if (fs.existsSync(logoPath)) {
      const canvasLib = await import('canvas');
      const logoData = fs.readFileSync(logoPath);
      const logo = await canvasLib.loadImage(logoData);
      
      // Make logo larger - adjust width as needed (200px instead of 100px)
      const logoWidth = 200;
      const logoHeight = (logo.height * logoWidth) / logo.width;
      const padding = 30;
      
      // Center the logo horizontally at the top
      const logoX = (width - logoWidth) / 2;
      const logoY = padding;
      
      ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
      
      // Adjust text positions to account for larger logo
      textStartY = logoY + logoHeight + padding;
    }
  } catch (e) {
    console.error('Could not load logo:', e);
  }

  // Add text
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';

  // Font settings - using Linux-friendly fonts with fallbacks
  const titleFont = 'bold 48px "DejaVu Sans", "Liberation Sans", sans-serif';
  const scoreFont = 'bold 72px "DejaVu Sans", "Liberation Sans", sans-serif';
  const detailFont = '28px "DejaVu Sans", "Liberation Sans", sans-serif';
  const timeFont = '24px "DejaVu Sans", "Liberation Sans", sans-serif';
  const footerFont = '20px "DejaVu Sans", "Liberation Sans", sans-serif';

  // Title
  ctx.font = titleFont;
  ctx.fillText('Quiz Results', width / 2, textStartY + 80);  

  // Score
  ctx.font = scoreFont;
  ctx.fillText(`${score} points`, width / 2, textStartY + 180);

  // Details
  ctx.font = detailFont;
  ctx.fillText(`${correct}/${total} correct • ${formatCategory(category)}`, width / 2, textStartY + 230);
  
  // Time
  ctx.font = timeFont;
  ctx.fillText(`Time: ${formatTime(Number(time))}`, width / 2, textStartY + 270);
  
  // Website link
  ctx.font = footerFont;
  ctx.fillStyle = '#e5e7eb';
  ctx.fillText('Play more at www.triviaah.com', width / 2, textStartY + 350);

  return canvas.toBuffer('image/png');
}

// Add the formatTime function
function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatCategory(cat: string) {
  return cat
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Handle GET requests for social media sharing
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const score = searchParams.get('score');
    const correct = searchParams.get('correct');
    const total = searchParams.get('total');
    const category = searchParams.get('category');
    const time = searchParams.get('time');

    if (!score || !correct || !total || !category || !time) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const buffer = generateImage(score, correct, total, category, time);
    
    return new NextResponse(await buffer, {
      headers: {
        'Content-Type': canvasAvailable ? 'image/png' : 'image/svg+xml',
        'Content-Disposition': 'inline; filename="quiz-result.png"',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Image generation failed' },
      { status: 500 }
    );
  }
}

// Handle POST requests for direct image generation
export async function POST(request: Request) {
  try {
    const { score, correct, total, category, time } = await request.json();

    const buffer = generateImage(
      score.toString(), 
      correct.toString(), 
      total.toString(), 
      category, 
      time.toString()
    );
    
    return new NextResponse(await buffer, {
      headers: {
        'Content-Type': canvasAvailable ? 'image/png' : 'image/svg+xml',
        'Content-Disposition': 'inline; filename="quiz-result.png"'
      }
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Image generation failed' },
      { status: 500 }
    );
  }
}