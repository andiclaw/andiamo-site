/**
 * The journey, as server-rendered SVG (AND-SITE-HERO-JOURNEY-BETA-001).
 *
 * ONE CONTINUOUS TRIP, corner to corner: a bus, then a car, then VTOL aircraft,
 * ending with a family stepping out of a driverless pod at a house. The chaining
 * IS the product thesis, so the hero argues the thesis rather than decorating
 * around it, and the single unbroken route line is the whole point: it is one
 * trip, not four vehicles.
 *
 * STATIC-FIRST AND BINDING: this is SSR HTML/SVG. It renders with no JavaScript,
 * no WebGL and no canvas. The three.js layer only animates traffic ALONG this
 * same path and draws no text of any kind.
 *
 * NO REAL COMPANY BRANDING. The driverless pod is a generic geometric silhouette.
 * Zoox and Waymo are the visual reference for what a driverless pod looks like;
 * no logo, wordmark or livery of theirs is reproduced.
 */

/** The single route every vehicle rides. Shared with the motion layer. */
export const ROUTE_D =
  'M -40 486 C 180 486, 250 452, 372 430 S 560 386, 646 300 S 792 176, 918 236 S 1050 402, 1240 430';

const ACCENT = '#22c55e';
const SKY = '#38bdf8';

/** Simple geometric silhouettes. Deliberately generic: no livery, no marks. */
function Bus({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-26" y="-16" width="52" height="22" rx="4" fill={ACCENT} opacity="0.9" />
      <rect x="-20" y="-12" width="12" height="8" rx="1.5" fill="#0f172a" opacity="0.55" />
      <rect x="-4" y="-12" width="12" height="8" rx="1.5" fill="#0f172a" opacity="0.55" />
      <rect x="12" y="-12" width="10" height="8" rx="1.5" fill="#0f172a" opacity="0.55" />
      <circle cx="-15" cy="8" r="4" fill="#0f172a" />
      <circle cx="15" cy="8" r="4" fill="#0f172a" />
    </g>
  );
}

function Car({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M -20 2 L -16 -8 L 8 -8 L 18 2 Z" fill={ACCENT} opacity="0.85" />
      <rect x="-22" y="2" width="44" height="8" rx="3" fill={ACCENT} opacity="0.95" />
      <circle cx="-12" cy="11" r="3.5" fill="#0f172a" />
      <circle cx="12" cy="11" r="3.5" fill="#0f172a" />
    </g>
  );
}

/** Future mode: lift rotors plus a forward wing. Not a specific aircraft. */
function Vtol({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="0" rx="22" ry="6" fill={SKY} opacity="0.9" />
      <rect x="-30" y="-3" width="60" height="2.5" rx="1.25" fill={SKY} opacity="0.5" />
      {[-24, -10, 10, 24].map((dx) => (
        <g key={dx}>
          <rect x={dx - 1} y="-10" width="2" height="8" fill={SKY} opacity="0.6" />
          <ellipse cx={dx} cy="-11" rx="9" ry="1.6" fill={SKY} opacity="0.35" />
        </g>
      ))}
    </g>
  );
}

/** Driverless pod: symmetrical, no front or back, sensor dome on top. Generic. */
function Pod({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-24" y="-14" width="48" height="20" rx="9" fill={ACCENT} opacity="0.92" />
      <rect x="-17" y="-10" width="34" height="10" rx="4" fill="#0f172a" opacity="0.5" />
      <circle cx="0" cy="-17" r="3" fill={SKY} opacity="0.9" />
      <circle cx="-13" cy="8" r="4" fill="#0f172a" />
      <circle cx="13" cy="8" r="4" fill="#0f172a" />
    </g>
  );
}

/** Arrival: two adults and a child, walking to the door. */
function FamilyAtHouse({ x, y }: { x: number; y: number }) {
  const person = (dx: number, scale: number) => (
    <g transform={`translate(${dx} 0) scale(${scale})`}>
      <circle cx="0" cy="-16" r="3.6" fill="#e2e8f0" />
      <path d="M 0 -12 L 0 -2 M -4 -8 L 4 -8 M 0 -2 L -3.5 6 M 0 -2 L 3.5 6" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" fill="none" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* house */}
      <path d="M 26 4 L 26 -26 L 52 -44 L 78 -26 L 78 4 Z" fill="#1e293b" stroke={ACCENT} strokeOpacity="0.45" strokeWidth="1.5" />
      <rect x="45" y="-16" width="14" height="20" rx="1.5" fill={ACCENT} opacity="0.35" />
      {person(0, 1)}
      {person(11, 1)}
      {person(20, 0.7)}
    </g>
  );
}

export default function JourneyScene() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="One continuous trip: a bus, then a car, then vertical-takeoff aircraft, ending with a family arriving home in a driverless pod."
      >
        <defs>
          <linearGradient id="routeFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.15" />
            <stop offset="45%" stopColor={SKY} stopOpacity="0.5" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* The single unbroken route. One trip, four modes. */}
        <path d={ROUTE_D} fill="none" stroke="url(#routeFade)" strokeWidth="2.5" strokeLinecap="round" />
        <path d={ROUTE_D} fill="none" stroke={ACCENT} strokeOpacity="0.12" strokeWidth="10" strokeLinecap="round" />

        {/* Ground line, so the corner-to-corner read has a horizon. */}
        <line x1="0" y1="500" x2="1200" y2="500" stroke="#334155" strokeOpacity="0.5" strokeWidth="1" />

        <Bus x={150} y={470} />
        <Car x={400} y={420} />
        <Vtol x={648} y={296} />
        <Vtol x={760} y={232} />
        <Pod x={980} y={392} />
        <FamilyAtHouse x={1046} y={430} />
      </svg>

      {/* Darken toward the centre so the overlaid copy keeps its contrast. */}
      <div className="absolute inset-0 bg-slate-950/55" />
    </div>
  );
}
