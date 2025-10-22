// components/QuizLayout.tsx
import Ads from '@/components/common/Ads';

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1 pb-20 lg:pb-4">
        {children}
      </div>
      <Ads />
    </div>
  );
}