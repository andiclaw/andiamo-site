import type { ReactNode } from 'react';
import type { Product } from './products';

/**
 * Mini inline SVG mockup per product. Rendered at ~360x200 inside the
 * product card. Pure SVG — no images, no JS — so it survives static
 * export, OG-image rendering, and offline cases. Styled with each
 * product's accent color.
 */
export const PRODUCT_MOCKUP: Record<Product['key'], () => ReactNode> = {
  velocity: () => (
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Velocity feed mockup">
      <rect width="360" height="200" rx="12" fill="#0a121f" />
      <rect x="0" y="0" width="360" height="24" fill="#000" opacity="0.4" />
      <circle cx="14" cy="12" r="3" fill="#34d399">
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="24" y="16" fontFamily="ui-monospace, monospace" fontSize="9" fill="#22D3EE" letterSpacing="2">LIVE · GLOBAL PULSE</text>
      <text x="338" y="16" fontFamily="ui-monospace, monospace" fontSize="8" fill="#475569" textAnchor="end">FREE · 30m</text>
      {[
        { rank: '01', title: 'Major exchange announces zero-fee tier', arrow: '▲▲', score: 87, color: '#6ee7b7' },
        { rank: '02', title: 'CISA flags critical router-firmware vuln', arrow: '▲▲', score: 81, color: '#6ee7b7' },
        { rank: '03', title: 'OpenAI ships GPT-6 reasoning preview', arrow: '▲', score: 74, color: '#34d399' },
        { rank: '04', title: 'NWS severe weather watch — west coast', arrow: '▲', score: 62, color: '#34d399' },
        { rank: '05', title: 'BTC reclaims $120K after 36-hour rally', arrow: '→', score: 58, color: '#94a3b8' },
      ].map((row, i) => (
        <g key={row.rank} transform={`translate(0, ${36 + i * 28})`}>
          <text x="14" y="14" fontFamily="ui-monospace, monospace" fontSize="9" fill="#475569">{row.rank}</text>
          <text x="38" y="14" fontFamily="ui-monospace, monospace" fontSize="10" fill="#cbd5e1">{row.title}</text>
          <text x="298" y="14" fontFamily="ui-monospace, monospace" fontSize="10" fill={row.color}>{row.arrow}</text>
          <text x="346" y="14" fontFamily="ui-monospace, monospace" fontSize="10" fill="#a5f3fc" textAnchor="end">{row.score}</text>
        </g>
      ))}
    </svg>
  ),

  academy: () => (
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Academy lesson tracker mockup">
      <rect width="360" height="200" rx="12" fill="#1a1f3a" />
      <text x="16" y="22" fontFamily="ui-sans-serif, system-ui" fontSize="10" fill="#a78bfa" letterSpacing="2">MARIA · GRADE 2 · WEEK 18</text>
      <text x="344" y="22" fontFamily="ui-sans-serif, system-ui" fontSize="9" fill="#64748b" textAnchor="end">WA · compliant</text>
      {[
        { day: 'Mon', subj: 'Reading · The Lighthouse', done: true },
        { day: 'Tue', subj: 'Math · Multiplication 6×', done: true },
        { day: 'Wed', subj: 'Science · Watershed walk', done: true },
        { day: 'Thu', subj: 'Writing · Letter to grandma', done: false },
        { day: 'Fri', subj: 'Music · Songbook p.12', done: false },
      ].map((row, i) => (
        <g key={row.day} transform={`translate(0, ${42 + i * 26})`}>
          <rect x="16" y="0" width="328" height="20" rx="6" fill="#0f172a" opacity="0.5" />
          <circle cx="28" cy="10" r="5" fill={row.done ? '#a78bfa' : 'transparent'} stroke="#a78bfa" strokeWidth="1.2" />
          {row.done && <path d="M25 10 L27 12 L31 8" stroke="#0f172a" strokeWidth="1.5" fill="none" />}
          <text x="42" y="13" fontFamily="ui-sans-serif, system-ui" fontSize="9" fill="#94a3b8">{row.day}</text>
          <text x="78" y="13" fontFamily="ui-sans-serif, system-ui" fontSize="10" fill={row.done ? '#cbd5e1' : '#94a3b8'}>{row.subj}</text>
        </g>
      ))}
      <rect x="16" y="180" width="328" height="6" rx="3" fill="#0f172a" />
      <rect x="16" y="180" width="197" height="6" rx="3" fill="#8b5cf6" />
    </svg>
  ),

  andiamo: () => (
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Andiamo bid card mockup">
      <rect width="360" height="200" rx="12" fill="#0a1f12" />
      <g opacity="0.3" stroke="#14532d" strokeWidth="0.6" fill="none">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <line key={`v${i}`} x1={i * 45} y1="0" x2={i * 45} y2="200" />)}
        {[1, 2, 3].map((i) => <line key={`h${i}`} x1="0" y1={i * 50} x2="360" y2={i * 50} />)}
      </g>
      <path d="M 40 145 Q 120 80 200 100 T 320 60" stroke="#22c55e" strokeWidth="2" fill="none" strokeDasharray="3 3" />
      <circle cx="40" cy="145" r="6" fill="#22c55e" />
      <circle cx="320" cy="60" r="6" fill="#34d399" />
      <text x="14" y="20" fontFamily="ui-sans-serif, system-ui" fontSize="9" fill="#34d399" letterSpacing="2">ZONE · SKAGIT VALLEY</text>
      <rect x="20" y="120" width="320" height="64" rx="10" fill="#052e16" stroke="#14532d" />
      <text x="32" y="138" fontFamily="ui-sans-serif, system-ui" fontSize="10" fill="#94a3b8">Bid · Honda Insight · 4.9★</text>
      <text x="32" y="158" fontFamily="ui-sans-serif, system-ui" fontSize="14" fill="#22c55e" fontWeight="700">$11.40</text>
      <text x="78" y="158" fontFamily="ui-sans-serif, system-ui" fontSize="9" fill="#64748b">· 8 min ETA · 3.2 mi</text>
      <text x="32" y="174" fontFamily="ui-monospace, monospace" fontSize="7" fill="#475569">90% driver · 6% city · 2% helper · 2% maint</text>
      <rect x="260" y="142" width="68" height="24" rx="12" fill="#22c55e" />
      <text x="294" y="158" fontFamily="ui-sans-serif, system-ui" fontSize="10" fill="#052e16" textAnchor="middle" fontWeight="700">Accept</text>
    </svg>
  ),

  pathfinder: () => (
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pathfinder dual-pane mockup">
      <rect width="360" height="200" rx="12" fill="#0f1419" />
      <rect x="0" y="0" width="50" height="200" fill="#0a0e13" />
      {[34, 60, 86, 112, 138].map((y, i) => (
        <g key={i}>
          <circle cx="14" cy={y} r="3" fill={i === 0 ? '#f59e0b' : '#475569'} />
          <rect x="22" y={y - 3} width="20" height="2" rx="1" fill={i === 0 ? '#f59e0b' : '#334155'} />
        </g>
      ))}
      <rect x="58" y="10" width="143" height="14" rx="3" fill="#1e2530" />
      <text x="64" y="20" fontFamily="ui-monospace, monospace" fontSize="8" fill="#94a3b8">~/Velocity/src</text>
      {[
        { name: 'components', dir: true, highlight: false },
        { name: 'lib', dir: true, highlight: false },
        { name: 'app', dir: true, highlight: true },
        { name: 'types.ts', dir: false, highlight: false },
        { name: 'middleware.ts', dir: false, highlight: false },
      ].map((f, i) => (
        <g key={f.name} transform={`translate(58, ${34 + i * 20})`}>
          <rect width="143" height="16" rx="3" fill={f.highlight ? '#f59e0b' : 'transparent'} opacity={f.highlight ? 0.15 : 1} />
          <text x="8" y="11" fontFamily="ui-monospace, monospace" fontSize="9" fill={f.dir ? '#f59e0b' : '#94a3b8'}>{f.dir ? '▸' : ' '}</text>
          <text x="18" y="11" fontFamily="ui-monospace, monospace" fontSize="9" fill={f.highlight ? '#fbbf24' : '#cbd5e1'}>{f.name}</text>
        </g>
      ))}
      <rect x="209" y="10" width="143" height="14" rx="3" fill="#1e2530" />
      <text x="215" y="20" fontFamily="ui-monospace, monospace" fontSize="8" fill="#94a3b8">~/Velocity/src/app</text>
      {[
        { name: 'page.tsx', git: 'M', isDir: false },
        { name: 'layout.tsx', git: '', isDir: false },
        { name: 'globals.css', git: '', isDir: false },
        { name: 'feeds', git: '', isDir: true },
        { name: 'trends', git: 'M', isDir: true },
      ].map((f, i) => (
        <g key={f.name} transform={`translate(209, ${34 + i * 20})`}>
          <text x="8" y="11" fontFamily="ui-monospace, monospace" fontSize="9" fill="#94a3b8">{f.isDir ? '▸' : ' '}</text>
          <text x="18" y="11" fontFamily="ui-monospace, monospace" fontSize="9" fill="#cbd5e1">{f.name}</text>
          {f.git === 'M' && <text x="132" y="11" fontFamily="ui-monospace, monospace" fontSize="8" fill="#fbbf24" textAnchor="end">M</text>}
        </g>
      ))}
      <rect x="0" y="180" width="360" height="20" fill="#0a0e13" />
      <text x="58" y="193" fontFamily="ui-monospace, monospace" fontSize="8" fill="#64748b">5 items · 2 modified · branch: dev</text>
    </svg>
  ),
};
