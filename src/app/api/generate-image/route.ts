// app/api/generate-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Use types from the 'canvas' package
import type { createCanvas as createCanvasType } from 'canvas';

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
    // Return a Facebook-optimized SVG fallback (1200x630 for Facebook)
    const svg = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width="1200" height="630" fill="url(#bg)"/>
        
        <!-- Logo placeholder - larger and more prominent -->
        <circle cx="600" cy="120" r="70" fill="rgba(255,255,255,0.1)" stroke="#fbbf24" stroke-width="4"/>
        <text x="600" y="135" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#fbbf24" text-anchor="middle">LOGO</text>
        
        <!-- Main content -->
        <text x="600" y="250" font-family="Arial, sans-serif" font-size="52" font-weight="bold" fill="white" text-anchor="middle" filter="url(#glow)">Quiz Results</text>
        
        <!-- Score circle with better contrast -->
        <circle cx="600" cy="360" r="85" fill="#ffffff" stroke="#fbbf24" stroke-width="8"/>
        <circle cx="600" cy="360" r="75" fill="none" stroke="rgba(251,191,36,0.3)" stroke-width="2"/>
        <text x="600" y="385" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#1f2937" text-anchor="middle">${score}</text>
        
        <!-- Category with better styling -->
        <text x="600" y="480" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#fbbf24" text-anchor="middle">${formatCategory(category)}</text>
        
        <!-- Details with better contrast -->
        <text x="350" y="540" font-family="Arial, sans-serif" font-size="32" font-weight="600" fill="white" text-anchor="middle">${correct}/${total} Correct</text>
        <text x="850" y="540" font-family="Arial, sans-serif" font-size="32" font-weight="600" fill="white" text-anchor="middle">Time: ${formatTime(Number(time))}</text>
        
        <!-- Call-to-action footer -->
        <text x="600" y="590" font-family="Arial, sans-serif" font-size="28" font-weight="600" fill="#e5e7eb" text-anchor="middle">🎯 Can you beat this score? Play at triviaah.com</text>
      </svg>
    `;
    return Buffer.from(svg);
  }

  // Facebook recommended size: 1200x630
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Draw enhanced background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#4f46e5'); // Indigo
  gradient.addColorStop(0.5, '#6366f1'); // Indigo-500
  gradient.addColorStop(1, '#7c3aed'); // Purple-600
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add subtle overlay pattern for depth
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < width; i += 100) {
    for (let j = 0; j < height; j += 100) {
      ctx.fillRect(i, j, 50, 2);
      ctx.fillRect(i, j, 2, 50);
    }
  }
  ctx.globalAlpha = 1;
  
  let textStartY = 100; // Default text start Y position

  try {
    // Load and draw logo - made larger and more prominent
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    if (fs.existsSync(logoPath)) {
      const canvasLib = await import('canvas');
      const logoData = fs.readFileSync(logoPath);
      const logo = await canvasLib.loadImage(logoData);
      
      // Larger logo size for better visibility
      const logoWidth = 200;
      const logoHeight = (logo.height * logoWidth) / logo.width;
      const padding = 30;
      
      // Center the logo horizontally at the top
      const logoX = (width - logoWidth) / 2;
      const logoY = padding;
      
      // Add a subtle glow behind the logo
      ctx.shadowColor = 'rgba(251, 191, 36, 0.5)';
      ctx.shadowBlur = 20;
      ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
      ctx.shadowBlur = 0;
      
      // Adjust text positions to account for logo
      textStartY = logoY + logoHeight + padding;
    }
  } catch (e) {
    console.error('Could not load logo:', e);
  }

  // Add text with improved contrast and styling
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';

  // Enhanced font settings
  const titleFont = 'bold 58px "DejaVu Sans", "Liberation Sans", Arial, sans-serif';
  const scoreFont = 'bold 72px "DejaVu Sans", "Liberation Sans", Arial, sans-serif';
  const detailFont = 'bold 38px "DejaVu Sans", "Liberation Sans", Arial, sans-serif';
  const categoryFont = 'bold 44px "DejaVu Sans", "Liberation Sans", Arial, sans-serif';
  const footerFont = '32px "DejaVu Sans", "Liberation Sans", Arial, sans-serif';

  // Title with glow effect
  ctx.font = titleFont;
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  ctx.shadowBlur = 10;
  ctx.fillText('Quiz Results', width / 2, textStartY + 60);
  ctx.shadowBlur = 0;

  // Enhanced score circle with multiple layers
  const scoreY = textStartY + 170;
  
  // Outer glow
  ctx.shadowColor = 'rgba(251, 191, 36, 0.6)';
  ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.arc(width / 2, scoreY, 95, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.shadowBlur = 0;
  
  // Main circle
  ctx.beginPath();
  ctx.arc(width / 2, scoreY, 90, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#fbbf24'; // Amber-400
  ctx.lineWidth = 10;
  ctx.stroke();
  
  // Inner accent circle
  ctx.beginPath();
  ctx.arc(width / 2, scoreY, 80, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Score text with high contrast
  ctx.fillStyle = '#1f2937'; // Gray-800 for excellent contrast on white
  ctx.font = scoreFont;
  ctx.fillText(score, width / 2, scoreY + 18);

  // Category with accent color
  ctx.fillStyle = '#fbbf24'; // Amber-400
  ctx.font = categoryFont;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 5;
  ctx.fillText(formatCategory(category), width / 2, textStartY + 290);
  ctx.shadowBlur = 0;

  // Details in two columns with better styling
  ctx.font = detailFont;
  ctx.fillStyle = '#ffffff';
  const leftX = width / 2 - 220;
  const rightX = width / 2 + 220;
  const detailY = textStartY + 360;
  
  // Add subtle background for better readability
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = '#000000';
  ctx.fillRect(leftX - 120, detailY - 35, 240, 50);
  ctx.fillRect(rightX - 120, detailY - 35, 240, 50);
  ctx.globalAlpha = 1;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${correct}/${total} Correct`, leftX, detailY);
  ctx.fillText(`Time: ${formatTime(Number(time))}`, rightX, detailY);
  
  // Enhanced call-to-action footer
  ctx.font = footerFont;
  ctx.fillStyle = '#e5e7eb';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 3;
  ctx.fillText('🎯 Can you beat this score? Play at triviaah.com', width / 2, textStartY + 450);
  ctx.shadowBlur = 0;

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

// Handle GET requests for social media sharing (Facebook optimized)
export async function GET(request: NextRequest) {
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

    const buffer = await generateImage(score, correct, total, category, time);
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': canvasAvailable ? 'image/png' : 'image/svg+xml',
        'Content-Disposition': 'inline; filename="quiz-result.png"',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
        'CDN-Cache-Control': 'max-age=86400',
        // Facebook-specific headers
        'X-Content-Type-Options': 'nosniff',
        'Access-Control-Allow-Origin': '*',
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

// Handle POST requests for direct image generation (legacy support)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { score, correct, total, category, time, text } = body;

    // For POST requests, return the URL to the GET endpoint for consistency
    const baseUrl = request.nextUrl.origin;
    const imageUrl = `${baseUrl}/api/generate-image?score=${score}&correct=${correct}&total=${total}&category=${encodeURIComponent(category)}&time=${time}`;
    
    return NextResponse.json({ 
      imageUrl,
      shareUrl: `${baseUrl}/share/${category}/${score}/${correct}/${total}/${time}`
    });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json(
      { error: 'Image generation failed' },
      { status: 500 }
    );
  }
}