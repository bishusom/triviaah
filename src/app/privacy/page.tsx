import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <MdArrowBack className="mr-1" /> Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last Updated: April 2025</p>

      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          <p>When you play Triviaah, we may collect:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Gameplay data (scores, categories played, performance metrics)</li>
            <li>Device information (browser type, operating system)</li>
            <li>High score information including player names (if provided)</li>
            <li>Analytics data via Google Analytics</li>
          </ul>
        </section>

        {/* Add other sections from your privacy policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Provide and improve our services</li>
            <li>Maintain leaderboards and high scores</li>
            <li>Analyze usage patterns for product improvement</li>
            <li>Ensure fair play and prevent cheating</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Changes to This Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
        </section>
      </div>
    </div>
  );
}