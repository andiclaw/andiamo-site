/**
 * SITE-HOME-FEEDBACK-1008-002 item 4 (Brendan 10-08): a LIVE status per app, read from the app's real health endpoint
 * and a maintenance flag, never hardcoded; when we cannot tell, the pill says so.
 *
 * Sources, read 2026-10-14 on each app's dev branch and against PROD:
 *   Academy and Rides publish /api/ready: { state: ok | degraded | down }, 503 when down. Public by design.
 *   Velocity's readiness report is authenticated only (lead ruling 2026-08-08, src/app/api/v1/status/route.ts), so
 *   the site reads its public liveness probe /api/health: it can show Active, Offline or unknown, never Degraded.
 * The maintenance flag is the site's runtime setting SITE_MAINTENANCE_APPS (comma list of app keys), so an operator
 * can raise it without a rebuild; no app publishes one today.
 */
export type StatusKey = 'academy' | 'velocity' | 'andiamo';
export type StatusKind = 'active' | 'degraded' | 'offline' | 'maintenance' | 'unknown';

export const STATUS_LABEL: Record<StatusKind | 'checking', string> = {
  active: 'Active',
  degraded: 'Degraded',
  offline: 'Offline',
  maintenance: 'Maintenance coming',
  unknown: 'Status unknown',
  checking: 'Checking status',
};

export const STATUS_SOURCES: Record<StatusKey, { url: string; kind: 'ready' | 'health'; id: string }> = {
  academy: { url: 'https://academy.andiamo.tech/api/ready', kind: 'ready', id: 'academy' },
  velocity: { url: 'https://velocity.andiamo.tech/api/health', kind: 'health', id: 'velocity' },
  andiamo: { url: 'https://rides.andiamo.tech/api/ready', kind: 'ready', id: 'andiamo' },
};

export type ProbeResult = { ok: true; httpStatus: number; body: unknown } | { ok: false };

export function classify(key: StatusKey, result: ProbeResult, maintenance: boolean): StatusKind {
  if (maintenance) return 'maintenance';
  if (!result.ok) return 'unknown';
  if (result.httpStatus >= 500) return 'offline';
  if (result.httpStatus !== 200 || typeof result.body !== 'object' || result.body === null) return 'unknown';
  const body = result.body as Record<string, unknown>;
  const source = STATUS_SOURCES[key];
  // A 200 from something that is not the app (a parked page, a wrong host) proves nothing.
  if ((body.service ?? body.app) !== source.id) return 'unknown';
  if (source.kind === 'health') return body.status === 'ok' ? 'active' : 'unknown';
  if (body.state === 'ok') return 'active';
  if (body.state === 'degraded') return 'degraded';
  return 'unknown';
}

export function maintenanceKeys(raw: string | undefined): Set<StatusKey> {
  const keys = new Set<StatusKey>();
  for (const part of (raw ?? '').split(',')) {
    const key = part.trim();
    if (key in STATUS_SOURCES) keys.add(key as StatusKey);
  }
  return keys;
}

export async function probe(url: string, timeoutMs = 4000): Promise<ProbeResult> {
  try {
    const res = await fetch(url, { cache: 'no-store', redirect: 'manual', signal: AbortSignal.timeout(timeoutMs) });
    const body = await res.json().catch(() => null);
    return { ok: true, httpStatus: res.status, body };
  } catch {
    return { ok: false };
  }
}
