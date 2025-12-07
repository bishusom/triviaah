import { getAllTriviaPreviews } from '@/lib/tbank';
import TriviaFilter from '@/components/trivia-bank/TriviaFilter';

interface TriviaCategory {
  slug: string;
  title: string;
  header: string;
  excerpt: string;
  tags: string[];
}

export default async function TriviaBankPage() {
  const triviaCategories: TriviaCategory[] = await getAllTriviaPreviews();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Trivia Question Bank
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Browse our collection of trivia categories to find questions for your next quiz game
        </p>
      </div>
      
      {/* Client-side filter component */}
      <TriviaFilter categories={triviaCategories} />

      {/* SEO Content Section */}
      <section className="mt-12 bg-gray-50 rounded-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Create Your Own Online Quiz Games For Free
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Our free trivia question bank allows you to create your own online quiz for free with ease. 
            As one of the best online quiz tools free available, we provide everything you need to 
            create online trivia game free of charge. Whether you need free virtual trivia for teams, 
            trivia games for adults online, or fun quiz games for friends, our question bank has you covered.
          </p>
          <p>
            Looking for free quiz hosting website capabilities? Our platform enables you to create quiz game online free 
            and share it with others. Enjoy free online quiz for team building events or simply test your knowledge 
            with our extensive collection of questions. As a completely free quiz website, we&apos;re committed to 
            providing the best online trivia games experience without any cost.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li>Create your own trivia game free with our question bank</li>
            <li>Perfect for free virtual trivia games for work and team building</li>
            <li>Enjoy online trivia game with friends and family</li>
            <li>One of the best free quiz sites for trivia enthusiasts</li>
            <li>No cost involved - completely free quiz website</li>
          </ul>
        </div>
      </section>
    </div>
  );
}