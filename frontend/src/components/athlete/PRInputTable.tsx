'use client';

import type { BaselinePR } from '@/types';

type PRInputTableProps = {
  prs: BaselinePR[];
  locked: boolean;
  onChange: (prs: BaselinePR[]) => void;
};

export function PRInputTable({ prs, locked, onChange }: PRInputTableProps) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-primary-soft)]">
        PR Input
      </p>
      <div className="mt-6 hidden overflow-hidden rounded-[1.5rem] border border-white/10 md:block">
        <table className="min-w-full">
          <thead className="bg-white/5">
            <tr className="text-left text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
              <th className="px-4 py-4">Movimiento</th>
              <th className="px-4 py-4">Unidad</th>
              <th className="px-4 py-4">Valor</th>
            </tr>
          </thead>
          <tbody>
            {prs.map((item) => (
              <tr key={item.id} className="border-t border-white/6">
                <td className="px-4 py-4 text-white">{item.movement}</td>
                <td className="px-4 py-4 text-[color:var(--color-text-muted)]">{item.unit}</td>
                <td className="px-4 py-4">
                  <input
                    type="number"
                    value={item.value}
                    disabled={locked}
                    onChange={(event) =>
                      onChange(
                        prs.map((entry) =>
                          entry.id === item.id
                            ? {
                                ...entry,
                                value: Number(event.target.value),
                              }
                            : entry,
                        ),
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-[color:var(--color-surface)] px-3 py-2 text-sm text-white outline-none disabled:opacity-50"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid gap-4 md:hidden">
        {prs.map((item) => (
          <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-[color:var(--color-surface)] p-4">
            <p className="text-sm font-semibold text-white">{item.movement}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
              {item.unit}
            </p>
            <input
              type="number"
              value={item.value}
              disabled={locked}
              onChange={(event) =>
                onChange(
                  prs.map((entry) =>
                    entry.id === item.id
                      ? {
                          ...entry,
                          value: Number(event.target.value),
                        }
                      : entry,
                  ),
                )
              }
              className="mt-4 w-full rounded-xl border border-white/10 bg-black/10 px-3 py-3 text-sm text-white outline-none disabled:opacity-50"
            />
          </div>
        ))}
      </div>
    </article>
  );
}
