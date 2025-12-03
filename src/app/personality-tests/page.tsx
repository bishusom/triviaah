'use client';

import Link from 'next/link';
import { FaBrain, FaChartBar, FaUserFriends, FaHeart, FaBriefcase, FaStar } from 'react-icons/fa';
import { MdPsychology, MdEmojiPeople, MdWork, MdFavorite } from 'react-icons/md';

const personalityTests = [
  {
    id: 'mbti',
    name: 'MBTI Personality Test',
    description: 'Discover your Myers-Briggs Type (INFP, ESTJ, etc.) with detailed career matches and strengths analysis',
    icon: <MdPsychology className="text-3xl" />,
    color: 'from-blue-500 to-purple-600',
    questions: 60,
    time: '10 min',
    link: '/personality-tests/mbti'
  },
  {
    id: 'big-five',
    name: 'Big Five (OCEAN) Test',
    description: 'Scientifically-validated trait analysis with percentile scores for all 5 major personality dimensions',
    icon: <FaBrain className="text-3xl" />,
    color: 'from-purple-500 to-pink-600',
    questions: 60,
    time: '10 min',
    link: '/personality-tests/big-five'
  },
  {
    id: 'enneagram',
    name: 'Enneagram Test',
    description: 'Discover your Enneagram type with core motivations, fears, and growth paths',
    icon: <MdEmojiPeople className="text-3xl" />,
    color: 'from-orange-500 to-red-600',
    questions: 50,
    time: '8 min',
    link: '/personality-tests/enneagram',
  },
  {
    id: 'disc',
    name: 'DISC Assessment',
    description: 'Understand your communication style (Dominance, Influence, Steadiness, Conscientiousness)',
    icon: <FaChartBar className="text-3xl" />,
    color: 'from-green-500 to-cyan-600',
    questions: 40,
    time: '7 min',
    link: '/personality-tests/disc',
  },
  {
    id: 'love-languages',
    name: 'Love Languages Test',
    description: 'Discover how you give and receive love in relationships',
    icon: <MdFavorite className="text-3xl" />,
    color: 'from-pink-500 to-red-600',
    questions: 30,
    time: '5 min',
    link: '/personality-tests/love-languages',
  },
  {
    id: 'holland-code',
    name: 'Holland Career Test',
    description: 'Find your ideal career path based on your personality (RIASEC model)',
    icon: <MdWork className="text-3xl" />,
    color: 'from-blue-300 to-blue-600',
    questions: 45,
    time: '8 min',
    link: '/personality-tests/holland-code'
  }
];

export default function PersonalityHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Discover Your True Self
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Take free, scientifically-based personality tests to understand yourself better.
            All tests are private, downloadable, and created by psychology experts.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              🔒 Privacy-first: Your data stays on your device
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              📊 Scientifically-based models
            </div>
            <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
              💾 Downloadable reports
            </div>
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {personalityTests.map((test) => (
            <Link 
              href={test.link}
              key={test.id}
              className="block transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className={`bg-gradient-to-br ${test.color} rounded-2xl p-1 h-full`}>
                <div className="bg-white rounded-xl p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${test.color} text-white`}>
                      {test.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {test.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 flex-grow">
                    {test.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <span className="mr-2">📝</span>
                      {test.questions} questions
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">⏱️</span>
                      {test.time}
                    </div>
                  </div>
                  
                  <div className="mt-auto text-center py-3 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-colors">
                    Take Test →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-12 border border-blue-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Why Take Personality Tests?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBriefcase className="text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Career Growth</h4>
              <p className="text-gray-600 text-sm">
                Discover careers that match your personality and work style
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserFriends className="text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Better Relationships</h4>
              <p className="text-gray-600 text-sm">
                Understand yourself and others for improved communication
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Personal Development</h4>
              <p className="text-gray-600 text-sm">
                Identify your strengths and areas for growth
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Self-Awareness</h4>
              <p className="text-gray-600 text-sm">
                Gain insights into your motivations and behaviors
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Promise */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">🔒 Our Privacy Promise</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-800">No Account Required</h4>
                  <p className="text-gray-600 text-sm">Take tests instantly without signing up</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Local Processing</h4>
                  <p className="text-gray-600 text-sm">All calculations happen on your device</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Download & Keep</h4>
                  <p className="text-gray-600 text-sm">Save your reports forever</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-800">No Data Storage</h4>
                  <p className="text-gray-600 text-sm">We don&apos;t store your answers or results</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}