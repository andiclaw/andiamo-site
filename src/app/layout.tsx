import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { COMPANY } from '@/lib/company';

export const metadata: Metadata = {
  metadataBase: new URL(`https://${COMPANY.domain}`),
  title: {
    default: `${COMPANY.shortName}: Building software to better the world`,
    template: `%s · ${COMPANY.shortName}`,
  },
  description:
    'Andiamo Tech builds software that solves real, everyday problems for people, businesses, and communities. Four products: Velocity (intel for humans and agents), Academy (homeschool platform), Andiamo (community mobility), and Pathfinder (open-source macOS file manager).',
  openGraph: {
    title: `${COMPANY.shortName}: Building software to better the world`,
    description:
      'Four products that directly support people and solve problems businesses and communities face every day.',
    type: 'website',
    siteName: COMPANY.shortName,
    url: `https://${COMPANY.domain}`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${COMPANY.shortName}: Building software to better the world`,
    description: 'Four products that solve real, everyday problems for people and communities.',
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
  slogan: COMPANY.motto,
  description:
    'Andiamo Tech builds software that solves real, everyday problems: Velocity, Academy, Andiamo, and Pathfinder.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sedro-Woolley',
    addressRegion: 'WA',
    addressCountry: 'US',
  },
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
