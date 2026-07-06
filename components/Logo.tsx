export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* bezel */}
      <rect x="1" y="1" width="30" height="30" fill="#12110d" stroke="#4d4526" strokeWidth="1.5" />
      {/* phosphor prompt */}
      <path d="M7 10L13 16L7 22" stroke="#ffb000" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" />
      {/* cursor block */}
      <rect x="16" y="19.5" width="8" height="3" fill="#ffb000" />
      {/* scanline notches */}
      <rect x="24.5" y="7" width="2" height="2" fill="#575340" />
      <rect x="21" y="7" width="2" height="2" fill="#575340" />
    </svg>
  );
}
