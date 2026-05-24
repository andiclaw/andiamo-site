import Link from 'next/link';

const NAV = [
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/patent', label: 'Patent' },
  { href: '/report', label: 'Report an issue' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b hairline bg-ink-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group" aria-label="Andiamo Tech home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-mark.svg" alt="" width={32} height={32} className="rounded-lg" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/wordmark.svg" alt="Andiamo Tech" width={150} height={28} className="h-7 w-auto" />
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 rounded-pill text-sm text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
