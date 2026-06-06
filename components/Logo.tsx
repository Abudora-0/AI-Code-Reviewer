export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      {/* Rounded square bg */}
      <rect width="32" height="32" rx="8" fill="url(#logoGrad)" />
      {/* Code brackets */}
      <path d="M10 11L6 16L10 21" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 11L26 16L22 21" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Check mark / slash */}
      <path d="M19 10L13 22" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
