export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      {/* Terminal window background */}
      <rect width="32" height="32" rx="7" fill="url(#bg)" />
      {/* Title bar dots */}
      <circle cx="7" cy="8.5" r="1.5" fill="rgba(255,255,255,0.35)" />
      <circle cx="11.5" cy="8.5" r="1.5" fill="rgba(255,255,255,0.35)" />
      <circle cx="16" cy="8.5" r="1.5" fill="rgba(255,255,255,0.35)" />
      {/* Divider */}
      <line x1="3" y1="12" x2="29" y2="12" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      {/* > prompt */}
      <path d="M6 17L10 20L6 23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* cursor blink bar */}
      <rect x="13" y="17" width="6" height="2" rx="1" fill="rgba(255,255,255,0.9)" />
      {/* AI dot pulse */}
      <circle cx="26" cy="20" r="2.5" fill="#34d399" />
      <circle cx="26" cy="20" r="1.5" fill="white" />
    </svg>
  );
}
