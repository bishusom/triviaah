import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Lock, RefreshCw } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Shield size={18} />
            PRIVACY & SECURITY
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <p className="text-gray-400 text-lg">Last Updated: April 2025</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 rounded-2xl border-2 border-gray-700 p-8">
            <div className="prose prose-lg prose-invert max-w-none">
              <section className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="text-purple-400" size={24} />
                  <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
                </div>
                <p className="text-gray-300 mb-4">When you play Triviaah, we may collect:</p>
                <ul className="list-none space-y-3">
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Gameplay data (scores, categories played, performance metrics)
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Device information (browser type, operating system)
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    High score information including player names (if provided)
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Analytics data via Google Analytics
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="text-blue-400" size={24} />
                  <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
                </div>
                <p className="text-gray-300 mb-4">We use the information we collect to:</p>
                <ul className="list-none space-y-3">
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Provide and improve our services
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Maintain leaderboards and high scores
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Analyze usage patterns for product improvement
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Ensure fair play and prevent cheating
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 bg-gray-700/30 rounded-xl border border-gray-600">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="text-green-400" size={24} />
                  <h2 className="text-2xl font-bold text-white">3. Data Security</h2>
                </div>
                <p className="text-gray-300">
                  We implement appropriate security measures to protect your personal information 
                  and ensure your gaming experience remains secure and private.
                </p>
              </section>

              <section className="p-6 bg-gray-700/30 rounded-xl border border-gray-600">
                <div className="flex items-center gap-3 mb-4">
                  <RefreshCw className="text-yellow-400" size={24} />
                  <h2 className="text-2xl font-bold text-white">4. Changes to This Policy</h2>
                </div>
                <p className="text-gray-300">
                  We may update our Privacy Policy from time to time. We will notify you of any 
                  changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}