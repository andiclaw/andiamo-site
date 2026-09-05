'use client';

import React, { useEffect, useRef, useState, type CSSProperties } from 'react';
import { COMPANY } from '../../lib/company';
import { lifecycleFor } from '../../lib/lifecycle';
import { HOME_PRODUCTS } from './home-products';
import { afterHeroPaint, type SceneInput } from './interaction';
import styles from './constellation.module.css';

export default function Constellation() {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const input = useRef<SceneInput>({ x: 0, y: 0, selected: 0, reduced: true });
  const [selected, setSelected] = useState<number | null>(0);
  const [depth, setDepth] = useState(false);

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { input.current.reduced = motion.matches; };
    update(); motion.addEventListener('change', update);
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
    return () => { disposed = true; cancel(); destroy?.(); motion.removeEventListener('change', update); };
  }, []);

  function select(index: number | null) {
    input.current.selected = index ?? -1;
    setSelected(index);
  }

  return (
    <section className={styles.hero} aria-labelledby="constellation-heading" data-constellation data-depth={depth}>
      <noscript><style>{`[data-constellation] [data-stage]{height:auto!important}[data-constellation] [data-products]{display:grid!important;gap:32px}[data-constellation] [data-product]{display:block!important}[data-constellation] [data-node],[data-constellation] [data-detail]{position:static!important;transform:none!important;margin:auto;width:100%!important}[data-constellation] [data-node]{max-width:180px;height:250px!important;--world-size:180px!important}[data-constellation] [data-detail][hidden]{display:block!important}[data-constellation] [data-decoration]{display:none!important}`}</style></noscript>
      <header className={styles.heading}>
        <p className={styles.company}>{COMPANY.shortName}</p>
        <h1 id="constellation-heading">{COMPANY.motto}</h1>
      </header>
      <div ref={stage} className={styles.stage} data-stage data-selected={selected ?? ''}
        onPointerMove={event => {
          if (event.pointerType !== 'mouse' || !stage.current) return;
          const box = stage.current.getBoundingClientRect();
          input.current.x = (event.clientX - box.left) / box.width * 2 - 1;
          input.current.y = (event.clientY - box.top) / box.height * 2 - 1;
        }}
        onPointerLeave={() => { input.current.x = input.current.y = 0; }}
        onKeyDown={event => {
          if (event.key === 'Escape' && selected !== null) {
            stage.current?.querySelectorAll<HTMLButtonElement>('[data-node]')[selected]?.focus();
            select(null);
          }
        }}>
        <div ref={canvas} className={styles.canvas} aria-hidden="true" data-decoration />
        <ul className={styles.products} aria-label="Products" data-products>
          {HOME_PRODUCTS.map((product, index) => {
            const open = selected === index;
            return (
              <li key={product.key} className={styles.product} data-product={product.key} data-open={open}
                style={{ '--accent': product.accent, '--index': index } as CSSProperties}>
                <h2 className={styles.productHeading}>
                  <button type="button" data-node className={styles.node}
                    aria-expanded={open} aria-controls={`product-detail-${product.key}`}
                    onPointerEnter={event => {
                      // A focused preview/link owns disclosure until focus leaves it.
                      const focused = document.activeElement;
                      if (event.pointerType === 'mouse' && !focused?.closest('[data-detail]')) select(index);
                    }}
                    onFocus={() => select(index)} onClick={() => select(index)}>
                    <span className={styles.worldAnchor} data-world-anchor aria-hidden="true" />
                    <span className={styles.worldLabel} data-world-label>
                      <span className={styles.name}>{product.name}</span>
                      <span className={styles.badge}>{lifecycleFor(product.key).label}</span>
                      {product.nodeTagline && <span className={styles.nodeTagline}>{product.nodeTagline}</span>}
                    </span>
                  </button>
                </h2>
                <div id={`product-detail-${product.key}`} className={styles.detail} hidden={!open} data-detail>
                  <p className={styles.line} data-preview-line>{product.line}</p>
                  <figure className={styles.preview} data-interface-preview>
                    <img src={product.preview.asset} alt={product.previewAlt} width="800" height="320" />
                    <figcaption>{product.preview.label}</figcaption>
                  </figure>
                  <div className={styles.actions}>
                    <a className={styles.cta} href={product.url} onFocus={() => select(index)}>
                      {product.key === 'andiamo' ? 'Explore the closed beta' : `Explore ${product.name}`} <span aria-hidden="true">↗</span>
                    </a>
                    {product.key === 'andiamo' && <a className={styles.story} href="/products/rides">The Rides story</a>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <a className={styles.next} href="#products">Why we built each tool <span aria-hidden="true">↓</span></a>
    </section>
  );
}
