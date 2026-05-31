'use client';

import { useState } from 'react';
import { PRODUCTS } from '@/lib/products';

type Kind = 'security' | 'dmca' | 'takedown' | 'bug' | 'other';

const KINDS: { value: Kind; label: string; help: string }[] = [
  { value: 'security', label: 'Security finding', help: 'Vulnerability, misconfiguration, exposed data. We respond within 72 hours.' },
  { value: 'dmca', label: 'DMCA notice', help: 'Copyrighted material you own appears on one of our products without permission.' },
  { value: 'takedown', label: 'Content takedown', help: 'Content that violates our policies (impersonation, harassment, doxxing, etc).' },
  { value: 'bug', label: 'Bug report', help: 'Something broken or behaving unexpectedly.' },
  { value: 'other', label: 'Something else', help: "Doesn't fit the boxes above? Tell us in plain English." },
];

export function ReportForm({ defaultProduct }: { defaultProduct?: string }) {
  const [kind, setKind] = useState<Kind>('security');
  const [product, setProduct] = useState<string>(defaultProduct ?? '');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const activeKind = KINDS.find((k) => k.value === kind)!;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, product, email, subject, message }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`);
      setResult({ ok: true, message: 'Got it. We routed your report and will reply from support@andiamo.tech.' });
      setSubject('');
      setMessage('');
    } catch (err) {
      setResult({
        ok: false,
        message:
          err instanceof Error
            ? err.message
            : 'Submission failed. Email support@andiamo.tech directly and we’ll pick it up.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.ok) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.05] p-8 text-center">
        <div className="text-emerald-300 text-2xl mb-2">✓</div>
        <div className="text-white font-semibold mb-1">Report received</div>
        <p className="text-sm text-slate-400">{result.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">What kind of report?</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {KINDS.map((k) => (
            <button
              type="button"
              key={k.value}
              onClick={() => setKind(k.value)}
              className={`px-3 py-2 rounded-pill text-xs font-semibold border transition-all ${
                kind === k.value
                  ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-200'
                  : 'hairline border text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {k.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2">{activeKind.help}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="product" className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Product (optional)</label>
          <select
            id="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full px-4 py-2.5 rounded-pill bg-white/[0.04] border hairline text-sm text-slate-200 focus:outline-none focus:border-cyan-500/40"
          >
            <option value="">Pick one if relevant</option>
            {PRODUCTS.map((p) => (
              <option key={p.key} value={p.key}>{p.name}</option>
            ))}
            <option value="corporate">Andiamo Tech (corporate)</option>
          </select>
        </div>
        <div>
          <label htmlFor="email" className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Your email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-pill bg-white/[0.04] border hairline text-sm text-slate-200 focus:outline-none focus:border-cyan-500/40"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Subject</label>
        <input
          id="subject"
          type="text"
          required
          maxLength={140}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="One line: what is this about?"
          className="w-full px-4 py-2.5 rounded-pill bg-white/[0.04] border hairline text-sm text-slate-200 focus:outline-none focus:border-cyan-500/40"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Details</label>
        <textarea
          id="message"
          required
          rows={7}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={8000}
          placeholder={
            kind === 'security'
              ? 'Repro steps, affected URL/endpoint, impact, your contact preference. PGP welcome.'
              : kind === 'dmca'
                ? 'Identify the copyrighted work, the URL where it appears, and confirm you are the rights holder or authorized agent.'
                : 'What happened, what you expected, anything we should know.'
          }
          className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border hairline text-sm text-slate-200 focus:outline-none focus:border-cyan-500/40 resize-y"
        />
        <div className="text-[10px] text-slate-600 text-right mt-1">{message.length}/8000</div>
      </div>

      {result && !result.ok && (
        <div className="rounded-pill px-4 py-2 border border-rose-500/40 bg-rose-500/[0.05] text-xs text-rose-200">
          {result.message}
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-xs text-slate-500">All reports route to <span className="text-slate-300">support@andiamo.tech</span>.</p>
        <button
          type="submit"
          disabled={submitting}
          className="px-7 py-3 rounded-pill text-sm font-semibold grad-cyan-blue text-white shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-all"
        >
          {submitting ? 'Sending…' : 'Submit report →'}
        </button>
      </div>
    </form>
  );
}
