'use client';

import type { RunwayCalc } from '@/lib/runway';
// Ported from the Rides repo alongside src/lib/runway.ts (#163). Type-only import,
// so it carries no app dependency with it.

interface Props {
  calc: RunwayCalc;
}

function fmt(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

type Scenario = 'liftoff' | 'funding' | 'unreachable';

function getScenario(c: RunwayCalc): Scenario {
  if (c.unreachable) return 'unreachable';
  if (c.opMonth !== null && c.fundingGap <= 0) return 'liftoff';
  return 'funding';
}

// Map a month to x-position on the runway (60 = start, 700 = end)
function monthToX(month: number, maxMonth: number): number {
  const start = 80;
  const end = 680;
  return start + (month / maxMonth) * (end - start);
}

export default function RunwayIllustration({ calc }: Props) {
  const scenario = getScenario(calc);
  const maxMonth = scenario === 'unreachable'
    ? Math.max(calc.cashoutMonth ?? 24, 24)
    : Math.max(calc.opMonth ?? 24, 24);

  // Key positions
  const cashoutX = calc.cashoutMonth ? monthToX(calc.cashoutMonth, maxMonth) : null;
  const beX = calc.opMonth ? monthToX(calc.opMonth, maxMonth) : null;
  const staticEnd = calc.staticRunway ? monthToX(Math.min(calc.staticRunway, maxMonth), maxMonth) : null;

  // Plane position & angle
  let planeX: number;
  let planeY: number;
  let planeRotate: number;

  if (scenario === 'liftoff' && beX) {
    planeX = beX + 20;
    planeY = 115;
    planeRotate = -25;
  } else if (scenario === 'funding' && beX) {
    planeX = cashoutX ? Math.min(cashoutX, beX - 40) : beX - 60;
    planeY = 168;
    planeRotate = 0;
  } else {
    planeX = cashoutX ? Math.min(cashoutX + 10, 500) : 300;
    planeY = 175;
    planeRotate = 5;
  }

  // Month tick marks
  const ticks: number[] = [];
  const tickInterval = maxMonth <= 12 ? 3 : maxMonth <= 24 ? 6 : 12;
  for (let m = 0; m <= maxMonth; m += tickInterval) ticks.push(m);
  if (!ticks.includes(maxMonth)) ticks.push(maxMonth);

  // Sky colors by scenario
  const skyGradient = {
    liftoff: { top: '#064e3b', mid: '#065f46', bot: '#0f766e' },
    funding: { top: '#1e3a5f', mid: '#1e40af', bot: '#3b82f6' },
    unreachable: { top: '#450a0a', mid: '#7f1d1d', bot: '#991b1b' },
  }[scenario];

  return (
    <div className="card p-0 overflow-hidden animate-scale-in">
      <svg
        viewBox="0 0 760 320"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label={`Runway illustration: ${scenario === 'liftoff' ? 'Liftoff achieved' : scenario === 'funding' ? 'Funding needed' : 'Runway too short'}`}
      >
        <defs>
          {/* Sky gradient */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skyGradient.top} />
            <stop offset="60%" stopColor={skyGradient.mid} />
            <stop offset="100%" stopColor={skyGradient.bot} />
          </linearGradient>

          {/* Runway surface gradient */}
          <linearGradient id="rwGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>

          {/* Contrail fade */}
          <linearGradient id="contrailFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="0.6" />
          </linearGradient>

          {/* Glow for liftoff */}
          <radialGradient id="liftoffGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#12c04c" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#12c04c" stopOpacity="0" />
          </radialGradient>

          {/* Warning stripes */}
          <pattern id="cautionStripes" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="5" height="10" fill="#f59e0b" />
            <rect x="5" width="5" height="10" fill="#111827" />
          </pattern>

          {/* Blueprint grid */}
          <pattern id="bpGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.3" strokeOpacity="0.08" />
          </pattern>

          {/* Star twinkle */}
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Sky ── */}
        <rect width="760" height="320" fill="url(#skyGrad)" />
        <rect width="760" height="320" fill="url(#bpGrid)" />

        {/* Stars (small dots in the sky) */}
        {[
          [120, 30], [250, 18], [400, 42], [550, 25], [650, 50], [80, 55],
          [320, 60], [500, 15], [180, 48], [600, 38], [710, 28], [45, 22],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={0.8 + (i % 3) * 0.4} fill="white" opacity={0.3 + (i % 4) * 0.15}>
            <animate attributeName="opacity" values={`${0.2 + (i % 3) * 0.1};${0.5 + (i % 2) * 0.3};${0.2 + (i % 3) * 0.1}`} dur={`${2 + i % 3}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* ── Horizon line ── */}
        <line x1="0" y1="155" x2="760" y2="155" stroke="white" strokeOpacity="0.1" strokeWidth="1" />

        {/* ── Runway ── */}
        {/* Runway perspective trapezoid */}
        <polygon
          points="40,250 720,250 680,180 80,180"
          fill="url(#rwGrad)"
          stroke="#4b5563"
          strokeWidth="1"
        />

        {/* Runway edge lights */}
        {ticks.map((m) => {
          const x = monthToX(m, maxMonth);
          const topY = 180;
          const botY = 250;
          // Perspective narrowing
          const ratio = (x - 80) / 600;
          const edgeOffset = 40 - ratio * 40;
          return (
            <g key={`tick-${m}`}>
              <circle cx={x - edgeOffset * 0.6} cy={topY + (botY - topY) * 0.1} r="2" fill="#9ca3af" opacity="0.6" />
              <circle cx={x + edgeOffset * 0.6} cy={botY - (botY - topY) * 0.1} r="2" fill="#9ca3af" opacity="0.6" />
              <text x={x} y={265} textAnchor="middle" fontSize="9" fill="#9ca3af" fontFamily="system-ui">
                {m}mo
              </text>
            </g>
          );
        })}

        {/* Center runway dashes */}
        {Array.from({ length: 20 }).map((_, i) => {
          const x1 = 90 + i * 30;
          const x2 = x1 + 16;
          if (x2 > 680) return null;
          return (
            <line key={`dash-${i}`} x1={x1} y1="215" x2={x2} y2="215"
              stroke="#d1d5db" strokeWidth="2" strokeOpacity="0.5" />
          );
        })}

        {/* ── Static runway marker (solid green section) ── */}
        {staticEnd && staticEnd > 80 && (
          <rect x="80" y="246" width={Math.min(staticEnd - 80, 600)} height="4" rx="1"
            fill="#12c04c" opacity="0.5" />
        )}

        {/* ── Scenario-specific elements ── */}

        {/* Cash-out marker */}
        {cashoutX && (
          <g>
            <line x1={cashoutX} y1="175" x2={cashoutX} y2="255" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,3" />
            <rect x={cashoutX - 28} y="160" width="56" height="18" rx="4" fill="#f59e0b" />
            <text x={cashoutX} y="173" textAnchor="middle" fontSize="8" fill="#111827" fontWeight="bold" fontFamily="system-ui">
              CASH OUT
            </text>
          </g>
        )}

        {/* Breakeven marker */}
        {beX && scenario !== 'unreachable' && (
          <g>
            <line x1={beX} y1="155" x2={beX} y2="255" stroke="#12c04c" strokeWidth="2" />
            <rect x={beX - 28} y={scenario === 'liftoff' ? 140 : 145} width="56" height="18" rx="4" fill="#12c04c" />
            <text x={beX} y={scenario === 'liftoff' ? 153 : 158} textAnchor="middle" fontSize="8" fill="white" fontWeight="bold" fontFamily="system-ui">
              LIFTOFF
            </text>
          </g>
        )}

        {/* FUNDING BRIDGE (scenario: funding) */}
        {scenario === 'funding' && cashoutX && beX && (
          <g>
            {/* Bridge zone */}
            <rect x={cashoutX} y="200" width={beX - cashoutX} height="30" rx="3"
              fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,2" />
            <text x={(cashoutX + beX) / 2} y="219" textAnchor="middle" fontSize="8" fill="#f59e0b" fontWeight="bold" fontFamily="system-ui">
              GAP: {fmt(calc.fundingGap)}
            </text>
          </g>
        )}

        {/* CAUTION END (scenario: unreachable) */}
        {scenario === 'unreachable' && (
          <g>
            {/* Broken runway end */}
            <rect x="640" y="178" width="40" height="74" fill="url(#cautionStripes)" opacity="0.6" />
            {/* Crack lines */}
            <path d="M650,180 L660,195 L645,210 L658,225 L648,245 L655,250"
              fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <path d="M670,180 L675,200 L665,215 L678,235 L672,250"
              fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            {/* Warning label */}
            <rect x="590" y="140" width="120" height="24" rx="5" fill="#dc2626" />
            <text x="650" y="156" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold" fontFamily="system-ui">
              RUNWAY TOO SHORT
            </text>
            {/* Storm clouds */}
            <ellipse cx="680" cy="90" rx="50" ry="25" fill="#374151" opacity="0.6" />
            <ellipse cx="650" cy="80" rx="35" ry="20" fill="#4b5563" opacity="0.5" />
            <ellipse cx="710" cy="85" rx="30" ry="18" fill="#374151" opacity="0.4" />
            {/* Lightning bolt */}
            <path d="M675,105 L670,120 L678,118 L672,135" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
              <animate attributeName="opacity" values="0;1;0;0;1;0" dur="3s" repeatCount="indefinite" />
            </path>
          </g>
        )}

        {/* LIFTOFF GLOW (scenario: liftoff) */}
        {scenario === 'liftoff' && beX && (
          <g>
            <circle cx={beX} cy="180" r="50" fill="url(#liftoffGlow)">
              <animate attributeName="r" values="45;55;45" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* ── The Plane ── */}
        <g transform={`translate(${planeX}, ${planeY}) rotate(${planeRotate})`}>
          {/* Contrails (liftoff only) */}
          {scenario === 'liftoff' && (
            <g>
              <line x1="-15" y1="8" x2="-80" y2="30" stroke="white" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />
              <line x1="-15" y1="12" x2="-90" y2="38" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" strokeLinecap="round" />
            </g>
          )}

          {/* Exhaust glow */}
          <ellipse cx="-18" cy="10" rx="8" ry="4"
            fill={scenario === 'liftoff' ? '#12c04c' : scenario === 'funding' ? '#3b82f6' : '#ef4444'}
            opacity="0.4">
            <animate attributeName="rx" values="6;10;6" dur="0.8s" repeatCount="indefinite" />
          </ellipse>

          {/* Fuselage */}
          <path d="M-15,5 Q-10,-2 25,-3 L45,0 Q50,5 50,10 Q50,15 45,18 L25,20 Q-10,22 -15,15 Z"
            fill={scenario === 'unreachable' ? '#6b7280' : '#e5e7eb'}
            stroke={scenario === 'unreachable' ? '#4b5563' : '#9ca3af'}
            strokeWidth="1"
          />

          {/* Wings */}
          <path d="M10,0 L5,-15 Q15,-18 30,-12 L25,-2 Z"
            fill={scenario === 'unreachable' ? '#4b5563' : '#d1d5db'}
            stroke={scenario === 'unreachable' ? '#374151' : '#9ca3af'}
            strokeWidth="0.5"
          />
          <path d="M10,18 L5,32 Q15,35 30,30 L25,20 Z"
            fill={scenario === 'unreachable' ? '#4b5563' : '#d1d5db'}
            stroke={scenario === 'unreachable' ? '#374151' : '#9ca3af'}
            strokeWidth="0.5"
          />

          {/* Tail */}
          <path d="M-12,5 L-20,-5 Q-15,-8 -8,-4 Z"
            fill={scenario === 'unreachable' ? '#4b5563' : '#d1d5db'}
            stroke={scenario === 'unreachable' ? '#374151' : '#9ca3af'}
            strokeWidth="0.5"
          />

          {/* Windows */}
          <circle cx="30" cy="8" r="2" fill="#60a5fa" opacity="0.8" />
          <circle cx="22" cy="8" r="2" fill="#60a5fa" opacity="0.7" />
          <circle cx="14" cy="9" r="2" fill="#60a5fa" opacity="0.6" />

          {/* Engine glow */}
          <ellipse cx="-16" cy="10" rx="3" ry="3"
            fill={scenario === 'liftoff' ? '#22c55e' : scenario === 'funding' ? '#60a5fa' : '#f87171'}
            opacity="0.8">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="0.6s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* ── Company name on plane ── */}
        <text
          x={planeX + 20}
          y={planeY - (scenario === 'liftoff' ? 20 : 15)}
          textAnchor="middle"
          fontSize="10"
          fill="white"
          fontWeight="bold"
          fontFamily="system-ui"
          opacity="0.9"
        >
          {calc.companyName}
        </text>

        {/* ── Metric callouts ── */}
        {/* Top-left: Capital */}
        <g>
          <rect x="15" y="85" width="100" height="36" rx="6" fill="black" fillOpacity="0.35" />
          <text x="25" y="101" fontSize="8" fill="#9ca3af" fontFamily="system-ui">CAPITAL</text>
          <text x="25" y="115" fontSize="12" fill="white" fontWeight="bold" fontFamily="system-ui">{fmt(calc.totalCash)}</text>
        </g>

        {/* Top-right: Monthly Burn */}
        <g>
          <rect x="645" y="85" width="100" height="36" rx="6" fill="black" fillOpacity="0.35" />
          <text x="655" y="101" fontSize="8" fill="#9ca3af" fontFamily="system-ui">BURN / MO</text>
          <text x="655" y="115" fontSize="12" fill="white" fontWeight="bold" fontFamily="system-ui">{fmt(calc.burnInclDebt)}</text>
        </g>

        {/* Bottom: Scenario headline */}
        <g>
          <rect x="200" y="280" width="360" height="30" rx="8"
            fill={scenario === 'liftoff' ? '#12c04c' : scenario === 'funding' ? '#1e40af' : '#991b1b'}
            fillOpacity="0.9"
          />
          <text x="380" y="300" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold" fontFamily="system-ui">
            {scenario === 'liftoff' && `✅ Liftoff in ${calc.opMonth} months — no funding needed`}
            {scenario === 'funding' && `⚠️ Needs ${fmt(calc.fundingGap)} to reach liftoff in ${calc.opMonth} months`}
            {scenario === 'unreachable' && `❌ Cannot reach liftoff — pivot strategy required`}
          </text>
        </g>

        {/* ── Runway label ── */}
        <text x="380" y="278" textAnchor="middle" fontSize="7" fill="#6b7280" fontFamily="system-ui" letterSpacing="2">
          RUNWAY TO FLIGHT
        </text>
      </svg>
    </div>
  );
}
