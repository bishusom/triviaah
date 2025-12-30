// components/home/Footer.tsx
import Link from 'next/link';
import { MdInfo, MdEmail } from 'react-icons/md';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 px-4" data-no-ads="true">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">Triviaah</h3>
            <p className="text-gray-400">Free daily trivia challenges with answers & online quiz games</p>
          </div>
          <div className="flex gap-6">
            <Link href="/about" className="flex items-center hover:text-blue-300" prefetch={false}>
              <MdInfo className="mr-1" /> About Triviaah
            </Link>
            <Link href="/contact" className="flex items-center hover:text-blue-300" prefetch={false}>
              <MdEmail className="mr-1" /> Contact Us
            </Link>
            <Link href="/privacy" className="hover:text-blue-300" prefetch={false}>
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="mt-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Triviaah. Play free daily trivia challenges with answers and online quiz games.
        </div>
      </div>
    </footer>
  );
}