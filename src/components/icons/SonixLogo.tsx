import type { SVGProps } from 'react';

export function SonixLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" aria-label="Sonix Logo" {...props}>
      <defs>
        <linearGradient id="sonixGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <text
        x="10"
        y="40"
        fontFamily="var(--font-geist-mono, monospace)"
        fontSize="40"
        fontWeight="bold"
        fill="url(#sonixGradient)"
        letterSpacing="-1"
      >
        Sonix
      </text>
      {/* Simple sound wave like element */}
      <path
        d="M140 25 Q145 15, 150 25 T160 25 Q165 35, 170 25 T180 25"
        stroke="hsl(var(--accent))"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
