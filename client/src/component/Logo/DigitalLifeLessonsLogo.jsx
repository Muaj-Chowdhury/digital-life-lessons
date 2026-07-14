export default function DigitalLifeLessonsLogo({ className }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Hexagon gradient using theme colors */}
        <linearGradient id="hexGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#395B64" />
          <stop offset="100%" stopColor="#A5C9CA" />
        </linearGradient>

        {/* Node gradient */}
        <linearGradient id="nodeGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A5C9CA" />
          <stop offset="100%" stopColor="#E7F6F2" />
        </linearGradient>

        {/* Warm insight glow */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Hexagon frame */}
      <path
        d="M32 6L54 18V46L32 58L10 46V18L32 6Z"
        stroke="url(#hexGradient)"
        strokeWidth="2.5"
        fill="none"
      />

      {/* Knowledge connections */}
      <line x1="32" y1="20" x2="32" y2="28" stroke="#A5C9CA" strokeWidth="1.5" />
      <line x1="36" y1="32" x2="44" y2="32" stroke="#A5C9CA" strokeWidth="1.5" />
      <line x1="32" y1="36" x2="32" y2="44" stroke="#A5C9CA" strokeWidth="1.5" />
      <line x1="28" y1="32" x2="20" y2="32" stroke="#A5C9CA" strokeWidth="1.5" />

      {/* Knowledge nodes */}
      <circle cx="32" cy="16" r="2.5" fill="url(#nodeGradient)" />
      <circle cx="46" cy="32" r="2.5" fill="url(#nodeGradient)" />
      <circle cx="32" cy="48" r="2.5" fill="url(#nodeGradient)" />
      <circle cx="18" cy="32" r="2.5" fill="url(#nodeGradient)" />

      {/* Core insight */}
      <circle cx="32" cy="32" r="4.5" fill="#F2C14E" filter="url(#glow)" />
    </svg>
  );
}