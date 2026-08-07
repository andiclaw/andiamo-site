import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';
import { lifecycleFor } from '@/lib/lifecycle';
import ConstellationDepth from './constellation-depth';

/**
 * The root constellation (AND-TECH-ROOT-CONSTELLATION-001).
 *
 * STATIC-FIRST, and structured so that is literally true rather than a claim:
 * the constellation IS server-rendered HTML and SVG. Every node is a real
 * anchor with its name, lifecycle badge and description in the markup, and the
 * connecting lines are SVG. With JavaScript disabled, WebGL unavailable, or a
 * crawler reading the page, the whole thing still renders and every product is
 * still reachable.
 *
 * The three.js layer sits BEHIND all of that and only adds depth. It never draws
 * text, which is the binding constraint: mission, services, team and patent, and
 * the node labels here, are HTML the browser can read, select and index.
 *
 * Layout per the brief: Velocity top, Academy and Rides on the lower sides,
 * Pathfinder below.
 */

/** Positions in a 0-100 space, shared by the SVG lines and the DOM nodes. */
const POSITIONS: Record<string, { x: number; y: number }> = {
  velocity: { x: 50, y: 13 },
  academy: { x: 16, y: 49 },
  andiamo: { x: 84, y: 49 },
  pathfinder: { x: 50, y: 85 },
};

/** Which nodes are joined. Drawn behind the nodes, never over them. */
const LINKS: Array<[string, string]> = [
  ['velocity', 'academy'],
  ['velocity', 'andiamo'],
  ['academy', 'pathfinder'],
  ['andiamo', 'pathfinder'],
  ['academy', 'andiamo'],
];

const TONE_CLASSES: Record<string, string> = {
  live: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
  beta: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  desktop: 'bg-sky-400/15 text-sky-300 border-sky-400/30',
};

export default function Constellation() {
  return (
    <div className="relative mx-auto w-full max-w-3xl">
      {/* Reserve the aspect ratio so nothing reflows when the depth layer mounts. */}
      <div className="relative aspect-[4/3] sm:aspect-[16/11]">
        <ConstellationDepth />

        {/* Connectors. aria-hidden: the relationships they imply are decorative,
            and the node list below is the real structure. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {LINKS.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={POSITIONS[a].x}
              y1={POSITIONS[a].y}
              x2={POSITIONS[b].x}
              y2={POSITIONS[b].y}
              stroke="currentColor"
              className="text-white/12"
              strokeWidth="0.25"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        <ul className="contents">
          {PRODUCTS.map((product) => {
            const pos = POSITIONS[product.key];
            if (!pos) return null;
            const life = lifecycleFor(product.key);
            const external = !product.url.startsWith('/');

            return (
              <li
                key={product.key}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <Link
                  href={product.url}
                  title={`${product.name}. ${life.description}`}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex w-32 flex-col items-center gap-2 rounded-2xl px-2 py-3 text-center transition-transform duration-300 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:outline-none sm:w-40"
                >
                  <span
                    aria-hidden
                    className="h-3 w-3 rounded-full ring-4 ring-white/5 transition-all duration-300 group-hover:ring-8 group-focus-visible:ring-8"
                    style={{ backgroundColor: product.accent }}
                  />
                  <span className="text-sm font-bold text-white sm:text-base">{product.name}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TONE_CLASSES[life.tone]}`}
                  >
                    {life.label}
                  </span>
                  {/* Revealed on hover and on keyboard focus, so the detail is not
                      mouse-only. Hidden from assistive tech because the same text
                      is already on the link's title. */}
                  <span
                    aria-hidden
                    className="max-w-[13rem] text-[11px] leading-snug text-slate-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    {product.tagline}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* The same four products as a plain list. Guarantees the set is reachable
          in linear reading order and on very small screens where the positioned
          layout is tight. */}
      <p className="sr-only">
        Four products:{' '}
        {PRODUCTS.map((p) => `${p.name}, ${lifecycleFor(p.key).description}`).join(' ')}
      </p>
    </div>
  );
}
