import { ProductCard } from '@/components/product-card';
import { PRODUCTS } from '@/lib/products';

export const metadata = { title: 'Products' };

export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <header className="mb-12 max-w-2xl">
        <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-semibold">All products</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mt-2 mb-4">Four products, one company.</h1>
        <p className="text-base text-slate-400 leading-relaxed">
          Each lives at its own subdomain and runs its own roadmap. Pick the one you came for — or all four — and the “Report an issue” button on every card goes to the same intake.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.key} product={p} />
        ))}
      </div>

      <div className="mt-16 grid sm:grid-cols-4 gap-4 text-xs text-slate-500">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">Live</div>
          <div className="text-slate-400">In production. Pays its own bills.</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">Beta</div>
          <div className="text-slate-400">Working software, edges still rough.</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">Building</div>
          <div className="text-slate-400">In active development. No public ETA.</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">Coming soon</div>
          <div className="text-slate-400">Scoped. Waiting on a green light.</div>
        </div>
      </div>
    </div>
  );
}
