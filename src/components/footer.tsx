import Link from 'next/link';
import { COMPANY, PATENT } from '@/lib/company';
import { SpectrumDots } from './spectrum-mark';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t hairline mt-12">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2.5 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-mark.svg" alt="" width={26} height={26} className="rounded-md" />
            <span className="font-semibold text-white">{COMPANY.shortName}</span>
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">{COMPANY.pbcLine}</div>
          <div className="mt-4"><SpectrumDots size={6} gap={5} /></div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Products</div>
          <ul className="space-y-2 text-slate-400">
            <li><a href="https://velocity.andiamo.tech" className="focusable hover:text-cyan-300 transition-colors">Velocity</a></li>
            <li><a href="https://academy.andiamo.tech" className="focusable hover:text-violet-300 transition-colors">Academy</a></li>
            <li><a href="https://app.andiamo.tech" className="focusable hover:text-emerald-300 transition-colors">Andiamo</a></li>
            <li><a href="https://github.com/andiclaw/pathfinder" className="focusable hover:text-amber-300 transition-colors">Pathfinder</a></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Company</div>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/about" className="focusable hover:text-white transition-colors">About</Link></li>
            <li><Link href="/patent" className="focusable hover:text-white transition-colors">Patent</Link></li>
            <li><Link href="/press" className="focusable hover:text-white transition-colors">Press</Link></li>
            <li><Link href="/careers" className="focusable hover:text-white transition-colors">Careers</Link></li>
            <li><Link href="/report" className="focusable hover:text-white transition-colors">Report an issue</Link></li>
            <li><a href={`mailto:${COMPANY.helloEmail}`} className="focusable hover:text-white transition-colors">{COMPANY.helloEmail}</a></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Legal</div>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/privacy" className="focusable hover:text-white transition-colors">Privacy</Link></li>
            <li><Link href="/terms" className="focusable hover:text-white transition-colors">Terms</Link></li>
            <li><Link href="/cookies" className="focusable hover:text-white transition-colors">Cookies</Link></li>
            <li><Link href="/accessibility" className="focusable hover:text-white transition-colors">Accessibility</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t hairline">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div>© {year} {COMPANY.legalName}. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span>Patent</span>
            <Link href="/patent" className="focusable font-mono text-slate-300 hover:text-cyan-300 transition-colors">{PATENT.number}</Link>
            <span className="text-slate-600">·</span>
            <span>Built in {COMPANY.location}.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
