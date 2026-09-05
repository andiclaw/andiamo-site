import Link from 'next/link';
import type { CSSProperties } from 'react';
import { COMPANY } from '@/lib/company';
import { HOME_PRODUCTS } from '@/components/constellation/home-products';
import Constellation from '@/components/constellation/constellation';
import styles from '@/components/constellation/home.module.css';

export default function HomePage() {
  return (
    <div>
      <Constellation />
      <section id="products" aria-labelledby="why-heading" className={styles.why}>
        <h2 id="why-heading">Why we built each tool</h2>
        {HOME_PRODUCTS.map(product => (
          <article key={product.key} className={styles.reason} style={{ '--accent': product.textAccent } as CSSProperties}>
            <figure className={styles.art}>
              <img src={product.art} width="600" height="400" alt={product.artAlt} loading="lazy" />
              <figcaption>Concept illustration</figcaption>
            </figure>
            <div>
              <p className={styles.label}>{product.name}{product.key === 'andiamo' && <span className={styles.tagline}>{product.line}</span>}</p>
              <h3>{product.heading}</h3>
              <p className={styles.body}>{product.reason}</p>
              <Link href={product.key === 'andiamo' ? '/products/rides' : product.url}>
                {product.key === 'andiamo' ? 'The Rides story' : `Explore ${product.name}`} <span aria-hidden="true">&nbsp;↗</span>
              </Link>
            </div>
          </article>
        ))}
      </section>
      <section className={styles.company} aria-labelledby="company-heading">
        <div>
          <h2 id="company-heading">Andiamo Tech</h2>
          <p>{COMPANY.pbcLine}</p>
          <div className={styles.links}><Link href="/about">About the company</Link><Link href="/patent">Our mobility patent</Link></div>
        </div>
        <Link href="/report">Report an issue</Link>
      </section>
    </div>
  );
}
