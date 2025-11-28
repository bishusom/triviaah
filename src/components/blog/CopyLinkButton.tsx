// components/blog/CopyLinkButton.tsx
'use client';

import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

interface CopyLinkButtonProps {
  slug: string;
}

export default function CopyLinkButton({ slug }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://triviaah.com/blog/${slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `https://triviaah.com/blog/${slug}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 bg-gray-800 hover:bg-purple-600 text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 group"
      title="Copy link to clipboard"
    >
      {copied ? (
        <Check size={18} className="text-green-400 group-hover:scale-110 transition-transform" />
      ) : (
        <Link2 size={18} className="group-hover:scale-110 transition-transform" />
      )}
      <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
    </button>
  );
}