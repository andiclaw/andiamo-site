import { SPECTRUM } from '@/lib/company';

/**
 * The four-dot spectrum mark, the umbrella brand's signature device. Four
 * dots, one per product color, that read as a single object. Used in the
 * hero and as a recurring motif.
 */
export function SpectrumDots({ size = 10, gap = 8 }: { size?: number; gap?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap }} aria-hidden>
      {SPECTRUM.map((c, i) => (
        <span
          key={c}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: c,
            boxShadow: `0 0 ${size}px ${c}66`,
            animation: `dot-pulse 3s ease-in-out ${i * 0.4}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.55; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="dot-pulse"] { animation: none !important; opacity: 1 !important; }
        }
      `}</style>
    </span>
  );
}

/**
 * A thin section divider. Was an animated rainbow bar; per
 * AND-SITE-HERO-SWITCHER-3D-001 item 2 ("kill the rainbow gradient") it is now
 * a single static hairline.
 */
export function SpectrumBar({ className = '' }: { className?: string }) {
  return <div className={`h-px w-full bg-white/10 ${className}`} aria-hidden />;
}
