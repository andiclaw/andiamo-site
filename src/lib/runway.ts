// RunwayToFlight v3.6 — TypeScript port of the Python compute engine.
//
// PORTED VERBATIM from the Andiamo Rides repo (src/lib/runway.ts) for
// SITE-RUNWAY-CALCULATOR-STARTUP-RESOURCE-001, Brendan #163: "yes move that to
// the andiamo.tech site as a startup resource". Not a rewrite - the file has no
// imports at all, so it moves as-is and the two copies stay comparable until the
// Rides one is removed (that removal rides Rides 1.0.26, not the frozen packets).
//
// It is PURE: no network, no storage, no clock beyond an explicitly passed base
// date. That is what lets the site page run it entirely in the visitor's browser
// and keep nothing.
// Debt-aware runway, breakeven, and funding gap simulator.

export const VERSION = '3.6.0';
const DEFAULT_TARGET_RUNWAY_MONTHS = 24;
const DEFAULT_RAISE_BUFFER_PCT = 20.0;
const MAX_FUNDING_CAP = 10_000_000.0;
const EPS = 1e-6;

// ─── Utils ───────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number): number {
  const x = Number(v);
  if (isNaN(x)) return lo;
  return Math.max(lo, Math.min(hi, x));
}

function toFloat(v: unknown): number {
  if (typeof v === 'number') return v;
  const n = Number(String(v ?? '').replace(/,/g, '').trim());
  return isNaN(n) ? 0 : n;
}

