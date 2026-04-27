'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { BaselineEntryBoard } from '@/components/athlete/BaselineEntryBoard';
import { BaselineSummaryCard } from '@/components/athlete/BaselineSummaryCard';
import { LockBaselineButton } from '@/components/athlete/LockBaselineButton';
import { lockBaselineAction, saveBaselineAction } from '@/services/actions';
import type { AthleteBaseline } from '@/types';

type AthleteBaselineViewProps = {
  baseline: AthleteBaseline;
};

export function AthleteBaselineView({ baseline }: AthleteBaselineViewProps) {
  const [baselineState, setBaselineState] = useState(baseline);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <BaselineEntryBoard
          entries={baselineState.entries}
          locked={baselineState.locked}
          onChange={(entries) => setBaselineState((current) => ({ ...current, entries }))}
        />
      </div>
      <div className="space-y-6">
        <BaselineSummaryCard baseline={baselineState} />
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm leading-7 text-[color:var(--color-text-muted)]">
            Este baseline se sincroniza con backend. Puedes guardar ajustes y luego bloquearlo para
            cerrar la línea base del atleta.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={baselineState.locked || isPending}
              onClick={() =>
                startTransition(async () => {
                  await saveBaselineAction(baselineState);
                  router.refresh();
                })
              }
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white disabled:opacity-50"
            >
              {isPending ? 'Guardando...' : 'Guardar baseline'}
            </button>
            <LockBaselineButton
              locked={baselineState.locked || isPending}
              onLock={() =>
                startTransition(async () => {
                  await saveBaselineAction(baselineState);
                  await lockBaselineAction();
                  setBaselineState((current) => ({ ...current, locked: true }));
                  router.refresh();
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
