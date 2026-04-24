import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Scale, GamepadIcon, Users, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Triviaah',
  description:
    'Review the Triviaah terms of service covering fair play, user responsibilities, intellectual property, and platform usage.',
  alternates: {
    canonical: 'https://triviaah.com/terms',
  },
  openGraph: {
    title: 'Terms of Service | Triviaah',
    description:
      'Review the Triviaah terms of service covering fair play, user responsibilities, intellectual property, and platform usage.',
    url: 'https://triviaah.com/terms',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/triviaah-og.webp',
        width: 1200,
        height: 630,
        alt: 'Triviaah Terms of Service',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | Triviaah',
    description:
      'Review the Triviaah terms of service covering fair play, user responsibilities, intellectual property, and platform usage.',
    images: ['/imgs/triviaah-og.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <FileText size={18} />
            LEGAL
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          
          <p className="text-gray-400 text-lg">Last Updated: April 2025</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 rounded-2xl border-2 border-gray-700 p-8">
            <div className="prose prose-lg prose-invert max-w-none">
              {/* Introduction */}
              <section className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
                <div className="flex items-center gap-3 mb-4">
                  <GamepadIcon className="text-purple-400" size={24} />
                  <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
                </div>
                <p className="text-gray-300">
                  By accessing and playing Triviaah, you accept and agree to be bound by the terms and 
                  provision of this agreement. If you do not agree to abide by these terms, please do 
                  not use our service.
                </p>
              </section>

              {/* No Account Required */}
              <section className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="text-blue-400" size={24} />
                  <h2 className="text-2xl font-bold text-white">2. No Account Required</h2>
                </div>
                <p className="text-gray-300">
                  Triviaah is free to play and does not require you to create an account or sign up to access the game experience.
                  If we ever offer optional account-based features in the future, any additional terms for those features will apply only
                  to the users who choose to use them.
                </p>
              </section>

              {/* Game Rules */}
              <section className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="text-yellow-400" size={24} />
                  <h2 className="text-2xl font-bold text-white">3. Game Rules & Fair Play</h2>
                </div>
                <p className="text-gray-300 mb-4">To ensure fair play for all users, you agree not to:</p>
                <ul className="list-none space-y-3">
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Use bots, scripts, or automated systems to play
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Exploit bugs or vulnerabilities in the game
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Manipulate scores, rankings, or results through unfair means
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Share answers or collaborate during timed quizzes
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Use offensive language in player names or comments
                  </li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="text-green-400" size={24} />
                  <h2 className="text-2xl font-bold text-white">4. Intellectual Property</h2>
                </div>
                <p className="text-gray-300 mb-4">
                  All content, features, and functionality of Triviaah are owned by us and are 
                  protected by international copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-gray-300">
                  You may not reproduce, distribute, modify, or create derivative works of any content 
                  without our express written permission.
                </p>
              </section>

              {/* User Content */}
              <section className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
                <h2 className="text-2xl font-bold text-white mb-4">5. User-Generated Content</h2>
                <p className="text-gray-300 mb-4">
                  By submitting content (such as comments, suggestions, or user names), you grant us 
                  a worldwide, non-exclusive, royalty-free license to use, reproduce, and display 
                  such content in connection with our services.
                </p>
                <p className="text-gray-300">
                  You are solely responsible for the content you submit and must ensure it does not 
                  violate any laws or third-party rights.
                </p>
              </section>

              {/* Termination */}
              <section className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
                <h2 className="text-2xl font-bold text-white mb-4">6. Termination</h2>
                <p className="text-gray-300">
                  We reserve the right to restrict or suspend access to our services at our sole discretion, without notice, for conduct
                  that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
                <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
                <p className="text-gray-300">
                  Triviaah and its team shall not be liable for any indirect, incidental, special, 
                  consequential, or punitive damages resulting from your use or inability to use 
                  our services.
                </p>
              </section>

              {/* Changes to Terms */}
              <section className="p-6 bg-gray-700/30 rounded-xl border border-gray-600">
                <h2 className="text-2xl font-bold text-white mb-4">8. Changes to Terms</h2>
                <p className="text-gray-300">
                  We reserve the right to modify these terms at any time. We will notify users of significant changes through our
                  platform. Continued use of our services after changes constitutes acceptance of the new terms.
                </p>
              </section>

              {/* Contact Information */}
              <div className="mt-8 text-center p-6 bg-purple-900/20 rounded-xl border border-purple-700">
                <h3 className="text-xl font-bold text-purple-400 mb-3">Questions?</h3>
                <p className="text-gray-300 mb-4">
                  If you have any questions about these Terms of Service, please contact us.
                </p>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-colors font-semibold"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
