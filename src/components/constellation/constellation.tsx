'use client';

import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PRODUCTS } from '../../lib/products';
import { lifecycleFor } from '../../lib/lifecycle';
import { ecosystemApps } from '../ecosystem/ecosystem-apps';
import { nearestNode, afterHeroPaint, type SceneInput } from './interaction';
import styles from './constellation.module.css';

export default function Constellation() {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const input = useRef<SceneInput>({ x: 0, y: 0, selected: 0, reduced: true });
  const [selected, setSelected] = useState<number | null>(0);
  const [depth, setDepth] = useState(false);
  const armed = useRef<number | null>(null);

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => {
      input.current.reduced = motion.matches;
      if (motion.matches) {
        input.current.x = input.current.y = 0;
        stage.current?.style.setProperty('--tilt-x', '0deg');
        stage.current?.style.setProperty('--tilt-y', '0deg');
      }
    };
    updateMotion();
    motion.addEventListener('change', updateMotion);
    let disposed = false;
    let destroy: (() => void) | undefined;
    const cancel = afterHeroPaint(() => {
      import('./scene').then(({ mountScene }) => {
        if (disposed || !canvas.current || !stage.current) return;
        try {
          destroy = mountScene(canvas.current, stage.current, input.current, () => setDepth(false));
          setDepth(true);
        } catch { setDepth(false); }
      }).catch(() => setDepth(false));
    });
    return () => { disposed = true; cancel(); destroy?.(); motion.removeEventListener('change', updateMotion); };
  }, []);

  function select(index: number | null) {
    if (armed.current !== index) armed.current = null;
    input.current.selected = index ?? -1;
    setSelected(index);
  }

  return (
    <section className={styles.hero} aria-labelledby="constellation-heading" data-constellation data-depth={depth}>
      <noscript><style>{`[data-constellation] [data-stage]{height:auto!important}[data-constellation] [data-products]{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;transform:none!important}[data-constellation] [data-product]{display:block!important;position:static!important;width:auto!important;transform:none!important}[data-constellation] [data-node],[data-constellation] [data-detail]{position:static!important;transform:none!important;width:auto!important}[data-constellation] [data-detail][hidden]{display:block!important}[data-constellation] [data-decoration]{display:none!important}`}</style></noscript>
      <header className={styles.heading}>
        <div><p className={styles.eyebrow}>Technology for people</p><h1 id="constellation-heading">Andiamo Tech</h1></div>
        <p className={styles.intro}>Intel. Learning. Community mobility.<br />Tools for the way you move through the world.</p>
      </header>
      <div ref={stage} className={styles.stage} data-stage data-selected={selected ?? ''}
        onPointerMove={(event) => {
          if (event.pointerType !== 'mouse' || !stage.current) return;
          const box = stage.current.getBoundingClientRect();
          const x = (event.clientX - box.left) / box.width * 2 - 1;
          const y = (event.clientY - box.top) / box.height * 2 - 1;
          if (!input.current.reduced) {
            input.current.x = x; input.current.y = y;
            stage.current.style.setProperty('--tilt-x', `${-y * 3}deg`);
            stage.current.style.setProperty('--tilt-y', `${x * 4}deg`);
          }
          // Focus owns selection until it leaves, so proximity cannot hide a focused CTA.
          if (stage.current.contains(document.activeElement)) return;
          const nodes = Array.from(stage.current.querySelectorAll<HTMLElement>('[data-node]')).map((el) => {
            const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
          });
          const next = nearestNode(event.clientX, event.clientY, nodes, 180);
          if (next !== null) select(next);
        }}
        onPointerLeave={() => {
          input.current.x = input.current.y = 0;
          stage.current?.style.setProperty('--tilt-x', '0deg');
          stage.current?.style.setProperty('--tilt-y', '0deg');
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && selected !== null) {
            stage.current?.querySelectorAll<HTMLAnchorElement>('[data-node]')[selected]?.focus();
            armed.current = null;
            select(null);
          }
        }}>
        <div ref={canvas} className={styles.canvas} aria-hidden="true" data-decoration />
        <div className={styles.axis} aria-hidden="true" data-decoration><span /><span /></div>
        <ul className={styles.products} aria-label="Products" data-products>
          {PRODUCTS.map((product, index) => {
            const open = selected === index;
            return (
              <li key={product.key} className={styles.product} data-product={product.key} data-open={open}
                style={{ '--accent': product.accent } as CSSProperties}>
                <a data-node href={product.url} className={styles.node}
                  aria-expanded={open} aria-controls={`product-detail-${product.key}`}
                  onFocus={() => select(index)}
                  onClick={(event) => {
                    if (armed.current !== index) {
                      event.preventDefault(); armed.current = index; select(index);
                    }
                  }}>
                  <span className={styles.number} aria-hidden="true">0{index + 1}</span>
                  <h2>{product.name}</h2>
                  <span className={styles.badge}>{lifecycleFor(product.key).label}</span>
                  {product.key === 'andiamo' && <span className={styles.nodeTagline}>{ecosystemApps.find(app => app.key === product.key)?.tagline}</span>}
                  <span className={styles.nodeArrow} aria-hidden="true">↗</span>
                </a>
                <div id={`product-detail-${product.key}`} className={styles.detail} hidden={!open} data-detail>
                  <p className={styles.tagline}>{product.tagline}</p>
                  <p className={styles.description}>{product.valueProp}</p>
                  <p className={styles.audience}>{product.audience}</p>
                  <div className={styles.actions}>
                    <a className={styles.cta} href={product.url} onFocus={() => select(index)}>Explore {product.name}<span aria-hidden="true">↗</span></a>
                    {product.key === 'andiamo' && <a className={styles.story} href="/products/rides">The Rides story</a>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <p className={styles.signature} aria-hidden="true" data-decoration>ANDIAMO / CONNECTED BY PURPOSE</p>
      </div>
      <a className={styles.next} href="#products">Explore the products <span aria-hidden="true">↓</span></a>
    </section>
  );
}
