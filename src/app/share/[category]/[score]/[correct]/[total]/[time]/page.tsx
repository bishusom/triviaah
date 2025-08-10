// app/share/[category]/[score]/[correct]/[total]/[time]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

type PageProps = {
  params: {
    category: string;
    score: string;
    correct: string;
    total: string;
    time: string;
  };
};

// Small helpers
const formatCategory = (cat: string) =>
  cat
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');

const formatTime = (seconds: string) => {
  const secs = parseInt(seconds, 10);
  const mins = Math.floor(secs / 60);
  const remainingSecs = secs % 60;
  return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
};

// ✅ SSR metadata — fully static HTML tags
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, score, correct, total, time } = params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://triviaah.com';
  const formattedCategory = formatCategory(category);

  const title = `${formattedCategory} Trivia Results - Score: ${score}`;
  const description = `I scored ${score} points in ${formattedCategory} trivia! Got ${correct}/${total} correct in ${formatTime(time)}. Can you beat me?`;

  // MUST be an absolute URL & load instantly
  const imageUrl = `${baseUrl}/api/generate-share-image?score=${score}&correct=${correct}&total=${total}&category=${encodeURIComponent(
    formattedCategory
  )}&time=${time}`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      url: `${baseUrl}/share/${category}/${score}/${correct}/${total}/${time}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${formattedCategory} Trivia Results`,
        },
      ],
      siteName: 'Triviaah',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    other: {
      'fb:app_id': process.env.FACEBOOK_APP_ID || '',
      'og:image:width': '1200',
      'og:image:height': '630',
    },
  };
}

export default function SharePage({ params }: PageProps) {
  const { category, score, correct, total } = params;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Trivia Results</h1>
        <div className="space-y-2 mb-6">
          <p>Score: {score}</p>
          <p>
            Correct: {correct}/{total}
          </p>
          <p>Category: {category.replace(/-/g, ' ')}</p>
        </div>
        <div className="space-y-3">
          <Link
            href="/"
            className="block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Take the Quiz
          </Link>
          <Link
            href="/"
            className="block bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}