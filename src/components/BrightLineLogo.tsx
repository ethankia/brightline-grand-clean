export function BrightLineLogo({ className = "", invert = false }: { className?: string; invert?: boolean }) {
  const fg = invert ? "text-white" : "text-navy-deep";
  const accent = invert ? "text-sky" : "text-navy";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className={`h-8 w-8 ${accent}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M5 22 L13 14 L18 19 L27 8" />
        <path d="M5 27 L27 27" opacity="0.5" />
        <circle cx="27" cy="8" r="1.6" fill="currentColor" stroke="none" />
      </svg>
      <div className={`font-display text-lg font-bold tracking-tight leading-none ${fg}`}>
        BrightLine
        <span className={`ml-1 font-medium ${accent}`}>Cleaning</span>
      </div>
    </div>
  );
}
