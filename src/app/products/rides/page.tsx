import type { Metadata } from 'next';
import JourneyHero from '@/components/hero/journey-hero';

export const metadata: Metadata = {
  title: 'Rides: Community mobility | Andiamo Tech',
  description: 'Rides by Andiamo Tech. Community mobility - for anyone, anywhere. Closed beta.',
  alternates: { canonical: '/products/rides' },
};

export default function RidesPage() { return <JourneyHero />; }
