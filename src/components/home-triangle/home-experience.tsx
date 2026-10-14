'use client';

import React, { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { COMPANY } from '../../lib/company';
import { STATUS_LABEL, type StatusKind } from '../../lib/app-status';
import { PATHFINDER, TRIANGLE_PRODUCTS, allowDepth, tileToggle, type TriangleKey } from './model';
import styles from './home-triangle.module.css';

function canUseDepth() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return false;
  try {
    const canvas = document.createElement('canvas');
    return allowDepth(reduced, Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch {
    return false;
  }
}

type Shown = StatusKind | 'checking';
const KINDS: ReadonlyArray<StatusKind> = ['active', 'degraded', 'offline', 'maintenance', 'unknown'];
const UNKNOWN: Record<TriangleKey, Shown> = { academy: 'unknown', velocity: 'unknown', andiamo: 'unknown' };

/** SITE-HOME-FEEDBACK-1008-002 item 4: the pills start at "Checking status" and take only what /api/status reads. */
function useLiveStatus(): Record<TriangleKey, Shown> {
  const [status, setStatus] = useState<Record<TriangleKey, Shown>>({ academy: 'checking', velocity: 'checking', andiamo: 'checking' });
  useEffect(() => {
    let live = true;
    async function read() {
      try {
        const res = await fetch('/api/status', { cache: 'no-store', signal: AbortSignal.timeout(8000) });
        const json = (await res.json()) as { apps?: Record<string, unknown> };
        const next = { ...UNKNOWN };
        for (const key of Object.keys(next) as TriangleKey[]) {
          const value = json.apps?.[key];
          if (KINDS.includes(value as StatusKind)) next[key] = value as StatusKind;
        }
        if (live) setStatus(next);
      } catch {
        if (live) setStatus(UNKNOWN);
      }
    }
    read();
    const timer = window.setInterval(read, 60_000);
    return () => { live = false; window.clearInterval(timer); };
  }, []);
  return status;
}

function StatusIcon({ kind, appKey }: { kind: Shown; appKey: TriangleKey }) {
  const glyph: Record<Shown, ReactNode> = {
    checking: <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" />,
    active: <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
    degraded: <path d="M12 7v6M12 16.5v.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />,
    offline: <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />,
    maintenance: <path d="M14.5 6.5a3.5 3.5 0 0 0-4.4 4.4L6.5 14.5l3 3 3.6-3.6a3.5 3.5 0 0 0 4.4-4.4l-2 2-2-1-1-2z" fill="currentColor" />,
    unknown: <path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.3M12 16.6v.4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  };
  return (
    <span className={styles.statusIcon} data-status-icon={appKey} data-status={kind} aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="11" fill="currentColor" opacity=".16" />{glyph[kind]}</svg>
    </span>
  );
}

// SITE-HOME-FEEDBACK-1008-001 (Brendan 10-08): no Enter screen, straight onto the picker. Each tile expands its OWN box:
// on hover where the pointer can hover (CSS), and on click or tap (state), so touch never needs a second tap to read it.
// The panel text is server-rendered in every tile, so it is there with JavaScript off too.
export function HomeExperience({ children }: { children: ReactNode }) {
  const [depth, setDepth] = useState(false);
  const [open, setOpen] = useState<TriangleKey | null>(null);
  const status = useLiveStatus();
  const nodes = useRef<Record<TriangleKey, HTMLButtonElement | null>>({ academy: null, velocity: null, andiamo: null });

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setDepth(canUseDepth());
    update();
    motion.addEventListener('change', update);
    return () => motion.removeEventListener('change', update);
  }, []);

  function close() {
    const key = open;
    setOpen(null);
    if (key) nodes.current[key]?.focus();
  }

  return (
    <div className={styles.home} data-home>
      <div className={styles.content} data-home-content>
        <section className={styles.hero} aria-labelledby="home-heading" data-depth={depth ? 'on' : 'off'}
          onKeyDown={event => {
            if (event.key === 'Escape' && open) {
              event.preventDefault();
              close();
            }
          }}>
          <div className={styles.heroHeading}>
            <h1 id="home-heading">{COMPANY.motto}</h1>
          </div>
          <div className={styles.triangle}>
            <svg className={styles.lines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="M50 7 L8 88 L92 88 Z" fill="none" stroke="currentColor" strokeWidth="0.45" vectorEffect="non-scaling-stroke" />
            </svg>
            <ul className={styles.nodes} aria-label="Andiamo products">
              {TRIANGLE_PRODUCTS.map((product, index) => {
                const isOpen = open === product.key;
                return (
                  <li key={product.key} className={styles.nodeWrap} data-node-key={product.key} data-open={isOpen ? 'true' : 'false'}
                    style={{ '--accent': product.accent, '--index': index } as CSSProperties}>
                    <div className={styles.tile}>
                      <button ref={element => { nodes.current[product.key] = element; }} type="button"
                        className={styles.node} aria-expanded={isOpen} aria-controls={`tile-panel-${product.key}`}
                        onClick={() => setOpen(previous => tileToggle(previous, product.key))}>
                        <StatusIcon kind={status[product.key]} appKey={product.key} />
                        <span className={styles.nodeName}>{product.name}</span>
                      </button>
                      <div id={`tile-panel-${product.key}`} className={styles.tilePanel}>
                        <div className={styles.tilePanelInner}>
                          <span className={styles.pill} data-status={status[product.key]}>{STATUS_LABEL[status[product.key]]}</span>
                          <p>{product.about}</p>
                          <a className={styles.enter} data-enter-app={product.key} href={product.href}>
                            <span>Enter {product.name}</span><span className={styles.enterArrow} aria-hidden="true">→</span>
                          </a>
                          <a className={styles.more} href={`/products/${product.key}`}>More about {product.name}</a>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <a className={styles.pathfinder} href={PATHFINDER.href}>Pathfinder <span>Mac file manager</span> <span aria-hidden="true">↗</span></a>
        </section>
        {children}
      </div>
    </div>
  );
}
