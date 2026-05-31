import { ProductShowcase } from '@/components/product-showcase';
import { PageHeader } from '@/components/page-header';
import { Reveal } from '@/components/reveal';

export const metadata = { title: 'Products' };

const STATUS_LEGEND = [
  { label: 'Live', body: 'In production. Pays its own bills.', color: '#22C55E' },
  { label: 'Beta', body: 'Working software, edges still rough.', color: '#F59E0B' },
  { label: 'Building', body: 'In active development. No public ETA.', color: '#3B82F6' },
  { label: 'Coming soon', body: 'Scoped. Waiting on a green light.', color: '#94A3B8' },
];

export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <PageHeader
        eyebrow="Four products. One company."
        title={<>Everything here is real, <span className="spectrum-text">and shipping</span>.</>}
        lead="Each product lives at its own home and runs its own roadmap. Pick the one you came for — or all four. The “Report an issue” button on every card routes to the same intake."
      />

      <ProductShowcase />

      <Reveal>
        <div className="mt-20 grid sm:grid-cols-4 gap-4">
          {STATUS_LEGEND.map((s) => (
            <div key={s.label} className="rounded-xl border hairline bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                <span className="text-[10px] uppercase tracking-widest text-slate-300 font-semibold">{s.label}</span>
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">{s.body}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
