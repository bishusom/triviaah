import Link from 'next/link';
import { ArrowLeft, FileText, Scale, GamepadIcon, Users, Shield } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Navigation */}
        <nav className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </nav>

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

              {/* User Accounts */}
              <section className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="text-blue-400" size={24} />
                  <h2 className="text-2xl font-bold text-white">2. User Accounts</h2>
                </div>
                <p className="text-gray-300 mb-4">When creating an account with Triviaah, you agree to:</p>
                <ul className="list-none space-y-3">
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Provide accurate and complete information
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Maintain the security of your password
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Accept responsibility for all activities under your account
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Not share accounts or use others&apos; accounts without permission
                  </li>
                </ul>
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
                    Create multiple accounts to manipulate leaderboards
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
                  We reserve the right to terminate or suspend your account and access to our services 
                  at our sole discretion, without notice, for conduct that we believe violates these 
                  Terms of Service or is harmful to other users, us, or third parties.
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
                  We reserve the right to modify these terms at any time. We will notify users of 
                  significant changes through our platform or via email. Continued use of our 
                  services after changes constitutes acceptance of the new terms.
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