// components/home/sections/SectionContainer.tsx - Dark Theme
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
    <div className="border-2 border-cyan-500/30 rounded-xl p-4 mb-8 bg-gray-900/30 backdrop-blur-sm">
      <div 
        className={className} 
        {...(dataNoAds && { 'data-no-ads': 'true' })}
      >
        {children}
      </div>
    </div>
  );
}