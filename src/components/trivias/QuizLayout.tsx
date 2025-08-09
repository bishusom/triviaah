// components/QuizLayout.tsx
import { AdMultiplex } from '@/components/Ads'

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1">
        {children}
      </div>
      <AdMultiplex />
    </div>
  );
}