// components/home/sections/HowItWorksSection.tsx - Minimalist version
import { Play, Check, TrendingUp, ChevronRight } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      title: 'Select & Play',
      description: 'Choose from 50+ daily trivia categories and start playing',
      icon: <Play className="w-5 h-5" />,
      color: 'text-blue-500',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Get Answers',
      description: 'Receive instant feedback with detailed explanations',
      icon: <Check className="w-5 h-5" />,
      color: 'text-green-500',
      borderColor: 'border-green-200'
    },
    {
      title: 'Track & Improve',
      description: 'Monitor your progress and learn with every game',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-purple-500',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gray-600">Simple steps to boost your knowledge</p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-100 via-green-100 to-purple-100 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="flex flex-col items-center text-center">
                  {/* Icon circle */}
                  <div className={`relative z-10 mb-6 p-4 bg-white rounded-full border-2 ${step.borderColor} shadow-sm`}>
                    <div className={step.color}>
                      {step.icon}
                    </div>
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>

                {/* Arrow connector for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-6">
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-800">28+</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">24h</div>
              <div className="text-sm text-gray-600">Daily Updates</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">100%</div>
              <div className="text-sm text-gray-600">Free Access</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">Instant</div>
              <div className="text-sm text-gray-600">Feedback</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}