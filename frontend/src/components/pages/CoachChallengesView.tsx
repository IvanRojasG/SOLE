'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ChallengeEditorForm } from '@/components/coach/ChallengeEditorForm';
import { ChallengeManagementGrid } from '@/components/coach/ChallengeManagementGrid';
import { createChallengeAction, updateChallengeAction } from '@/services/actions';
import type { ChallengeManagementItem } from '@/types';

type CoachChallengesViewProps = {
  items: ChallengeManagementItem[];
};

export function CoachChallengesView({ items }: CoachChallengesViewProps) {
  const [localItems, setLocalItems] = useState(items);
  const [selected, setSelected] = useState<ChallengeManagementItem | null>(items[0] ?? null);
  const router = useRouter();

  const createDraftChallenge = (): ChallengeManagementItem => ({
    id: `draft-${Date.now()}`,
    title: 'Nuevo challenge',
    category: 'consistency',
    points: 5,
    difficulty: 'starter',
    summary: 'Define la meta, el alcance y la lógica visual del reto.',
    windowLabel: 'Todo el mes',
    isActive: true,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr] lg:gap-8">
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
          if (item.id.startsWith('draft-')) {
            await createChallengeAction(item);
          } else {
            await updateChallengeAction(item);
          }

          if (item.id.startsWith('draft-')) {
            const persistedLikeItem: ChallengeManagementItem = {
              ...item,
              id: `local-${Date.now()}`,
            };
            setLocalItems((current) => [persistedLikeItem, ...current]);
            setSelected(persistedLikeItem);
          } else {
            setLocalItems((current) => current.map((entry) => (entry.id === item.id ? item : entry)));
            setSelected(item);
          }

          router.refresh();
        }}
      />
    </div>
  );
}
