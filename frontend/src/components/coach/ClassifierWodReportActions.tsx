'use client';

export function ClassifierWodReportActions() {
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 uppercase transition hover:border-[color:var(--color-secondary)] hover:text-[color:var(--color-secondary)]"
      >
        Imprimir
      </button>
      <a
        href="/api/coach/reports/classifier-wods.pdf"
        className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white uppercase transition hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-ink)]"
      >
        Descargar PDF
      </a>
    </div>
  );
}
