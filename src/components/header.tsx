import Link from 'next/link';

const NAV = [
  { href: '/#products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/patent', label: 'Patent' },
  { href: '/press', label: 'Press' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b hairline bg-[#04070e]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="focusable flex items-center gap-3 group flex-shrink-0" aria-label="Andiamo Tech home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-mark.svg" alt="" width={30} height={30} className="rounded-lg transition-transform group-hover:scale-105" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/wordmark.svg" alt="Andiamo Tech" width={142} height={26} className="h-6 w-auto" />
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="focusable hidden sm:inline-block px-3 py-1.5 rounded-pill text-sm text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/report"
            className="focusable ml-1 px-4 py-1.5 rounded-pill text-sm font-semibold btn-primary"
          >
            Report<span className="hidden sm:inline"> an issue</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
