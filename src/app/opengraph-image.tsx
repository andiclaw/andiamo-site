import { ImageResponse } from 'next/og';

export const alt = 'Andiamo Tech, Inc. — a Delaware Public Benefit Corporation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// One OG image for the whole site. Renders as the link card when this site
// is pasted in Slack / Twitter / LinkedIn / iMessage. Per-route OG images
// can override this by colocating their own opengraph-image.tsx — defer
// until / and /products warrant the differentiation.
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#050a14',
          backgroundImage:
            'radial-gradient(ellipse at top, rgba(56,189,248,0.18) 0%, transparent 55%), radial-gradient(ellipse at bottom right, rgba(139,92,246,0.14) 0%, transparent 60%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#f1f5f9',
        }}
      >
        {/* Top: brand mark + entity chip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: 20,
                background: 'linear-gradient(135deg, #1E293B 0%, #0EA5E9 55%, #06B6D4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="46" height="46" viewBox="0 0 32 32">
                <path d="M11 8 L21 16 L11 24 Z" fill="#ffffff" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>
                andiamo
              </span>
              <span style={{ fontSize: 18, color: '#22D3EE', letterSpacing: 4, marginTop: 4 }}>
                TECH
              </span>
            </div>
          </div>
          <div
            style={{
              fontSize: 13,
              letterSpacing: 4,
              padding: '8px 16px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.04)',
              color: '#94a3b8',
            }}
          >
            DELAWARE PBC
          </div>
        </div>

        {/* Middle: tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 920 }}>
          <span style={{ fontSize: 72, fontWeight: 900, letterSpacing: -2, lineHeight: 1.05 }}>
            Tools that respect{' '}
            <span style={{
              background: 'linear-gradient(90deg, #67e8f9, #60a5fa)',
              backgroundClip: 'text',
              color: 'transparent',
            }}>
              the people
            </span>{' '}
            who use them.
          </span>
          <span style={{ fontSize: 22, color: '#94a3b8', marginTop: 18, lineHeight: 1.4 }}>
            Velocity · Academy · Andiamo · Pathfinder — four products, one company, one charter.
          </span>
        </div>

        {/* Bottom: location + URL */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 18, color: '#64748b' }}>
          <span>Built in Skagit Valley, Washington.</span>
          <span style={{ color: '#22D3EE' }}>andiamo.tech</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
