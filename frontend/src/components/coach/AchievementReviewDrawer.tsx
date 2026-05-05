'use client';

import { useEffect, useState } from 'react';

import type { PendingAchievementReview, ResultFormat } from '@/types';

import { ApproveButton } from './ApproveButton';
import { RejectButton } from './RejectButton';

type AchievementReviewDrawerProps = {
  item: PendingAchievementReview | null;
  open: boolean;
  onApprove: (result: {
    completed: boolean;
    resultFormat: ResultFormat;
    timeSeconds: number | null;
    repsCompleted: number | null;
    weightLbs: number | null;
  }) => void;
  onSave: (result: {
    completed: boolean;
    resultFormat: ResultFormat;
    timeSeconds: number | null;
    repsCompleted: number | null;
    weightLbs: number | null;
  }) => void;
  onReject: () => void;
  onClose: () => void;
};

export function AchievementReviewDrawer({
  item,
  open,
  onApprove,
  onSave,
  onReject,
  onClose,
}: AchievementReviewDrawerProps) {
  const [completed, setCompleted] = useState(false);
  const [resultFormat, setResultFormat] = useState<ResultFormat>('scaled');
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [repsCompleted, setRepsCompleted] = useState(0);
  const [weightLbs, setWeightLbs] = useState(0);

  useEffect(() => {
    if (!item) {
      return;
    }

    setCompleted(item.completed);
    setResultFormat(item.resultFormat);
    setTimeSeconds(item.timeSeconds ?? 0);
    setRepsCompleted(item.repsCompleted ?? 0);
    setWeightLbs(item.weightLbs ?? 0);
  }, [item]);

  const getResult = () => ({
    completed,
    resultFormat,
    timeSeconds: completed ? timeSeconds : null,
    repsCompleted: completed ? repsCompleted || null : repsCompleted,
    weightLbs: weightLbs > 0 ? weightLbs : null,
  });

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-[92vw] max-w-md border-l border-white/10 bg-[color:var(--color-surface)] p-6 shadow-[var(--shadow-lift)] transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {item ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.22em] text-[color:var(--color-primary-soft)] uppercase">
                  Review
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  {item.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 px-3 py-2 text-xs tracking-[0.18em] text-white uppercase"
              >
                Cerrar
              </button>
            </div>
            <div className="mt-8 space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 p-4">
                <p className="text-[11px] tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
                  Atleta
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {item.athleteName}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 p-4">
                <p className="text-[11px] tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
                  Notas
                </p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-muted)]">
                  {item.notes}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 p-4">
                <p className="text-[11px] tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
                  Resultado WOD
                </p>
                <div className="mt-4 grid gap-4">
                  <label className="block">
                    <span className="text-[11px] tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
                      Formato
                    </span>
                    <select
                      value={resultFormat}
                      onChange={(event) =>
                        setResultFormat(event.target.value as ResultFormat)
                      }
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
                    >
                      <option value="scaled">Scaled</option>
                      <option value="rx">RX</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[11px] tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
                      Estado
                    </span>
                    <select
                      value={completed ? 'completed' : 'partial'}
                      onChange={(event) =>
                        setCompleted(event.target.value === 'completed')
                      }
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
                    >
                      <option value="completed">Completado</option>
                      <option value="partial">No completado</option>
                    </select>
                  </label>
                  {completed ? (
                    <label className="block">
                      <span className="text-[11px] tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
                        Tiempo total (segundos)
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={timeSeconds || ''}
                        onChange={(event) =>
                          setTimeSeconds(Number(event.target.value))
                        }
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
                      />
                    </label>
                  ) : null}
                  <label className="block">
                    <span className="text-[11px] tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
                      Repeticiones
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={repsCompleted || ''}
                      onChange={(event) =>
                        setRepsCompleted(Number(event.target.value))
                      }
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] tracking-[0.18em] text-[color:var(--color-text-muted)] uppercase">
                      Peso Power Lifting (lb)
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={weightLbs || ''}
                      onChange={(event) =>
                        setWeightLbs(Number(event.target.value))
                      }
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[color:var(--color-surface)] px-4 py-3 text-sm text-white outline-none"
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              {item.status === 'approved' ? (
                <button
                  type="button"
                  onClick={() => onSave(getResult())}
                  className="rounded-full bg-[color:var(--color-primary)] px-5 py-3 text-xs font-bold tracking-[0.18em] text-[color:var(--color-ink)] uppercase"
                >
                  Guardar resultado
                </button>
              ) : (
                <>
                  <ApproveButton
                    onClick={() => onApprove(getResult())}
                  />
                  <RejectButton onClick={onReject} />
                </>
              )}
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}
