'use client';

type AthleteSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function AthleteSearch({ value, onChange }: AthleteSearchProps) {
  return (
    <div className="grid gap-4 rounded-[1.9rem] border border-white/10 bg-white/5 p-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
          Buscar atleta
        </span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Nombre, ciudad o enfoque"
          className="mt-3 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[color:var(--color-text-muted)] focus:border-[color:var(--color-primary)]"
        />
      </label>
      <div className="rounded-[1.5rem] border border-white/10 bg-black/15 p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
          Alcance
        </p>
        <p className="mt-2 text-sm leading-7 text-white">
          Explora atletas por identidad, ciudad o enfoque de entrenamiento desde una sola vista.
        </p>
      </div>
    </div>
  );
}
