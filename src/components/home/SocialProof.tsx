import Link from 'next/link';

export default function SocialProof() {
  const testimonials = [
    {
      text: "I've learned more from Triviaah in 2 weeks than I did in school! The explanations are fantastic.",
      author: "Sarah M.",
      role: "Daily Player",
      rating: 5
    },
    {
      text: "The daily challenges keep me coming back. It's the perfect brain exercise with my morning coffee.",
      author: "Mike R.", 
      role: "Trivia Enthusiast",
      rating: 5
    },
    {
      text: "As a teacher, I use Triviaah to make learning fun for my students. They love the competitive aspect!",
      author: "Dr. James K.",
      role: "High School Teacher", 
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-gray-800 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join 10,000+ Trivia Lovers
          </h2>
          <p className="text-gray-400 text-lg">
            See what our community is saying about their Triviaah experience
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-6 border border-gray-600"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">⭐</span>
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
              <div>
                <div className="font-semibold text-white">{testimonial.author}</div>
                <div className="text-sm text-gray-400">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-12 border border-cyan-500/20">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Challenge Your Mind?
          </h3>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">
            Join thousands of players enjoying free daily trivia and brain games
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/daily-trivias/quick-fire" >
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 border border-cyan-400/30 text-lg">
                Start Playing Free
              </button>
            </Link>
            
            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 font-semibold py-4 px-8 rounded-xl transition-all duration-300 backdrop-blur-sm text-lg">
              <Link href="/trivias" >
                Learn More
              </Link>
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>No registration required</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💯</span>
              <span>100% free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📱</span>
              <span>Works on all devices</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}