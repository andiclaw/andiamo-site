import Link from 'next/link';
import { COMPANY, BRAND } from '@/lib/company';
import { HomeExperience } from '@/components/home-triangle/home-experience';
import { CAPTURE_SLOTS } from '@/components/home-triangle/model';
import styles from '@/components/home-triangle/home-triangle.module.css';

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
        <h2 id="views-heading">A closer look, once verified.</h2>
        <p>Product UI captures will appear here after source, fixture and privacy review. These placeholders are not screenshots.</p>
        <div className={styles.captureGrid}>
          {CAPTURE_SLOTS.map(slot => (
            <article className={styles.captureCard} key={slot.key}>
              <strong>{slot.name}</strong>
              <div className={styles.capturePending} role="status">Verified UI capture pending</div>
              <p>NEEDS_EVIDENCE: no approved capture packet is attached.</p>
            </article>
          ))}
        </div>
      </section>
    </HomeExperience>
  );
}
