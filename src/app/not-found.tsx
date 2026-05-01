import Link from 'next/link';
import { Home } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Triviaah',
  description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-[#0C121D] border border-blue-900/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(59,130,246,0.1)] text-center relative overflow-hidden backdrop-blur-sm">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/10 blur-[50px] -z-10 rounded-full"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-cyan-500/10 blur-[40px] -z-10 rounded-full"></div>
        
        <h1 className="text-8xl font-black mb-4 tracking-tighter text-blue-gradient drop-shadow-md">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-white mb-3">
          Page Not Found
        </h2>
        
        <p className="text-blue-200/70 mb-8 text-sm md:text-base leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95 group"
        >
          <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
