// app/share/[category]/[score]/[correct]/[total]/[time]/page.tsx
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    category: string;
    score: string;
    correct: string;
    total: string;
    time: string;
  };
};

// Generate dynamic metadata for Open Graph tags
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, score, correct, total, time } = params;
  
  const formatCategory = (cat: string) => {
    return cat
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-');
  };

  const formatTime = (seconds: string) => {
    const secs = parseInt(seconds);
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const formattedCategory = formatCategory(category);
  const title = `${formattedCategory} Trivia Results - Score: ${score}`;
  const description = `I scored ${score} points in ${formattedCategory} trivia! Got ${correct}/${total} correct in ${formatTime(time)}. Can you beat me?`;
  
  // Generate or get the share image URL
  const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://triviaah.com'}/api/generate-share-image?score=${score}&correct=${correct}&total=${total}&category=${formattedCategory}&time=${time}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${formattedCategory} Trivia Results`,
        },
      ],
      type: 'website',
      siteName: 'Triviaah',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    // Additional meta tags for Facebook
    other: {
      'fb:app_id': process.env.FACEBOOK_APP_ID || '', // Add your Facebook App ID if you have one
      'og:image:width': '1200',
      'og:image:height': '630',
    },
  };
}

export default function SharePage({ params }: Props) {
  // This page redirects users to the main quiz page
  // The main purpose is to provide Open Graph meta tags for social sharing
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Trivia Results</h1>
        <div className="space-y-2 mb-6">
          <p>Score: {params.score}</p>
          <p>Correct: {params.correct}/{params.total}</p>
          <p>Category: {params.category.replace(/-/g, ' ')}</p>
        </div>
        <div className="space-y-3">
          <a
            href="/"
            className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Take the Quiz
          </a>
          <a
            href="/"
            className="block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}