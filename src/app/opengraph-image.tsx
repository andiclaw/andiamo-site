import { ImageResponse } from 'next/og';

export const alt = 'Andiamo Tech, Inc. — Software with an obligation to you.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const SPECTRUM = ['#22D3EE', '#8B5CF6', '#22C55E', '#F59E0B'];

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#04070e',
          backgroundImage:
            'radial-gradient(ellipse at top left, rgba(99,102,241,0.20) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(34,197,94,0.14) 0%, transparent 55%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 72px',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#f1f5f9',
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 18,
                background: 'linear-gradient(135deg, #1E293B 0%, #0EA5E9 55%, #06B6D4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="40" height="40" viewBox="0 0 32 32">
                <path d="M11 8 L21 16 L11 24 Z" fill="#ffffff" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>andiamo</span>
              <span style={{ fontSize: 16, color: '#22D3EE', letterSpacing: 4, marginTop: 3 }}>TECH</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 4,
              padding: '8px 16px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)',
              color: '#cbd5e1',
            }}
          >
            DELAWARE PUBLIC BENEFIT CORPORATION
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 980 }}>
          <span style={{ fontSize: 78, fontWeight: 900, letterSpacing: -2.5, lineHeight: 1.04 }}>
            Software with an{' '}
            <span
              style={{
                backgroundImage: 'linear-gradient(90deg, #67e8f9, #a78bfa 45%, #4ade80 75%, #fbbf24)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              obligation
            </span>{' '}
            to you.
          </span>
          <span style={{ fontSize: 24, color: '#94a3b8', marginTop: 22, lineHeight: 1.4, maxWidth: 880 }}>
            Four products, built by a small team that&apos;s legally bound to put the people who use them first.
          </span>
        </div>

        {/* Bottom: spectrum + products + url */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden' }}>
            {SPECTRUM.map((c) => (
              <div key={c} style={{ flex: 1, background: c }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 19 }}>
            <div style={{ display: 'flex', gap: 24, color: '#cbd5e1' }}>
              <span>Velocity</span>
              <span>Academy</span>
              <span>Andiamo</span>
              <span>Pathfinder</span>
            </div>
            <span style={{ color: '#22D3EE', fontWeight: 600 }}>andiamo.tech</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
