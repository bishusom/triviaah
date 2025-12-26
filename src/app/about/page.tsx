import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <MdArrowBack className="mr-1" /> Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">About Elite Trivias</h1>

      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p>
            Elite Trivias was created to bring fun, engaging daily trivia challenges to knowledge 
            enthusiasts worldwide. We believe learning should be enjoyable and accessible to everyone.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>New quizzes available every 24 hours</li>
            <li>Multiple categories to test your knowledge</li>
            <li>Compete with friends on leaderboards</li>
            <li>Track your progress and improve over time</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">The Team</h2>
          <p>
            Elite Trivias is developed by a small team of trivia enthusiasts and developers who are 
            passionate about creating engaging educational experiences.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
          <p>
            Connect with other players, suggest new categories, and stay updated on new features 
            through our social media channels.
          </p>
        </section>
      </div>
    </div>
  );
}