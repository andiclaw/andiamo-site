import Link from 'next/link';
import { COMPANY, PATENT } from '@/lib/company';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t hairline mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2 sm:col-span-1">
          <div className="font-semibold text-white mb-2">{COMPANY.shortName}</div>
          <div className="text-xs text-slate-400 leading-relaxed">
            {COMPANY.pbcLine}
          </div>
          <div className="text-xs text-slate-400 mt-3">
            Patent: <Link href="/patent" className="text-cyan-400 hover:text-cyan-300">{PATENT.number}</Link>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Products</div>
          <ul className="space-y-2 text-slate-400">
            <li><a href="https://velocity.andiamo.tech" className="hover:text-cyan-300">Velocity</a></li>
            <li><a href="https://academy.andiamo.tech" className="hover:text-cyan-300">Academy</a></li>
            <li><a href="https://app.andiamo.tech" className="hover:text-cyan-300">Andiamo</a></li>
            <li><a href="https://github.com/andiclaw/pathfinder" className="hover:text-cyan-300">Pathfinder</a></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Company</div>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/about" className="hover:text-cyan-300">About</Link></li>
            <li><Link href="/patent" className="hover:text-cyan-300">Patent</Link></li>
            <li><Link href="/press" className="hover:text-cyan-300">Press</Link></li>
            <li><Link href="/careers" className="hover:text-cyan-300">Careers</Link></li>
            <li><Link href="/report" className="hover:text-cyan-300">Report an issue</Link></li>
            <li><a href={`mailto:${COMPANY.helloEmail}`} className="hover:text-cyan-300">{COMPANY.helloEmail}</a></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Legal</div>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/privacy" className="hover:text-cyan-300">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-cyan-300">Terms</Link></li>
            <li><Link href="/cookies" className="hover:text-cyan-300">Cookies</Link></li>
            <li><Link href="/accessibility" className="hover:text-cyan-300">Accessibility</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t hairline">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div>© {year} {COMPANY.legalName}. All rights reserved.</div>
          <div>Built in {COMPANY.location}.</div>
        </div>
      </div>
    </footer>
  );
}
