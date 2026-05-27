'use client';
import { useEffect, useRef, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Force-restart the animation by removing it, triggering reflow, re-adding
    el.style.animation = 'none';
    void el.offsetHeight;
    el.style.animation = 'page-enter 0.6s cubic-bezier(0.22, 1, 0.36, 1) both';
  }, [pathname]);

  return (
    <div ref={ref} style={{ animation: 'page-enter 0.6s cubic-bezier(0.22, 1, 0.36, 1) both' }}>
      {children}
    </div>
  );
}
