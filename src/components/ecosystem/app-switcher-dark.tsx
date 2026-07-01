/**
 * andiamo.tech ecosystem app launcher (apex-site variant).
 *
 * Mirrors academy's ACA-APPSWITCHER-REVISE-001: the 3 public products
 * (Academy, Velocity, Andiamo) with their real brand marks. AndiHub is
 * internal-only and intentionally excluded. This is the apex company site,
 * so the andiamo.tech company entry renders as the current/active item and
 * the product rows are the jump targets.
 *
 * The apex site is dark-themed (#04070e), so the dropdown chrome is dark to
 * match; it is deliberately not the cream/light panel academy uses, so it
 * never reads as a white hood on this background.
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import { ecosystemApps } from './ecosystem-apps';

const ACADEMY_MARK_SRC = '/brand/andaro/concepts/sleek-purple-no-eyes-tile.svg';
const VELOCITY_MARK_SRC = '/brand/ecosystem/velocity-mark.png';
const ANDIAMO_MARK_SRC = '/brand/ecosystem/andiamo-mark.svg';

const MARK_SRC: Record<string, string> = {
  academy: ACADEMY_MARK_SRC,
  velocity: VELOCITY_MARK_SRC,
  andiamo: ANDIAMO_MARK_SRC,
};

function AppMark({ appKey, fallback, size }: { appKey: string; fallback: string; size: number }) {
  const src = MARK_SRC[appKey];
  const radius = Math.max(7, Math.round(size * 0.24));
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        style={{ width: size, height: size, borderRadius: radius, display: 'block', flexShrink: 0 }}
      />
    );
  }
  return (
    <span
      style={{
        alignItems: 'center',
        background: '#312e81',
        borderRadius: radius,
        color: '#fff',
        display: 'flex',
        flexShrink: 0,
        fontSize: Math.max(11, Math.round(size * 0.42)),
        fontWeight: 800,
        height: size,
        justifyContent: 'center',
        width: size,
      }}
    >
      {fallback}
    </span>
  );
}

export default function AppSwitcherDark() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Explore the Andiamo products"
        onClick={() => setOpen((value) => !value)}
        className="focusable"
        style={{
          alignItems: 'center',
          background: open ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 10,
          color: '#e2e8f0',
          cursor: 'pointer',
          display: 'flex',
          fontFamily: 'inherit',
          gap: 8,
          minHeight: 36,
          padding: '5px 10px',
          transition: 'background 0.15s ease, border-color 0.15s ease',
        }}
      >
        {/* three-dot grid glyph = "apps" */}
        <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor" aria-hidden="true" style={{ color: '#94a3b8' }}>
          <circle cx="3" cy="3" r="1.6" />
          <circle cx="7.5" cy="3" r="1.6" />
          <circle cx="12" cy="3" r="1.6" />
          <circle cx="3" cy="7.5" r="1.6" />
          <circle cx="7.5" cy="7.5" r="1.6" />
          <circle cx="12" cy="7.5" r="1.6" />
          <circle cx="3" cy="12" r="1.6" />
          <circle cx="7.5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
        </svg>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.2 }}>Products</span>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ color: '#94a3b8', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div
            role="menu"
            style={{
              animation: 'eco-dropdown-in 0.15s ease',
              background: '#0b111d',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 12,
              boxShadow: '0 22px 50px rgba(0,0,0,0.55)',
              overflow: 'hidden',
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              width: 288,
              zIndex: 50,
            }}
          >
            <div style={{ color: '#64748b', fontSize: 10, fontWeight: 700, letterSpacing: 1.4, padding: '11px 14px 5px', textTransform: 'uppercase' }}>
              Andiamo products
            </div>
            {ecosystemApps.map((app) => (
              <a
                key={app.key}
                href={app.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                style={{
                  alignItems: 'center',
                  background: 'transparent',
                  borderLeft: '3px solid transparent',
                  color: '#e2e8f0',
                  display: 'flex',
                  fontSize: 13,
                  gap: 11,
                  minHeight: 52,
                  padding: '8px 14px 8px 11px',
                  textDecoration: 'none',
                  transition: 'background 0.1s ease, border-color 0.1s ease',
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  event.currentTarget.style.borderLeftColor = app.accentColor;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = 'transparent';
                  event.currentTarget.style.borderLeftColor = 'transparent';
                }}
              >
                <AppMark appKey={app.key} fallback={app.icon} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.16, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.title}</div>
                  <div style={{ color: '#64748b', fontSize: 11, lineHeight: 1.24, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.tagline}</div>
                </div>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ color: '#475569', flexShrink: 0 }}>
                  <path d="M4 2H10V8M10 2L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
            {/* Company entry = this site, rendered as the current item. */}
            <div
              style={{
                alignItems: 'center',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                color: '#64748b',
                display: 'flex',
                fontSize: 11,
                fontWeight: 600,
                gap: 6,
                justifyContent: 'center',
                padding: '9px 14px',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#33A532', flexShrink: 0 }} />
              You are on andiamo.tech, the company site
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes eco-dropdown-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
