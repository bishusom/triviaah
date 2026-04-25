'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

type MobileExpandableDescriptionProps = {
  children: string;
  className?: string;
};

export function MobileExpandableDescription({
  children,
  className = '',
}: MobileExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <p className={`${className} ${isExpanded ? '' : 'line-clamp-3 md:line-clamp-none'}`}>
        {children}
      </p>
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((current) => !current)}
        className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-cyan-300 transition-colors hover:text-cyan-200 md:hidden"
      >
        {isExpanded ? (
          <>
            Show less <ChevronUp className="h-3.5 w-3.5" />
          </>
        ) : (
          <>
            Read full description <ChevronDown className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </div>
  );
}
