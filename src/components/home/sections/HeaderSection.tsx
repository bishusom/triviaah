// components/home/sections/HeaderSection.tsx
import Image from 'next/image';

export default function HeaderSection() {
  return (
    <header className="bg-blue-700 text-white py-4 px-4">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <Image
          src="/logo.webp"
          alt="Elite Trivias - Free Daily Trivia Games"
          width={200}
          height={36}
          priority
          quality={85}
          sizes="(max-width: 768px) 200px, 280px"
          className="object-contain lcp-priority"
        />
      </div>
    </header>
  );
}