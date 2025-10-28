// components/home/Footer.tsx
import Link from 'next/link';
import { MdInfo, MdEmail } from 'react-icons/md';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 px-4" data-no-ads="true">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">Triviaah - Daily Trivia Games</h3>
            <p className="text-gray-400">
              Play <strong>free daily trivia challenges</strong> with answers & explanations. 
              Your source for <strong>daily quiz with answers</strong> across all categories.
            </p>
          </div>
          <div className="flex gap-6">
            <Link href="/about" className="flex items-center hover:text-blue-300" prefetch={false}>
              <MdInfo className="mr-1" /> About Triviaah
            </Link>
            <Link href="/contact" className="flex items-center hover:text-blue-300" prefetch={false}>
              <MdEmail className="mr-1" /> Contact Triviaah
            </Link>
            <Link href="/privacy" className="hover:text-blue-300" prefetch={false}>
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="mt-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} <strong>Triviaah.com</strong>. All rights reserved.
        </div>
      </div>
    </footer>
  );
}