'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { AchievementReviewDrawer } from '@/components/coach/AchievementReviewDrawer';
import { PendingAchievementsTable } from '@/components/coach/PendingAchievementsTable';
import { ActionToast } from '@/components/shared/ActionToast';
import {
  approveAchievementAction,
  rejectAchievementAction,
  updateAchievementTieBreakAction,
  updateAchievementResultAction,
} from '@/services/actions';
import type { PendingAchievementReview } from '@/types';

type CoachAchievementsViewProps = {
  items: PendingAchievementReview[];
};

type AchievementFilter = 'submitted' | 'approved';

const filterStyles: Record<
  AchievementFilter,
  { active: string; inactive: string }
> = {
  submitted: {
    active:
      'border-amber-400 bg-amber-400 text-slate-950 shadow-[0_14px_32px_rgba(251,191,36,0.24)]',
    inactive:
      'border-amber-300 bg-white text-amber-800 hover:bg-amber-50 hover:border-amber-400',
  },
  approved: {
    active:
      'border-emerald-500 bg-emerald-500 text-white shadow-[0_14px_32px_rgba(16,185,129,0.22)]',
    inactive:
      'border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50 hover:border-emerald-500',
  },
};

export function CoachAchievementsView({ items }: CoachAchievementsViewProps) {
  const [state, setState] = useState(items);
  const [activeFilter, setActiveFilter] = useState<AchievementFilter>('submitted');
  const [selected, setSelected] = useState<PendingAchievementReview | null>(
    null,
  );
  const [tieBreakDrafts, setTieBreakDrafts] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        items
          .filter((item) => item.status === 'approved')
          .map((item) => [item.id, String(item.tieBreakOrder ?? '')]),
      ),
  );
  const [toast, setToast] = useState<{
    message: string;
    tone: 'success' | 'error';
  } | null>(null);
  const router = useRouter();

  const counts = useMemo(
    () => ({
      submitted: state.filter((item) => item.status === 'submitted').length,
      approved: state.filter((item) => item.status === 'approved').length,
    }),
    [state],
  );
  const filteredItems = useMemo(
    () => state.filter((item) => item.status === activeFilter),
    [activeFilter, state],
  );
  const hasItems = filteredItems.length > 0;
  const approvedItems = useMemo(
    () => state.filter((item) => item.status === 'approved'),
    [state],
  );

  function updateTieBreak(item: PendingAchievementReview) {
    const draftValue = tieBreakDrafts[item.id]?.trim() ?? '';
    const nextOrder = Number(draftValue);

    if (!Number.isInteger(nextOrder) || nextOrder < 1) {
      setToast({
        message: 'El orden de desempate debe ser un número entero mayor a 0.',
        tone: 'error',
      });
      return;
    }

    void updateAchievementTieBreakAction(item.id, nextOrder)
      .then(() => {
        setState((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? { ...entry, tieBreakOrder: nextOrder }
              : entry,
          ),
        );
        setToast({
          message: 'Desempate actualizado.',
          tone: 'success',
        });
        router.refresh();
      })
      .catch((caught) => {
        setToast({
          message:
            caught instanceof Error
              ? caught.message
              : 'No se pudo actualizar el desempate.',
          tone: 'error',
        });
      });
  }

  return (
    <div className="space-y-6">
      {toast ? (
        <ActionToast
          message={toast.message}
          tone={toast.tone}
          onDismiss={() => setToast(null)}
        />
      ) : null}
      <div className="sole-hatch flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-[0_18px_48px_rgba(15,23,42,0.07)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] text-[color:var(--color-text-muted)] uppercase">
            Estado de revisión
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">
            Pendientes se cargan por defecto; aprobados permite correcciones y desempate.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {([
            ['submitted', 'Pendientes', counts.submitted],
            ['approved', 'Aprobados', counts.approved],
          ] as Array<[AchievementFilter, string, number]>).map(([value, label, count]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setActiveFilter(value);
                setSelected(null);
              }}
              className={`rounded-full border px-4 py-3 text-xs font-bold tracking-[0.16em] uppercase transition ${
                activeFilter === value
                  ? filterStyles[value].active
                  : filterStyles[value].inactive
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>
      {!hasItems ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/80 p-6 text-sm text-slate-600">
          {activeFilter === 'submitted'
            ? 'No hay resultados pendientes de revisión.'
            : 'No hay resultados aprobados para consultar.'}
        </div>
      ) : (
        <PendingAchievementsTable items={filteredItems} onSelect={setSelected} />
      )}
      <AchievementReviewDrawer
        item={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
        onApprove={(result) => {
          if (!selected) {
            setToast({
              message: 'No se pudo aprobar el logro seleccionado.',
              tone: 'error',
            });
            return;
          }
          void approveAchievementAction(selected.id, result)
            .then(() => {
              setState((current) => current.filter((item) => item.id !== selected.id));
              setSelected(null);
              setToast({
                message: 'Resultado aprobado correctamente.',
                tone: 'success',
              });
              router.refresh();
            })
            .catch((caught) => {
              setToast({
                message:
                  caught instanceof Error
                    ? caught.message
                    : 'No se pudo aprobar el resultado.',
                tone: 'error',
              });
            });
        }}
        onSave={(result) => {
          if (!selected) {
            setToast({
              message: 'No se pudo guardar el resultado seleccionado.',
              tone: 'error',
            });
            return;
          }
          void updateAchievementResultAction(selected.id, result)
            .then(() => {
              setState((current) =>
                current.map((item) =>
                  item.id === selected.id
                    ? {
                        ...item,
                        completed: result.completed,
                        resultFormat: result.resultFormat,
                        timeSeconds: result.timeSeconds,
                        repsCompleted: result.repsCompleted,
                        weightLbs: result.weightLbs,
                      }
                    : item,
                ),
              );
              setTieBreakDrafts((current) => ({
                ...current,
                [selected.id]: String(selected.tieBreakOrder ?? ''),
              }));
              setSelected(null);
              setToast({
                message: 'Resultado actualizado correctamente.',
                tone: 'success',
              });
              router.refresh();
            })
            .catch((caught) => {
              setToast({
                message:
                  caught instanceof Error
                    ? caught.message
                    : 'No se pudo actualizar el resultado.',
                tone: 'error',
              });
            });
        }}
        onReject={() => {
          if (!selected) {
            setToast({
              message: 'No se pudo rechazar el logro seleccionado.',
              tone: 'error',
            });
            return;
          }
          void rejectAchievementAction(selected.id)
            .then(() => {
              setState((current) => current.filter((item) => item.id !== selected.id));
              setSelected(null);
              setToast({
                message: 'Resultado rechazado correctamente.',
                tone: 'success',
              });
              router.refresh();
            })
            .catch((caught) => {
              setToast({
                message:
                  caught instanceof Error
                    ? caught.message
                    : 'No se pudo rechazar el resultado.',
                tone: 'error',
              });
            });
        }}
      />
      {activeFilter === 'approved' ? (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.07)]">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs tracking-[0.2em] text-[color:var(--color-text-muted)] uppercase">
                Desempate manual
              </p>
              <h3 className="mt-3 text-xl font-semibold text-slate-950">
                Ordenar atletas empatados
              </h3>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[color:var(--color-text-muted)]">
              Usa este control solo cuando dos atletas quedan empatados en el mismo WOD y formato.
              Un número menor queda por encima; al guardar se recalculan los puntos del ranking.
            </p>
          </div>
          {approvedItems.length === 0 ? (
            <p className="mt-5 text-sm text-[color:var(--color-text-muted)]">
              No hay resultados aprobados para desempatar.
            </p>
          ) : (
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {approvedItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{item.athleteName}</p>
                      <p className="mt-1 text-xs tracking-[0.14em] text-[color:var(--color-text-muted)] uppercase">
                        {item.title} · {item.resultFormat}
                      </p>
                      <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">
                        Ranking actual: {item.rankPoints ?? 'sin puntos'} · Orden:{' '}
                        {item.tieBreakOrder ?? 'sin definir'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={tieBreakDrafts[item.id] ?? ''}
                        onChange={(event) =>
                          setTieBreakDrafts((current) => ({
                            ...current,
                            [item.id]: event.target.value,
                          }))
                        }
                        className="h-11 w-24 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-[color:var(--color-primary)]"
                        aria-label={`Orden de desempate para ${item.athleteName}`}
                      />
                      <button
                        type="button"
                        onClick={() => updateTieBreak(item)}
                        className="h-11 rounded-xl bg-slate-950 px-4 text-xs font-bold tracking-[0.16em] text-white uppercase transition hover:bg-[color:var(--color-primary)]"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
