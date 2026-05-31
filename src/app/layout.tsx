import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { COMPANY } from '@/lib/company';

export const metadata: Metadata = {
  metadataBase: new URL(`https://${COMPANY.domain}`),
  title: {
    default: `${COMPANY.shortName} — A Delaware PBC building tools that respect their users`,
    template: `%s · ${COMPANY.shortName}`,
  },
  description:
    'Andiamo Tech, Inc. is a Delaware Public Benefit Corporation building four products: Velocity (trend intelligence), Academy (homeschool compliance), Andiamo (patent-backed mobility), and Pathfinder (open-source macOS file manager).',
  openGraph: {
    title: `${COMPANY.shortName}`,
    description:
      'A Delaware PBC building Velocity, Academy, Andiamo, and Pathfinder — tools that respect their users.',
    type: 'website',
    siteName: COMPANY.shortName,
    url: `https://${COMPANY.domain}`,
  },
  twitter: {
    card: 'summary_large_image',
    title: COMPANY.shortName,
    description: 'A Delaware PBC building four products that respect their users.',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: COMPANY.legalName,
  alternateName: COMPANY.shortName,
  url: `https://${COMPANY.domain}`,
  logo: `https://${COMPANY.domain}/brand/logo-mark.svg`,
  email: COMPANY.supportEmail,
  foundingDate: String(COMPANY.founded),
  description:
    'A Delaware Public Benefit Corporation building Velocity, Academy, Andiamo, and Pathfinder.',
  address: { '@type': 'PostalAddress', addressRegion: 'WA', addressCountry: 'US' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-ink-950 text-slate-200">
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
