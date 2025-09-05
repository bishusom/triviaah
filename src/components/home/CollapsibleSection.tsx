// components/home/CollapsibleSection.tsx
'use client';

import { useState } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <section className="bg-white rounded-lg p-6 mb-8 shadow-sm sm:static">
      <button 
        className="flex justify-between items-center w-full text-left sm:cursor-default"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
        <span className="sm:hidden">
          {isExpanded ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
        </span>
      </button>
      <div className={`${isExpanded ? 'block' : 'hidden'} sm:block mt-4`}>
        {children}
      </div>
    </section>
  );
}