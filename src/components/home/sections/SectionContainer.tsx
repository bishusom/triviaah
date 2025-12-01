// components/home/sections/SectionContainer.tsx
interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  dataNoAds?: boolean;
}

export default function SectionContainer({ 
  children, 
  className = '', 
  dataNoAds = true 
}: SectionContainerProps) {
  return (
    <div className="border-2 border-blue-600 rounded-lg p-4 mb-8">
      <div 
        className={className} 
        {...(dataNoAds && { 'data-no-ads': 'true' })}
      >
        {children}
      </div>
    </div>
  );
}