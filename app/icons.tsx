import type { CSSProperties, ReactNode } from 'react';

type P = { size?: number; className?: string; style?: CSSProperties };

function Svg({ size = 24, className, style, children }: P & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {children}
    </svg>
  );
}

export const IconFlame = (p: P) => (
  <Svg {...p}>
    <path d="M12 2C9 6 6.5 10.5 8.5 14.5c1 2.3 3.5 3.5 3.5 3.5s2.5-1.2 3.5-3.5C17.5 10.5 15 6 12 2z" />
    <path d="M10 17.5a2 2 0 004 0c0-1.1-.9-2-2-2s-2 .9-2 2z" />
  </Svg>
);

export const IconLink = (p: P) => (
  <Svg {...p}>
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </Svg>
);

/* Garfield-style cat: oval head, ear triangles, half-lid eyes, whiskers, smirk */
export const IconCat = (p: P) => (
  <Svg {...p}>
    <ellipse cx="12" cy="14" rx="8" ry="7" />
    <path d="M5 9.5L4 4.5l4 3M19 9.5L20 4.5l-4 3" />
    <path d="M8.5 12.5h2.5" strokeWidth="2" />
    <path d="M13 12.5h2.5" strokeWidth="2" />
    <path d="M11 15.5l1 1 1-1" />
    <path d="M9.5 17.5q2.5 2 5 0" />
    <line x1="1.5" y1="13.5" x2="5.5" y2="14" />
    <line x1="1.5" y1="15.5" x2="5.5" y2="15.5" />
    <line x1="18.5" y1="14" x2="22.5" y2="13.5" />
    <line x1="18.5" y1="15.5" x2="22.5" y2="15.5" />
  </Svg>
);

export const IconShare = (p: P) => (
  <Svg {...p}>
    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
    <polyline points="7 9 12 4 17 9" />
    <line x1="12" y1="4" x2="12" y2="16" />
  </Svg>
);

export const IconFolder = (p: P) => (
  <Svg {...p}>
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </Svg>
);

export const IconFile = (p: P) => (
  <Svg {...p}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </Svg>
);

/* Raised-eyebrow smirk face — snarky mode */
export const IconSmirk = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M7 9q1.5-2 3.5-.5" />
    <path d="M13.5 8q2-1.5 3.5.5" />
    <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
    <path d="M9 15.5q2.5 0 5-1.5" />
  </Svg>
);

/* Leaf — gentle mode */
export const IconLeaf = (p: P) => (
  <Svg {...p}>
    <path d="M17 8C8 10 5.9 16.17 3.82 19.41a1 1 0 001.46 1.31C9 17 11 15 17 8z" />
    <path d="M17 8c0 6-8 11-9 11" />
  </Svg>
);

export const IconMoon = (p: P) => (
  <Svg {...p}>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </Svg>
);

export const IconWarning = (p: P) => (
  <Svg {...p}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </Svg>
);
