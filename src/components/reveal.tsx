'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Scroll-reveal wrapper. Adds the `.in` class when the element first enters
 * the viewport, driving the fade-up defined in globals.css. Respects
 * prefers-reduced-motion (the CSS zeroes the transition there, so content
 * still appears, it just doesn't animate). Renders content immediately if
 * IntersectionObserver is unavailable.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article';
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = Tag as 'div';
  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      className={`reveal ${shown ? 'in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Comp>
  );
}
