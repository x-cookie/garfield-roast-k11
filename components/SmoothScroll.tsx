'use client';
import { useEffect, useRef, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const currentY = useRef(0);
  const targetY = useRef(0);
  const rafId = useRef<number>(0);
  const pathname = usePathname();

  useEffect(() => {
    // Skip on touch devices — lerp scroll feels wrong on mobile
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    // Reset on route change
    currentY.current = 0;
    targetY.current = 0;
    window.scrollTo(0, 0);
    wrap.style.transform = 'translateY(0px)';

    // Body height = content height → enables native scrollbar + scrollY
    const syncHeight = () => {
      document.body.style.height = `${wrap.scrollHeight}px`;
    };

    const onScroll = () => { targetY.current = window.scrollY; };

    const tick = () => {
      const diff = targetY.current - currentY.current;
      if (Math.abs(diff) > 0.05) {
        // 0.075 = heavy, weighted feel
        currentY.current += diff * 0.075;
        wrap.style.transform = `translateY(${-currentY.current}px)`;
      }
      rafId.current = requestAnimationFrame(tick);
    };

    wrap.style.position = 'fixed';
    wrap.style.top = '0';
    wrap.style.left = '0';
    wrap.style.width = '100%';
    wrap.style.willChange = 'transform';

    syncHeight();
    window.addEventListener('scroll', onScroll, { passive: true });
    rafId.current = requestAnimationFrame(tick);

    const ro = new ResizeObserver(syncHeight);
    ro.observe(wrap);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId.current);
      ro.disconnect();
      document.body.style.height = '';
    };
  }, [pathname]);

  return <div ref={wrapRef}>{children}</div>;
}
