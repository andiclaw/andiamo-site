import type { Metadata } from 'next';
import JourneyHero from '@/components/hero/journey-hero';
import { getProduct } from '@/lib/products';

const rides = getProduct('andiamo');

export const metadata: Metadata = {
  title: `${rides.name}: Community mobility | Andiamo Tech`,
  description: `${rides.name} by Andiamo Tech. ${rides.tagline} Closed beta.`,
  alternates: { canonical: '/products/rides' },
};

export default function RidesPage() { return <JourneyHero />; }
