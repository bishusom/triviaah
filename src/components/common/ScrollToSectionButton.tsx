'use client';

import type { ReactNode } from 'react';

type ScrollToSectionButtonProps = {
  targetId: string;
  children: ReactNode;
  className: string;
};

export function ScrollToSectionButton({
  targetId,
  children,
  className,
}: ScrollToSectionButtonProps) {
  const scrollToTarget = () => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <button type="button" onClick={scrollToTarget} className={className}>
      {children}
    </button>
  );
}
