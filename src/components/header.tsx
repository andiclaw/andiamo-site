import Link from 'next/link';
import AppSwitcherDark from '@/components/ecosystem/app-switcher-dark';

const NAV = [
  { href: '/#products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/patent', label: 'Patent' },
  { href: '/press', label: 'Press' },
  { href: '/report', label: 'Report an issue' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b hairline bg-[#04070e]/85 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Corporate chrome: the Andiamo Tech wordmark stays the company mark */}
        <Link href="/" className="focusable flex items-center gap-2.5 flex-shrink-0" aria-label="Andiamo Tech home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/wordmark.svg" alt="Andiamo Tech" width={150} height={32} className="h-7 w-auto" />
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focusable hidden sm:inline-block px-3 py-1.5 rounded-md text-sm text-slate-400 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {/* Mobile: only the report action remains as a text link */}
          <Link
            href="/report"
            className="focusable sm:hidden px-3 py-1.5 rounded-md text-sm text-slate-300 hover:text-white transition-colors"
          >
            Report
          </Link>
          {/* Ecosystem launcher: jump to Academy / Velocity / Andiamo */}
          <div className="ml-1">
            <AppSwitcherDark />
          </div>
        </nav>
      </div>
    </header>
  );
}
