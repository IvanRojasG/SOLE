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

export function CoachAchievementsView({ items }: CoachAchievementsViewProps) {
  const [state, setState] = useState(items);
  const [selected, setSelected] = useState<PendingAchievementReview | null>(
    null,
  );
  const [toast, setToast] = useState<{
    message: string;
    tone: 'success' | 'error';
  } | null>(null);
  const router = useRouter();

  const hasItems = useMemo(() => state.length > 0, [state]);

  return (
    <div className="space-y-6">
      {toast ? (
        <ActionToast
          message={toast.message}
          tone={toast.tone}
          onDismiss={() => setToast(null)}
        />
      ) : null}
      {!hasItems ? (
        <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-[color:var(--color-text-muted)]">
          No hay resultados de WOD para revisar.
        </div>
      ) : (
        <PendingAchievementsTable items={state} onSelect={setSelected} />
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
              setState((current) =>
                current.filter((item) => item.id !== selected.id),
              );
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
              setState((current) =>
                current.filter((item) => item.id !== selected.id),
              );
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
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
        <p className="text-xs tracking-[0.2em] text-[color:var(--color-text-muted)] uppercase">
          Desempate manual
        </p>
        <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-muted)]">
          Para mover un atleta empatado, abre el resultado aprobado, asigna un
          orden de desempate desde backend con el control temporal del listado.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {state
            .filter((item) => item.status === 'approved')
            .map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  const nextOrder = (item.tieBreakOrder ?? 0) + 1;
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
                }}
                className="rounded-2xl border border-white/10 px-4 py-3 text-left text-sm text-white"
              >
                {item.athleteName} · orden {item.tieBreakOrder ?? 'sin definir'}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
