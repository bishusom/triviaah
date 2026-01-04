import Link from 'next/link';
import { ArrowLeft, Target, Users, Star, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Heart size={18} />
            OUR STORY
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            About Triviaah
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Level up your knowledge with daily trivia challenges designed for gamers and knowledge enthusiasts.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Mission Section */}
          <div className="bg-gray-800/50 rounded-2xl border-2 border-gray-700 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-600 rounded-xl">
                <Target className="text-white" size={28} />
              </div>
              <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed">
              Triviaah was created to bring fun, engaging daily trivia challenges to knowledge 
              enthusiasts worldwide. We believe learning should be enjoyable and accessible to everyone, 
              combining the thrill of gaming with the satisfaction of learning.
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-gray-800/50 rounded-2xl border-2 border-gray-700 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Star className="text-white" size={28} />
              </div>
              <h2 className="text-3xl font-bold text-white">How It Works</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-gray-300">New quizzes available every 24 hours</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-gray-300">Multiple categories to test your knowledge</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-gray-300">Compete with friends on leaderboards</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <span className="text-gray-300">Track your progress and improve over time</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-gray-800/50 rounded-2xl border-2 border-gray-700 p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-green-600 rounded-xl">
                <Users className="text-white" size={28} />
              </div>
              <h2 className="text-3xl font-bold text-white">The Team</h2>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed">
              Triviaah is developed by a passionate team of trivia enthusiasts, gamers, and developers 
              who are dedicated to creating engaging educational experiences that feel more like play 
              than work.
            </p>
          </div>

          {/* Community Section 
          <div className="bg-gray-800/50 rounded-2xl border-2 border-gray-700 p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Join Our Gaming Community</h2>
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                Connect with other players, suggest new categories, and stay updated on new features 
                through our social media channels and community forums.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-colors font-semibold">
                  Join Discord
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors font-semibold">
                  Follow on Twitter
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-colors font-semibold">
                  Subscribe on YouTube
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}