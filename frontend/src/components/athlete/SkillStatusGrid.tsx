'use client';

import type { BaselineSkill } from '@/types';

type SkillStatusGridProps = {
  skills: BaselineSkill[];
  locked: boolean;
  onChange: (skills: BaselineSkill[]) => void;
};

const statuses: BaselineSkill['status'][] = ['not_started', 'developing', 'consistent', 'mastered'];

export function SkillStatusGrid({ skills, locked, onChange }: SkillStatusGridProps) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--color-primary-soft)]">
        Skill status
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {skills.map((skill) => (
          <div key={skill.id} className="rounded-[1.5rem] border border-white/10 bg-[color:var(--color-surface)] p-4">
            <p className="text-base font-semibold text-white">{skill.name}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={locked}
                  onClick={() =>
                    onChange(
                      skills.map((entry) =>
                        entry.id === skill.id
                          ? {
                              ...entry,
                              status,
                            }
                          : entry,
                      ),
                    )
                  }
                  className={`rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                    skill.status === status
                      ? 'bg-[color:var(--color-secondary)] text-[color:var(--color-ink)]'
                      : 'border border-white/10 bg-white/5 text-white'
                  } disabled:opacity-50`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
