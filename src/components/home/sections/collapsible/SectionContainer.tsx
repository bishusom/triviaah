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
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-xl shadow-black/20 backdrop-blur-sm">
      <div className="absolute inset-0 bg-[radial-gradient(80%_120%_at_20%_10%,rgba(37,99,235,0.18)_0%,transparent_55%)] pointer-events-none" />
      <div 
        className={`relative z-10 ${className}`} 
        {...(dataNoAds && { 'data-no-ads': 'true' })}
      >
        {children}
      </div>
    </div>
  );
}
