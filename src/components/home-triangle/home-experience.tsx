'use client';

import React, { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { COMPANY } from '../../lib/company';
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

// SITE-HOME-FEEDBACK-1008-001 (Brendan 10-08): no Enter screen, straight onto the picker. Each tile expands its OWN box:
// on hover where the pointer can hover (CSS), and on click or tap (state), so touch never needs a second tap to read it.
// The panel text is server-rendered in every tile, so it is there with JavaScript off too.
export function HomeExperience({ children }: { children: ReactNode }) {
  const [depth, setDepth] = useState(false);
  const [open, setOpen] = useState<TriangleKey | null>(null);
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
            <p className={styles.eyebrow}>{COMPANY.shortName}</p>
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
                        <span className={styles.nodeNumber} aria-hidden="true">0{index + 1}</span>
                        <span className={styles.nodeName}>{product.name}</span>
                      </button>
                      <div id={`tile-panel-${product.key}`} className={styles.tilePanel}>
                        <div className={styles.tilePanelInner}>
                          <p>{product.description}</p>
                          <a href={product.href}>Open {product.name} <span aria-hidden="true">↗</span></a>
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
