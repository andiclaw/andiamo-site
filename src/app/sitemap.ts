import type { MetadataRoute } from 'next';
import { COMPANY } from '@/lib/company';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${COMPANY.domain}`;
  const now = new Date();
  const routes = ['', '/products', '/about', '/patent', '/press', '/careers', '/report', '/privacy', '/terms', '/cookies', '/accessibility'];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '' || path === '/products' ? 'weekly' : 'monthly',
    priority: path === '' ? 1.0 : 0.7,
  }));
}
