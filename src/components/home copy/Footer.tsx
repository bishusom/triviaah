// components/home/Footer.tsx - Dark Theme
import Link from 'next/link';
import { MdInfo, MdEmail, MdSecurity, MdLeaderboard } from 'react-icons/md';
import { FaGamepad, FaTwitter, FaDiscord, FaTrophy } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4" data-no-ads="true">
      <div className="container mx-auto max-w-6xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <div className="text-white text-xl">🧠</div>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Triviaah
              </h3>
            </div>
            <p className="text-gray-300 text-lg mb-4 leading-relaxed">
              Free daily trivia challenges with answers & online quiz games. Test your knowledge across countless categories!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <MdLeaderboard className="text-cyan-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/daily-trivias" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full group-hover:scale-150 transition-transform"></div>
                  Daily Challenge
                </Link>
              </li>
              <li>
                <Link href="/brainwave" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full group-hover:scale-150 transition-transform"></div>
                  Brain Waves
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full group-hover:scale-150 transition-transform"></div>
                  All Trivias
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full group-hover:scale-150 transition-transform"></div>
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <MdSecurity className="text-cyan-400" />
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full group-hover:scale-150 transition-transform"></div>
                  About Triviaah
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full group-hover:scale-150 transition-transform"></div>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full group-hover:scale-150 transition-transform"></div>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full group-hover:scale-150 transition-transform"></div>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Triviaah. Play free daily trivia challenges with answers and online quiz games.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <span className="text-gray-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Online: 2.4K Players
              </span>
              <span className="text-gray-400">Made with ❤️ for trivia lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}