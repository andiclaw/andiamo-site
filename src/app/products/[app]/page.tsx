// /products/<app>: SITE-HOME-FEEDBACK-1008-001 Part B. One page per app: what each app's own live page says, a real
// capture of that page, and its own colour (the product registry accent, i.e. the app's theme token). Sources for every
// line live in src/lib/app-pages.ts.

import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { APP_PAGES } from '@/lib/app-pages';
import { PRODUCTS } from '@/lib/products';

export function generateStaticParams() {
  return APP_PAGES.map((page) => ({ app: page.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ app: string }> }) {
  const { app } = await params;
  const product = PRODUCTS.find((p) => p.key === app);
  return { title: product ? `${product.name}, Andiamo Tech` : 'Andiamo Tech' };
}

export default async function AppPage({ params }: { params: Promise<{ app: string }> }) {
  const { app } = await params;
  const page = APP_PAGES.find((p) => p.key === app);
  const product = PRODUCTS.find((p) => p.key === app);
  if (!page || !product) notFound();

  return (
    <main className="max-w-5xl mx-auto px-6 py-14" style={{ '--app': product.accent } as CSSProperties}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: product.accent }}>Andiamo Tech</p>
      <h1 className="mt-2 text-4xl font-bold text-white">{product.name}</h1>
      <p className="mt-3 text-lg text-slate-200">{page.summary}</p>
      <p className="mt-2 text-sm text-slate-400">{page.status}</p>

      {page.screenshot && (
        <figure className="mt-8 overflow-hidden rounded-2xl border" style={{ borderColor: product.accent }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={page.screenshot.src} alt={page.screenshot.alt} width={1440} height={900} className="h-auto w-full" />
          <figcaption className="px-4 py-3 text-xs text-slate-400">A capture of the live page: {page.screenshot.source}.</figcaption>
        </figure>
      )}

      <h2 className="mt-10 text-2xl font-semibold text-white">What it does</h2>
      <ul className="mt-4 space-y-3">
        {page.features.map((feature) => (
          <li key={feature.text} className="flex gap-3 text-slate-200">
            <span aria-hidden="true" className="mt-2 h-2 w-2 flex-shrink-0 rounded-full" style={{ background: product.accent }} />
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>

      {product.url.startsWith('https://') && (
        <a href={product.url} className="focusable mt-10 inline-flex min-h-[44px] items-center rounded-full px-5 py-2.5 font-semibold text-slate-950" style={{ background: product.accent }}>
          Open {product.name} <span aria-hidden="true" className="ml-1">↗</span>
        </a>
      )}
    </main>
  );
}