export function money(v: number): string {
  return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function coerceDate(s: string | null | undefined): string {
  if (!s) return '';
  const trimmed = String(s).trim();
  // YYYY-MM-DD
  const full = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (full) return trimmed;
  // YYYY-MM
  const partial = /^(\d{4})-(\d{2})$/.exec(trimmed);
  if (partial) return `${partial[1]}-${partial[2]}-01`;
  return trimmed;
}

function parseBaseDate(baseDateStr: string | null | undefined): Date {
  if (baseDateStr) {
    const cd = coerceDate(baseDateStr);
    const d = new Date(cd + 'T00:00:00');
    if (!isNaN(d.getTime())) return new Date(d.getFullYear(), d.getMonth(), 1);
  }
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
}

function addMonths(d: Date, months: number): Date {
  const result = new Date(d);
  result.setMonth(result.getMonth() + months);
  return result;
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function normalizeHex(c: string | null | undefined): string {
  let h = (c || '').trim().replace(/^#/, '');
  if (h.length === 3) h = h.split('').map(ch => ch + ch).join('');
  return h ? `#${h}` : '#12c04c';
}

// ─── Loan helpers ────────────────────────────────────────

function loanMonthlyPayment(principal: number, aprDecimal: number, termMonths: number): number {
  if (principal <= 0 || termMonths <= 0 || aprDecimal <= 0) return 0;
  const r = aprDecimal / 12;
  return principal * (r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
}

function stepLoan(
  rem: number, aprDecimal: number, pmt: number,
): { newRem: number; actualPay: number; interest: number; principalPaid: number } {
  if (rem <= EPS || pmt <= 0 || aprDecimal <= 0) return { newRem: rem, actualPay: 0, interest: 0, principalPaid: 0 };
  const interest = rem * (aprDecimal / 12);
  const due = rem + interest;
  const pay = Math.min(pmt, due + EPS);
  const principalPaid = Math.max(pay - interest, 0);
  let newRem = Math.max(rem - principalPaid, 0);
  if (newRem < EPS) newRem = 0;
  return { newRem, actualPay: pay, interest, principalPaid };
}

// ─── Core simulations ────────────────────────────────────

interface OpBeResult {
  opMonth: number | null;
  opDate: string | null;
  fundingGap: number;
  unreachable: boolean;
  cashoutMonth: number | null;
  cashoutDate: string | null;
  payoffMonth: number | null;
  mrrAtOp: number | null;
  mrcAtOp: number | null;
  pmtAtOp: number;
  autoSeeded: boolean;
}

function simulateToOpBe(
  mrr0: number, mrc0: number, gPct: number, cgPct: number,
  totalCash: number, loanPrincipal: number, aprDecimal: number,
  termMonths: number, baseDate: Date,
): OpBeResult {
  const g = gPct / 100;
  const cg = cgPct / 100;
  const autoSeeded = mrr0 <= 0;
  let mrr = autoSeeded ? 1 : mrr0;
  let mrc = mrc0;
  let rem = loanPrincipal;
  const pmt = loanMonthlyPayment(loanPrincipal, aprDecimal, termMonths);
  let cash = totalCash;
  let fundingGap = 0;
  let opMonth: number | null = null;
  let opDate: string | null = null;
  let cashoutMonth: number | null = null;
  let cashoutDate: string | null = null;
  let payoffMonth: number | null = null;
  let mrrAtOp: number | null = null;
  let mrcAtOp: number | null = null;
  let pmtAtOp = 0;
  let unreachable = false;

  for (let m = 1; m <= 240; m++) {
    mrr *= (1 + g);
    mrc *= (1 + cg);

    let currentPmt = 0;
    if (m <= termMonths && rem > EPS && pmt > 0) {
      const step = stepLoan(rem, aprDecimal, pmt);
      rem = step.newRem;
      currentPmt = step.actualPay;
      cash -= step.actualPay;
      if (rem <= EPS && payoffMonth === null) payoffMonth = m;
    }

    const net = mrr - mrc;
    cash += net;

    if (cash < 0) {
      if (cashoutMonth === null) {
        cashoutMonth = m;
        cashoutDate = formatDate(addMonths(baseDate, m));
      }
      fundingGap += -cash;
      cash = 0;
      if (fundingGap >= MAX_FUNDING_CAP) {
        unreachable = true;
        opMonth = null;
        opDate = null;
        break;
      }
    }

    if (mrr >= mrc + currentPmt && opMonth === null) {
      opMonth = m;
      opDate = formatDate(addMonths(baseDate, m));
      mrrAtOp = mrr;
      mrcAtOp = mrc;
      pmtAtOp = currentPmt;
      break;
    }
  }

  if (opMonth === null && !unreachable) unreachable = true;

  return {
    opMonth, opDate,
    fundingGap: Math.min(fundingGap, MAX_FUNDING_CAP),
    unreachable, cashoutMonth, cashoutDate, payoffMonth,
    mrrAtOp, mrcAtOp, pmtAtOp, autoSeeded,
  };
}

interface CashBeResult {
  cashMonth: number | null;
  cashDate: string | null;
  payoffMonth: number | null;
}

function simulateToCashBe(
  mrr0: number, mrc0: number, gPct: number, cgPct: number,
  totalCash: number, loanPrincipal: number, aprDecimal: number,
  termMonths: number, fundingGap: number, baseDate: Date,
): CashBeResult {
  const g = gPct / 100;
  const cg = cgPct / 100;
  let mrr = mrr0 <= 0 ? 1 : mrr0;
  let mrc = mrc0;
  let rem = loanPrincipal;
  const pmt = loanMonthlyPayment(loanPrincipal, aprDecimal, termMonths);
  const startCash = totalCash + Math.max(fundingGap, 0);
  let cash = startCash;
  let cashBeMonth: number | null = null;
  let cashBeDate: string | null = null;
  let payoffMonth: number | null = null;

  for (let m = 1; m <= 240; m++) {
    mrr *= (1 + g);
    mrc *= (1 + cg);

    if (m <= termMonths && rem > EPS && pmt > 0) {
      const step = stepLoan(rem, aprDecimal, pmt);
      rem = step.newRem;
      cash -= step.actualPay;
      if (rem <= EPS && payoffMonth === null) payoffMonth = m;
    }

    cash += mrr - mrc;

    if (cashBeMonth === null && cash >= startCash) {
      cashBeMonth = m;
      cashBeDate = formatDate(addMonths(baseDate, m));
      break;
    }
  }

  return { cashMonth: cashBeMonth, cashDate: cashBeDate, payoffMonth };
}

// ─── Solvers ─────────────────────────────────────────────

function solveGrowthForZeroFunding(
  mrr0: number, mrc0: number, costGrowthPct: number, totalCash: number,
  loanPrincipal: number, aprDecimal: number, termMonths: number, baseDate: Date,
): number | null {
  let hi = 300;
  const test = simulateToOpBe(mrr0, mrc0, hi, costGrowthPct, totalCash, loanPrincipal, aprDecimal, termMonths, baseDate);
  if (test.unreachable || test.fundingGap > 0) return null;

  let lo = 0;
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    const res = simulateToOpBe(mrr0, mrc0, mid, costGrowthPct, totalCash, loanPrincipal, aprDecimal, termMonths, baseDate);
    if (res.unreachable || res.fundingGap > 0) lo = mid;
    else hi = mid;
  }
  return Math.round(hi * 100) / 100;
}

function solveCostCutForZeroFunding(
  mrr0: number, mrc0: number, growthPct: number, costGrowthPct: number,
  totalCash: number, loanPrincipal: number, aprDecimal: number,
  termMonths: number, baseDate: Date,
): number | null {
  let hi = 0.95;
  const test = simulateToOpBe(mrr0, mrc0 * (1 - hi), growthPct, costGrowthPct, totalCash, loanPrincipal, aprDecimal, termMonths, baseDate);
  if (test.unreachable || test.fundingGap > 0) return null;

  let lo = 0;
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    const mrcAdj = mrc0 * (1 - mid);
    const res = simulateToOpBe(mrr0, mrcAdj, growthPct, costGrowthPct, totalCash, loanPrincipal, aprDecimal, termMonths, baseDate);
    if (res.unreachable || res.fundingGap > 0) lo = mid;
    else hi = mid;
  }
  return Math.round(hi * 1000) / 10;
}

// ─── Compute ─────────────────────────────────────────────

export interface RunwayCalc {
  companyName: string;
  formationDate: string;
  baseDate: string;
  mrr: number;
  lastMrr: number;
  mrc: number;
  growthPct: number;
  costGrowthPct: number;
  bootstrap: number;
  equity: number;
  grant: number;
  loan: number;
  aprPct: number;
  termMonths: number;
  totalCash: number;
  burnExDebt: number;
  burnInclDebt: number;
  staticRunway: number | null;
  opMonth: number | null;
  opDate: string | null;
  cashMonth: number | null;
  cashDate: string | null;
  fundingGap: number;
  unreachable: boolean;
  cashoutMonth: number | null;
  cashoutDate: string | null;
  payoffMonth: number | null;
  beReachableBridgeFree: boolean;
  loanFullyBeforeRunway: boolean;
  arr: number;
  burnMultiple: number | null;
  survivalRaise: number;
  recommendedRaise: number;
  growthToZero: number | null;
  cutToZero: number | null;
  mrrThreshold: number | null;
  mrrAtOp: number | null;
  debtRatio: number | null;
  autoSeeded: boolean;
}

export interface RunwayInput {
  company_name?: string;
  formation_date?: string;
  mrr?: number;
  last_mrr?: number;
  mrc?: number;
  growth_pct?: number;
  cost_growth_pct?: number;
  bootstrap_cash?: number;
  external_equity_cash?: number;
  grant_cash?: number;
  loan_cash?: number;
  loan_apr_pct?: number;
  loan_term_years?: number;
  accent_colors?: string;
  start_date?: string;
}

export function compute(d: RunwayInput, baseDateStr?: string | null): RunwayCalc {
  const companyName = (d.company_name || '').trim() || 'Company';
  const formationDate = coerceDate(d.formation_date);

  const mrr = toFloat(d.mrr);
  const lastMrr = toFloat(d.last_mrr ?? mrr);
  const mrc = toFloat(d.mrc);

  const g = clamp(d.growth_pct ?? 0, 0, 300);
  const cg = clamp(d.cost_growth_pct ?? 0, 0, 300);

  const bootstrap = toFloat(d.bootstrap_cash);
  const equity = toFloat(d.external_equity_cash);
  const grant = toFloat(d.grant_cash);
  const loan = toFloat(d.loan_cash);

  const aprPct = clamp(d.loan_apr_pct ?? 3, 0, 40);
  const termYears = clamp(d.loan_term_years ?? 3, 0, 10);
  const termMonths = Math.round(termYears * 12);

  const totalCash = bootstrap + equity + grant + loan;
  const baseDate = parseBaseDate(baseDateStr || formationDate || undefined);

  const aprDecimal = (loan > 0 && aprPct > 0 && termMonths > 0) ? aprPct / 100 : 0;
  const pmt = aprDecimal > 0 ? loanMonthlyPayment(loan, aprDecimal, termMonths) : 0;

  const burnExDebt = Math.max(mrc - mrr, 0);
  const burnInclDebt = burnExDebt + pmt;
  const staticRunway = burnInclDebt <= 0 ? null : Math.round((totalCash / burnInclDebt) * 10) / 10;

  const opRes = simulateToOpBe(mrr, mrc, g, cg, totalCash, loan, aprDecimal, termMonths, baseDate);
  const cashRes = (!opRes.unreachable && opRes.fundingGap < MAX_FUNDING_CAP && opRes.opMonth !== null)
    ? simulateToCashBe(mrr, mrc, g, cg, totalCash, loan, aprDecimal, termMonths, opRes.fundingGap, baseDate)
    : { cashMonth: null, cashDate: null, payoffMonth: null };

  const beReachableBridgeFree = opRes.opMonth !== null && (opRes.cashoutMonth === null || opRes.cashoutMonth >= opRes.opMonth);
  let loanFullyBeforeRunway = false;
  let payoffMonth: number | null = null;
  if (loan > 0 && aprDecimal > 0 && termMonths > 0) {
    const candidates = [opRes.payoffMonth, cashRes.payoffMonth].filter((m): m is number => m !== null);
    payoffMonth = candidates.length > 0 ? Math.min(...candidates) : null;
    if (payoffMonth !== null && opRes.cashoutMonth !== null) {
      loanFullyBeforeRunway = payoffMonth <= opRes.cashoutMonth;
    }
  }

  let { fundingGap, unreachable } = opRes;
  if (fundingGap >= MAX_FUNDING_CAP) {
    unreachable = true;
    fundingGap = MAX_FUNDING_CAP;
  }

  const arr = mrr * 12;
  const netNewArr = Math.max((mrr - lastMrr) * 12, 0);
  let burnMultiple: number | null = null;
  if (netNewArr > 0 && burnExDebt > 0) {
    burnMultiple = Math.round(((burnExDebt * 12) / netNewArr) * 10) / 10;
  }

  let survivalRaise = 0;
  if (burnInclDebt > 0) survivalRaise = burnInclDebt * DEFAULT_TARGET_RUNWAY_MONTHS;
  const recommendedRaise = Math.ceil(Math.max(fundingGap, survivalRaise) * (1 + DEFAULT_RAISE_BUFFER_PCT / 100));

  const growthToZero = solveGrowthForZeroFunding(mrr, mrc, cg, totalCash, loan, aprDecimal, termMonths, baseDate);
  const cutToZero = solveCostCutForZeroFunding(mrr, mrc, g, cg, totalCash, loan, aprDecimal, termMonths, baseDate);

  let mrrThreshold: number | null = null;
  let debtRatio: number | null = null;
  if (opRes.mrrAtOp !== null && opRes.mrcAtOp !== null) {
    mrrThreshold = opRes.mrcAtOp + (opRes.pmtAtOp || 0);
    if (opRes.mrrAtOp > 0) debtRatio = (opRes.pmtAtOp || 0) / opRes.mrrAtOp;
  }

  return {
    companyName, formationDate, baseDate: formatDate(baseDate),
    mrr, lastMrr: lastMrr, mrc, growthPct: g, costGrowthPct: cg,
    bootstrap, equity, grant, loan, aprPct, termMonths, totalCash,
    burnExDebt, burnInclDebt, staticRunway,
    opMonth: opRes.opMonth, opDate: opRes.opDate,
    cashMonth: cashRes.cashMonth, cashDate: cashRes.cashDate,
    fundingGap, unreachable,
    cashoutMonth: opRes.cashoutMonth, cashoutDate: opRes.cashoutDate,
    payoffMonth, beReachableBridgeFree, loanFullyBeforeRunway,
    arr, burnMultiple, survivalRaise, recommendedRaise,
    growthToZero, cutToZero, mrrThreshold, mrrAtOp: opRes.mrrAtOp,
    debtRatio, autoSeeded: opRes.autoSeeded,
  };
}

// ─── Output builders ─────────────────────────────────────

export function buildPrompt(inp: RunwayInput, c: RunwayCalc, currencySymbol = '$'): string {
  const accent = normalizeHex(inp.accent_colors);
  const liftoff = c.opDate || 'N/A';
  const burnTag = `${currencySymbol}${money(c.burnExDebt)}/mo`;
  const capTag = `${currencySymbol}${money(c.totalCash)}`;
  const gapTag = `${currencySymbol}${money(c.fundingGap)}`;

  let midText: string;
  if (!c.unreachable && c.opMonth !== null && c.fundingGap <= 0) {
    midText = `✅ Liftoff in ${c.opMonth} mo (${liftoff}) without new funding.`;
  } else if (c.fundingGap >= MAX_FUNDING_CAP || c.unreachable) {
    midText = `❌ Cannot reach operational liftoff with these inputs. Model estimates more than ${currencySymbol}${money(MAX_FUNDING_CAP)} required.`;
  } else {
    midText = `⚠️ Requires ${currencySymbol}${money(c.fundingGap)} to reach liftoff.`;
  }

  const formation = inp.formation_date || '';
  return `COPY/PASTE INTO YOUR IMAGE GENERATOR — BEGIN
STYLE
Minimal, top-down vector infographic on a subtle blueprint grid.
Clean modern sans-serif font, blueprint blue background, white lines,
accent color ${accent}. Aspect ratio: 16:9 (1792×1024).

SCENE COMPOSITION
- Horizontal runway centered across the frame.
- Sleek futuristic aircraft labeled "${c.companyName}" mid-runway.
- Left label: "Formation ${formation}".
- Right label: "Est. Liftoff ${liftoff}".
- Four small data tags near runway:
    • Burn (ex-debt) ${burnTag}
    • Capital ${capTag}
    • Liftoff ${liftoff}
    • Funding Gap ${gapTag}

MIDLINE TEXT
"${midText}"
COPY/PASTE INTO YOUR IMAGE GENERATOR — END`;
}

export function buildSummary(c: RunwayCalc, currencySymbol = '$'): string {
  const pmt = (c.loan > 0 && c.aprPct > 0 && c.termMonths > 0)
    ? loanMonthlyPayment(c.loan, c.aprPct / 100, c.termMonths) : 0;
  const baseRunway = c.staticRunway === null ? '∞ (cash covers burn)' : `${c.staticRunway} mo`;
  const bmStr = c.burnMultiple === null ? 'n/a' : `${c.burnMultiple}x`;
  const arrStr = `${currencySymbol}${money(c.arr)}`;
  const opStr = (c.opMonth !== null && c.opDate) ? `${c.opMonth} mo (${c.opDate})` : 'N/A';
  const cashStr = (c.cashMonth !== null && c.cashDate) ? `${c.cashMonth} mo (${c.cashDate})` : 'N/A';

  let loanLines = '';
  if (c.loan > 0 && pmt > 0) {
    const drStr = c.debtRatio === null ? 'n/a' : `${(c.debtRatio * 100).toFixed(2)}%`;
    loanLines = `
🏦 LOAN
• Monthly Payment: ${currencySymbol}${money(pmt)}
• APR / Term: ${c.aprPct.toFixed(1)}% / ${c.termMonths} mo
• Loan serviceable to BE (bridge-free): ${c.beReachableBridgeFree ? '✅ Yes' : '⚠️ No'}
• Loan fully repaid before runway ends: ${c.loanFullyBeforeRunway ? '✅ Yes' : '⚠️ No'}
• Debt ratio at Op BE (pmt/MRR): ${drStr}
`;
  }

  const mrrThresholdStr = c.mrrThreshold === null ? 'n/a' : `${currencySymbol}${money(c.mrrThreshold)}`;
  const mrrCurrentStr = `${currencySymbol}${money(c.mrr)}`;
  const mrrGapStr = c.mrrThreshold === null ? 'n/a' : `${currencySymbol}${money(Math.max(c.mrrThreshold - c.mrr, 0))}`;

  const gOpt = c.growthToZero !== null ? `${c.growthToZero.toFixed(2)}%` : 'N/A';
  const cOpt = c.cutToZero !== null ? `${c.cutToZero.toFixed(1)}%` : 'N/A';

  let bottom: string;
  if (c.fundingGap >= MAX_FUNDING_CAP || c.unreachable) {
    bottom = `❌ Cannot reach operational liftoff with these inputs. Model estimates more than ${currencySymbol}${money(MAX_FUNDING_CAP)} required.`;
  } else {
    bottom = `⚠️ Requires ${currencySymbol}${money(c.fundingGap)} to reach operational liftoff. Recommended raise (+${DEFAULT_RAISE_BUFFER_PCT.toFixed(0)}% buffer): ${currencySymbol}${money(c.recommendedRaise)}. Alternatives → growth ≥ ${gOpt}/mo or cost cut ≥ ${cOpt}.`;
  }

  return `🚀 RUN SUMMARY — ${c.companyName}
────────────────────────────────────────────
💰 CASH
• Available: ${currencySymbol}${money(c.totalCash)}
• Monthly Burn (ex-debt): ${currencySymbol}${money(c.burnExDebt)}
• Debt-adjusted Burn (incl. debt): ${currencySymbol}${money(c.burnInclDebt)}
• Static Runway (incl. debt): ${baseRunway}
• Sources → Bootstrap ${currencySymbol}${money(c.bootstrap)}, Equity ${currencySymbol}${money(c.equity)}, Grants ${currencySymbol}${money(c.grant)}, Loan ${currencySymbol}${money(c.loan)}

📊 TRAJECTORY
• Revenue Growth: +${c.growthPct.toFixed(1)}% per month
• Cost Growth: +${c.costGrowthPct.toFixed(1)}% per month
• Operational Breakeven: ${opStr}
• Cash Breakeven: ${cashStr}
• Funding Gap to Operational BE: ${currencySymbol}${money(c.fundingGap)}
${loanLines}
🏎️ EFFICIENCY
ARR: ${arrStr}
• Burn Multiple: ${bmStr}
• MRR Threshold at Op BE: ${mrrThresholdStr} (costs + active debt)
• Current MRR: ${mrrCurrentStr}
• MRR Gap: ${mrrGapStr}

────────────────────────────────────────────
${bottom}`;
}
