import Link from 'next/link';
import { COMPANY } from '@/lib/company';

export const metadata = {
  title: 'Accessibility',
  description: `Accessibility statement for ${COMPANY.legalName}'s corporate website.`,
};

export default function AccessibilityPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-10 pb-6 border-b hairline">
        <span className="text-[10px] uppercase tracking-[0.3em] spectrum-text font-bold">Accessibility</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2 mb-2">
          Accessibility statement
        </h1>
        <p className="text-xs text-slate-500">Scope: this corporate website at andiamo.tech. Individual products have their own statements.</p>
      </header>

      <section className="space-y-6 text-slate-300 leading-relaxed">
        <p className="text-base">
          {COMPANY.legalName} is committed to making this website usable for as many people as possible, including people with disabilities, people using assistive technologies, and people on slower connections.
        </p>

        <div>
          <h2 className="text-lg font-bold text-white mb-3">Standard we target</h2>
          <p className="text-sm">
            We target <strong>Web Content Accessibility Guidelines (WCAG) 2.2, Level AA</strong>. We aim to meet that standard on every public page of this site. Where we know we fall short, we list it below.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white mb-3">What we do</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-cyan-400">✓</span><span>Semantic HTML for headings, landmarks, lists, and forms.</span></li>
            <li className="flex gap-2"><span className="text-cyan-400">✓</span><span>Visible focus indicators on all interactive elements.</span></li>
            <li className="flex gap-2"><span className="text-cyan-400">✓</span><span>Color contrast that meets WCAG AA for body text against the dark theme.</span></li>
            <li className="flex gap-2"><span className="text-cyan-400">✓</span><span>All form inputs have associated labels and error messaging.</span></li>
            <li className="flex gap-2"><span className="text-cyan-400">✓</span><span>Decorative images use <code className="text-cyan-300">alt=&quot;&quot;</code>; informative images have descriptive alt text.</span></li>
            <li className="flex gap-2"><span className="text-cyan-400">✓</span><span>Keyboard navigation works on every page; no mouse-only interactions.</span></li>
            <li className="flex gap-2"><span className="text-cyan-400">✓</span><span>Reduced-motion preferences are respected for any decorative animation.</span></li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white mb-3">What we&apos;re still working on</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-amber-400">○</span><span>Light-mode theme, the site is currently dark-only. A toggle is on the roadmap.</span></li>
            <li className="flex gap-2"><span className="text-amber-400">○</span><span>Skip-to-content link in the header.</span></li>
            <li className="flex gap-2"><span className="text-amber-400">○</span><span>Mobile navigation, header items currently render horizontally at all widths.</span></li>
            <li className="flex gap-2"><span className="text-amber-400">○</span><span>Formal third-party WCAG audit (planned for v1.0, post-cutover).</span></li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white mb-3">Compatibility</h2>
          <p className="text-sm">
            We test in current versions of Safari, Chrome, Firefox, and Edge. We test with VoiceOver on macOS and iOS. The site works without JavaScript for reading content; the <Link href="/report" className="text-cyan-300 hover:text-cyan-200">report</Link> form requires JavaScript to submit.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white mb-3">Tell us when we miss something</h2>
          <p className="text-sm">
            If you run into a barrier on this site, whether a missing alt text, a contrast issue, or something a screen reader can&apos;t parse, please tell us. We treat accessibility findings the same way we treat security findings: triaged within one business day, fixed, and acknowledged when fixed.
          </p>
          <p className="text-sm mt-3">
            File via the <Link href="/report" className="text-cyan-300 hover:text-cyan-200">report form</Link> (pick &quot;Something else&quot; and mention accessibility) or email <a href={`mailto:${COMPANY.supportEmail}?subject=Accessibility%20feedback`} className="text-cyan-300 hover:text-cyan-200">{COMPANY.supportEmail}</a> directly.
          </p>
        </div>

        <div className="pt-6 border-t hairline">
          <p className="text-xs text-slate-500">
            Statement version: 2026-05-24. We revise this page whenever the underlying claims change.
          </p>
        </div>
      </section>
    </article>
  );
}
