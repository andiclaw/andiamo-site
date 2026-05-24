import Link from 'next/link';
import type { Product } from '@/lib/products';
import { StatusBadge } from './status-badge';

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <div
      className="relative group rounded-2xl border hairline bg-white/[0.02] p-6 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all overflow-hidden"
    >
      <div
        className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ background: product.accent }}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-bold text-white">{product.name}</h3>
          <StatusBadge status={product.status} />
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">{product.tagline}</p>

        {!compact && (
          <>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{product.valueProp}</p>
            <ul className="space-y-1.5 text-xs text-slate-400 mb-5">
              {product.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-0.5" style={{ color: product.accent }}>›</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">License</div>
            <div className="text-xs text-slate-400 mb-4">{product.licenseLine}</div>
          </>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={product.url}
            className="px-4 py-2 rounded-pill text-xs font-semibold text-white transition-all hover:scale-[1.02]"
            style={{ background: `linear-gradient(90deg, ${product.accent}, ${product.accent}cc)` }}
          >
            Visit {product.name} →
          </a>
          <Link
            href={`/report?product=${product.key}`}
            className="px-4 py-2 rounded-pill text-xs font-semibold border hairline text-slate-300 hover:text-white hover:border-white/[0.15]"
          >
            Report an issue
          </Link>
        </div>
      </div>
    </div>
  );
}
