'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ChallengeEditorForm } from '@/components/coach/ChallengeEditorForm';
import { ChallengeManagementGrid } from '@/components/coach/ChallengeManagementGrid';
import { ActionToast } from '@/components/shared/ActionToast';
import {
  createChallengeAction,
  updateChallengeAction,
} from '@/services/actions';
import type { ChallengeManagementItem } from '@/types';

type CoachChallengesViewProps = {
  items: ChallengeManagementItem[];
};

export function CoachChallengesView({ items }: CoachChallengesViewProps) {
  const [localItems, setLocalItems] = useState(items);
  const [selected, setSelected] = useState<ChallengeManagementItem | null>(
    items[0] ?? null,
  );
  const [toast, setToast] = useState<{
    message: string;
    tone: 'success' | 'error';
  } | null>(null);
  const router = useRouter();

  const createDraftChallenge = (): ChallengeManagementItem => ({
    id: `draft-${Date.now()}`,
    title: 'Nuevo WOD',
    category: 'custom_metcon_reps',
    summary: 'Define el objetivo y estándares del WOD.',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    youtubeUrl: '',
    totalReps: 0,
    isActive: true,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr] lg:gap-8">
      {toast ? (
        <ActionToast
          message={toast.message}
          tone={toast.tone}
          onDismiss={() => setToast(null)}
        />
      ) : null}
      <ChallengeManagementGrid
        items={localItems}
        onEdit={setSelected}
        onCreate={() => {
          const draft = createDraftChallenge();
          setSelected(draft);
        }}
      />
      <ChallengeEditorForm
        item={selected}
        onSave={async (item) => {
          try {
            if (item.id.startsWith('draft-')) {
              const created = await createChallengeAction(item);
              setLocalItems((current) => [created.item, ...current]);
              setSelected(created.item);
              setToast({
                message: 'Reto creado correctamente.',
                tone: 'success',
              });
            } else {
              await updateChallengeAction(item);
              setLocalItems((current) =>
                current.map((entry) => (entry.id === item.id ? item : entry)),
              );
              setSelected(item);
              setToast({
                message: 'Reto actualizado correctamente.',
                tone: 'success',
              });
            }

            router.refresh();
          } catch (caught) {
            setToast({
              message:
                caught instanceof Error
                  ? caught.message
                  : 'No se pudo guardar el reto.',
              tone: 'error',
            });
          }
        }}
      />
    </div>
  );
}
