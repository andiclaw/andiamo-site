import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';
import { PRODUCT_MOCKUP } from '@/lib/product-mockups';
import { STATUS_LABEL, STATUS_COLOR } from '@/lib/products';
import { Reveal } from './reveal';

/**
 * Home-page product showcase: one full-width row per product, alternating
 * sides, each owning its accent color. This is where the four-color brand
 * system does its work — each product is unmistakably itself.
 */
export function ProductShowcase() {
  return (
    <div className="space-y-20 sm:space-y-28">
      {PRODUCTS.map((p, i) => {
        const Mockup = PRODUCT_MOCKUP[p.key];
        const flip = i % 2 === 1;
        const statusColor = STATUS_COLOR[p.status];
        return (
          <Reveal key={p.key} as="article">
            <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
              {/* ambient accent glow */}
              <div
                className="absolute -z-10 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.12] pointer-events-none"
                style={{
                  background: p.accent,
                  top: '50%',
                  [flip ? 'right' : 'left']: '-10%',
                  transform: 'translateY(-50%)',
                }}
              />

              {/* copy */}
              <div className={flip ? 'lg:order-2' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.25em]"
                    style={{ color: p.accent }}
                  >
                    {p.name}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-pill text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: statusColor, background: `${statusColor}14`, border: `1px solid ${statusColor}33` }}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: statusColor, boxShadow: p.status === 'live' ? `0 0 8px ${statusColor}` : 'none' }}
                    />
                    {STATUS_LABEL[p.status]}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-4">
                  {p.tagline}
                </h3>
                <p className="text-base text-slate-400 leading-relaxed mb-5">{p.valueProp}</p>

                <ul className="space-y-2 text-sm text-slate-300 mb-7">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.accent }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={p.url}
                    className="focusable px-5 py-2.5 rounded-pill text-sm font-semibold text-white transition-all hover:scale-[1.03]"
                    style={{ background: `linear-gradient(92deg, ${p.accent}, ${p.accent}bb)` }}
                  >
                    Visit {p.name} →
                  </a>
                  <Link
                    href={`/report?product=${p.key}`}
                    className="focusable px-5 py-2.5 rounded-pill text-sm font-semibold border hairline-bold text-slate-300 hover:text-white transition-all"
                  >
                    Report an issue
                  </Link>
                  <span className="text-xs text-slate-500 ml-1">{p.licenseLine}</span>
                </div>
              </div>

              {/* mockup */}
              <div className={flip ? 'lg:order-1' : ''}>
                <div
                  className="rounded-2xl overflow-hidden border shadow-2xl"
                  style={{ borderColor: `${p.accent}33`, boxShadow: `0 30px 80px -40px ${p.accent}55` }}
                >
                  {Mockup && <Mockup />}
                </div>
                <div className="mt-3 text-center text-xs text-slate-500">{p.audience}</div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
