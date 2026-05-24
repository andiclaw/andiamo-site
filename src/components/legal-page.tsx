interface Section {
  heading: string;
  body: string | string[];
}

export interface LegalDoc {
  title: string;
  updatedISO: string;
  updatedDisplay: string;
  intro: string;
  sections: Section[];
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-10 pb-6 border-b hairline">
        <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-semibold">Legal</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2 mb-2">{doc.title}</h1>
        <p className="text-xs text-slate-500">Last updated {doc.updatedDisplay} · version <code>{doc.updatedISO}</code></p>
      </header>

      <p className="text-base text-slate-300 leading-relaxed mb-8">{doc.intro}</p>

      <div className="space-y-8 text-slate-300 leading-relaxed">
        {doc.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-lg font-bold text-white mb-3">{s.heading}</h2>
            {Array.isArray(s.body) ? (
              s.body.map((p, i) => <p key={i} className="mb-3 text-sm">{p}</p>)
            ) : (
              <p className="text-sm">{s.body}</p>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
