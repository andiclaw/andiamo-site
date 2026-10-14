import { NextResponse } from 'next/server';
import { STATUS_SOURCES, classify, maintenanceKeys, probe, type StatusKey, type StatusKind } from '../../../lib/app-status';

export const dynamic = 'force-dynamic';

/**
 * GET /api/status (SITE-HOME-FEEDBACK-1008-002 item 4): the home page's live status pills. The browser cannot read the
 * apps itself (the site's CSP is connect-src 'self'), so this route reads the three FIXED endpoints in
 * src/lib/app-status.ts. It takes no input from the request, so it cannot be pointed anywhere else.
 * A full answer is held for 60 seconds, so however often the page is opened the apps see at most three reads a minute.
 * An answer with any unknown in it is held for only 10 seconds, so a slow start or a passing timeout is retried soon.
 */
const HOLD_MS = 60_000;
const MISS_HOLD_MS = 10_000;
let held: { at: number; hold: number; payload: { checkedAt: string; apps: Record<StatusKey, StatusKind> } } | null = null;

export async function GET() {
  const now = Date.now();
  if (!held || now - held.at > held.hold) {
    const maintenance = maintenanceKeys(process.env.SITE_MAINTENANCE_APPS);
    const keys = Object.keys(STATUS_SOURCES) as StatusKey[];
    const results = await Promise.all(keys.map((key) => probe(STATUS_SOURCES[key].url)));
    const apps = Object.fromEntries(keys.map((key, i) => [key, classify(key, results[i], maintenance.has(key))])) as Record<StatusKey, StatusKind>;
    const hold = Object.values(apps).includes('unknown') ? MISS_HOLD_MS : HOLD_MS;
    held = { at: now, hold, payload: { checkedAt: new Date(now).toISOString(), apps } };
  }
  return NextResponse.json(held.payload, { headers: { 'Cache-Control': 'no-store' } });
}
