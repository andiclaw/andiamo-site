'use client';

import React, { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { COMPANY } from '../../lib/company';
import { PATHFINDER, TRIANGLE_PRODUCTS, allowDepth, autoEnter, touchAction, type TriangleKey } from './model';
import styles from './home-triangle.module.css';

const VISIT_KEY = 'andiamo-home-entered-v1';

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

export function HomeExperience({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(false);
  const [depth, setDepth] = useState(false);
  const [selected, setSelected] = useState<TriangleKey | null>(null);
  const [touchArmed, setTouchArmed] = useState<TriangleKey | null>(null);
  const entryButton = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const lastPointer = useRef<string>('keyboard');
  const nodes = useRef<Record<TriangleKey, HTMLButtonElement | null>>({ academy: null, velocity: null, andiamo: null });

  useEffect(() => {
    let seen = false;
    try { seen = window.localStorage.getItem(VISIT_KEY) === '1'; } catch { /* storage may be denied */ }
    if (autoEnter(seen, window.matchMedia('(prefers-reduced-motion: reduce)').matches)) setEntered(true);
    else entryButton.current?.focus();

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setDepth(canUseDepth());
    update();
    motion.addEventListener('change', update);
    return () => motion.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (content.current) content.current.inert = !entered;
    const header = document.querySelector<HTMLElement>('body > header');
    const footer = document.querySelector<HTMLElement>('body > footer');
    if (header) header.inert = !entered;
    if (footer) footer.inert = !entered;
    return () => {
      if (header) header.inert = false;
      if (footer) footer.inert = false;
    };
  }, [entered]);

  function enter(focusHeading = true) {
    try { window.localStorage.setItem(VISIT_KEY, '1'); } catch { /* keep the session usable */ }
    setEntered(true);
    if (focusHeading) requestAnimationFrame(() => heading.current?.focus());
  }

  function choose(key: TriangleKey) {
    if (lastPointer.current === 'touch') {
      if (touchAction(touchArmed, key) === 'open') {
        const product = TRIANGLE_PRODUCTS.find(item => item.key === key)!;
        window.location.assign(product.href);
        return;
      }
      setTouchArmed(key);
    } else {
      setTouchArmed(null);
    }
    setSelected(key);
  }

  function closeDetail() {
    const key = selected;
    setSelected(null);
    setTouchArmed(null);
    if (key) nodes.current[key]?.focus();
  }

  return (
    <div className={styles.home} data-home-entry={entered ? 'closed' : 'open'}>
      <noscript><style>{`[data-home-entry] [data-entry-gate]{display:none!important}[data-home-entry] [data-home-content]{visibility:visible!important}body:has([data-home-entry="open"]) > header,body:has([data-home-entry="open"]) > footer,body:has([data-home-entry="open"]) > .skip-link{visibility:visible!important}`}</style></noscript>
      {!entered && (
        <section className={styles.entry} data-entry-gate aria-label="Enter Andiamo Tech">
          <div className={styles.entryInner}>
            <p className={styles.eyebrow}>{COMPANY.shortName}</p>
            <p className={styles.entryTitle}>{COMPANY.motto}</p>
            <button ref={entryButton} type="button" className={styles.enterButton} onClick={() => enter()}>
              Enter <span aria-hidden="true">↗</span>
            </button>
            <button type="button" className={styles.skipButton} onClick={() => enter()}>Skip intro</button>
          </div>
        </section>
      )}
      <div ref={content} className={styles.content} data-home-content data-locked={!entered}>
        <section className={styles.hero} aria-labelledby="home-heading" data-depth={depth ? 'on' : 'off'}
          onKeyDown={event => {
            if (event.key === 'Escape' && selected) {
              event.preventDefault();
              closeDetail();
            }
          }}>
          <div className={styles.heroHeading}>
            <p className={styles.eyebrow}>{COMPANY.shortName}</p>
            <h1 id="home-heading" ref={heading} tabIndex={-1}>{COMPANY.motto}</h1>
            <p>Three connected products. Choose one to learn more.</p>
          </div>
          <div className={styles.triangle}>
            <svg className={styles.lines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="M50 7 L8 88 L92 88 Z" fill="none" stroke="currentColor" strokeWidth="0.45" vectorEffect="non-scaling-stroke" />
            </svg>
            <ul className={styles.nodes} aria-label="Connected products">
              {TRIANGLE_PRODUCTS.map((product, index) => (
                <li key={product.key} className={styles.nodeWrap} data-node-key={product.key}
                  style={{ '--accent': product.accent, '--index': index } as CSSProperties}>
                  <button ref={element => { nodes.current[product.key] = element; }} type="button"
                    className={styles.node} aria-expanded={selected === product.key} aria-controls="triangle-detail"
                    onPointerDown={event => { lastPointer.current = event.pointerType; }}
                    onKeyDown={() => { lastPointer.current = 'keyboard'; }}
                    onClick={() => choose(product.key)}>
                    <span className={styles.nodeNumber} aria-hidden="true">0{index + 1}</span>
                    <span className={styles.nodeName}>{product.name}</span>
                    <span className={styles.nodeHint}>{selected === product.key ? 'Details open' : 'Select to reveal'}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div id="triangle-detail" className={styles.detail} aria-live="polite">
            {selected ? (() => {
              const product = TRIANGLE_PRODUCTS.find(item => item.key === selected)!;
              return (
                <div>
                  <p className={styles.eyebrow}>Selected product</p>
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>
                  <a href={product.href}>Open {product.name} <span aria-hidden="true">↗</span></a>
                  <button type="button" onClick={closeDetail}>Close details</button>
                  <p className={styles.touchHint}>On touch, tap the same product again to open its site.</p>
                </div>
              );
            })() : <p>Select a corner to see its product link.</p>}
          </div>
          <a className={styles.pathfinder} href={PATHFINDER.href}>Pathfinder <span>Mac file manager</span> <span aria-hidden="true">↗</span></a>
        </section>
        {children}
      </div>
    </div>
  );
}
