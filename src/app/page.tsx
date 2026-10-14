import Link from 'next/link';
import { COMPANY, BRAND } from '@/lib/company';
import { HomeExperience } from '@/components/home-triangle/home-experience';
import { APP_PAGES } from '@/lib/app-pages';
import { PRODUCTS } from '@/lib/products';
import styles from '@/components/home-triangle/home-triangle.module.css';

// SITE-HOME-FEEDBACK-1008-002 item 6: the same captures the app pages show (src/lib/app-pages.ts, each with its source).
const CAPTURED = '8 October 2026';

export default function HomePage() {
  return (
    <HomeExperience>
      <section className={`${styles.section} ${styles.split}`} aria-labelledby="pbc-heading">
        <div>
          <p className={styles.sectionLabel}>Why we are a PBC</p>
          <h2 id="pbc-heading">{BRAND.pbcTitle}</h2>
          <p>{COMPANY.pbcLine}</p>
          <p>{BRAND.pbcBody}</p>
          <Link className={styles.sectionLink} href="/about">About our company <span aria-hidden="true">&nbsp;↗</span></Link>
        </div>
        <div>
          <p className={styles.sectionLabel}>What we do</p>
          <h2>{BRAND.missionTitle}</h2>
          <p>{BRAND.missionLead}</p>
        </div>
      </section>
      <section id="products" className={styles.section} aria-labelledby="views-heading">
        <p className={styles.sectionLabel}>Inside the products</p>
        <h2 id="views-heading">A closer look.</h2>
        <p>Each app as its own public page showed it on {CAPTURED}. Pathfinder is not yet released, so it has no capture.</p>
        <div className={styles.captureGrid}>
          {APP_PAGES.map(page => {
            const product = PRODUCTS.find(item => item.key === page.key)!;
            return (
              <article className={styles.captureCard} key={page.key}>
                <strong>{product.name}</strong>
                {page.screenshot ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={page.screenshot.src} alt={page.screenshot.alt} width={1440} height={900} loading="lazy" />
                ) : (
                  <div className={styles.capturePending}>{page.status}</div>
                )}
                <p>{page.summary} <Link href={`/products/${page.key}`}>More about {product.name}</Link></p>
              </article>
            );
          })}
        </div>
      </section>
    </HomeExperience>
  );
}
