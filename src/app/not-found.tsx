import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-3">404</div>
      <h1 className="text-3xl font-black text-white mb-3">Nothing here.</h1>
      <p className="text-slate-400 mb-8">That page doesn’t exist, or hasn’t been built yet.</p>
      <Link href="/" className="px-6 py-2.5 rounded-pill text-sm font-semibold grad-cyan-blue text-white shadow-lg shadow-cyan-500/30">
        Back home →
      </Link>
    </div>
  );
}
