import { NextResponse } from 'next/server';
import { ServerClient } from 'postmark';
import { COMPANY } from '@/lib/company';
import { PRODUCTS } from '@/lib/products';

export const runtime = 'nodejs';

const KIND_LABEL: Record<string, string> = {
  security: 'Security finding',
  dmca: 'DMCA notice',
  takedown: 'Content takedown',
  bug: 'Bug report',
  other: 'General report',
};

interface ReportPayload {
  kind?: string;
  product?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validate(p: ReportPayload): { ok: true; value: Required<Omit<ReportPayload, 'product'>> & { product: string } } | { ok: false; error: string } {
  const kind = String(p.kind ?? '').toLowerCase();
  if (!KIND_LABEL[kind]) return { ok: false, error: 'Invalid report kind.' };

  const email = String(p.email ?? '').trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return { ok: false, error: 'A valid email is required.' };
  }

  const subject = String(p.subject ?? '').trim();
  if (!subject || subject.length > 140) return { ok: false, error: 'Subject is required (max 140 chars).' };

  const message = String(p.message ?? '').trim();
  if (!message || message.length < 20) return { ok: false, error: 'Please describe the issue (at least 20 characters).' };
  if (message.length > 8000) return { ok: false, error: 'Message too long (max 8000 characters).' };

  const productRaw = String(p.product ?? '').trim().toLowerCase();
  const productOk =
    productRaw === '' ||
    productRaw === 'corporate' ||
    PRODUCTS.some((x) => x.key === productRaw);
  if (!productOk) return { ok: false, error: 'Invalid product selection.' };

  return { ok: true, value: { kind, product: productRaw, email, subject, message } };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: Request) {
  let body: ReportPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const v = validate(body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });

  const { kind, product, email, subject, message } = v.value;
  const productLabel = product ? (PRODUCTS.find((x) => x.key === product)?.name ?? 'Corporate') : '(unspecified)';
  const kindLabel = KIND_LABEL[kind];

  const fullSubject = `[${kindLabel}] ${productLabel}: ${subject}`;
  const textBody = [
    `Kind:    ${kindLabel}`,
    `Product: ${productLabel}`,
    `From:    ${email}`,
    `Subject: ${subject}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const htmlBody = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0f172a;max-width:640px;">
      <h2 style="margin:0 0 12px 0;font-size:16px;">${escapeHtml(kindLabel)}, ${escapeHtml(productLabel)}</h2>
      <table style="border-collapse:collapse;font-size:13px;margin-bottom:16px;">
        <tr><td style="padding:2px 8px 2px 0;color:#64748b;">From</td><td style="padding:2px 0;">${escapeHtml(email)}</td></tr>
        <tr><td style="padding:2px 8px 2px 0;color:#64748b;">Subject</td><td style="padding:2px 0;">${escapeHtml(subject)}</td></tr>
        <tr><td style="padding:2px 8px 2px 0;color:#64748b;">Submitted</td><td style="padding:2px 0;">${new Date().toISOString()}</td></tr>
      </table>
      <div style="white-space:pre-wrap;border-left:3px solid #06B6D4;padding:8px 12px;background:#f8fafc;font-size:13px;line-height:1.55;">${escapeHtml(message)}</div>
    </div>`;

  const token = process.env.POSTMARK_SERVER_TOKEN;
  const from = process.env.SUPPORT_FROM_EMAIL || `noreply@${COMPANY.domain}`;
  const to = process.env.SUPPORT_TO_EMAIL || COMPANY.supportEmail;

  if (!token) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[report] POSTMARK_SERVER_TOKEN unset, skipping send. Would have sent: "${fullSubject}" to ${to}`);
      return NextResponse.json({ ok: true, delivered: false, dev: true });
    }
    return NextResponse.json({ error: 'Mailer not configured.' }, { status: 503 });
  }

  try {
    const client = new ServerClient(token);
    const result = await client.sendEmail({
      From: from,
      To: to,
      ReplyTo: email,
      Subject: fullSubject,
      TextBody: textBody,
      HtmlBody: htmlBody,
      MessageStream: 'outbound',
      Tag: `report-${kind}`,
      Metadata: { kind, product: product || '', source: 'andiamo.tech/report' },
    });
    return NextResponse.json({ ok: true, delivered: true, id: result.MessageID });
  } catch (err) {
    console.error('[report] Postmark send failed', err);
    return NextResponse.json({ error: 'Could not deliver report. Email support@andiamo.tech directly.' }, { status: 502 });
  }
}
