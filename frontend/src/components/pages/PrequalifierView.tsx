'use client';

import type { RankingEntry } from '@/types';

type PrequalifierViewProps = {
  entries: RankingEntry[];
};

type DivisionBoardProps = {
  title: string;
  label: string;
  entries: RankingEntry[];
  tone: 'rx' | 'scaled';
  delayOffset: number;
};

const rankStyles = [
  'from-amber-300 via-orange-400 to-rose-500 text-slate-950',
  'from-cyan-300 via-sky-400 to-blue-600 text-slate-950',
  'from-lime-300 via-emerald-400 to-teal-600 text-slate-950',
  'from-fuchsia-400 via-violet-500 to-indigo-600 text-white',
  'from-rose-300 via-pink-500 to-fuchsia-600 text-white',
  'from-teal-200 via-cyan-400 to-blue-500 text-slate-950',
  'from-yellow-200 via-lime-300 to-emerald-500 text-slate-950',
  'from-orange-300 via-red-400 to-pink-500 text-slate-950',
  'from-indigo-300 via-blue-500 to-cyan-500 text-white',
  'from-emerald-200 via-teal-400 to-slate-900 text-white',
];

const medals = ['01', '02', '03'];

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
      <path d="M6 5H3v2a4 4 0 0 0 4 4" />
      <path d="M18 5h3v2a4 4 0 0 1-4 4" />
      <path d="M12 12v5" />
      <path d="M8 21h8" />
      <path d="M9 17h6" />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h4l2-6 4 12 2-6h6" />
    </svg>
  );
}

function getDivisionEntries(entries: RankingEntry[], level: 'rx' | 'scaled') {
  return entries
    .filter((entry) => entry.level === level)
    .slice(0, 10)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
}

function DivisionBoard({ title, label, entries, tone, delayOffset }: DivisionBoardProps) {
  const topTen = entries;
  const podium = topTen.slice(0, 3);
  const chasePack = topTen.slice(3);
  const expectedWods = Math.max(...topTen.map((entry) => entry.wodsExpected ?? entry.wodsScored ?? 0), 0);
  const panelAccent =
    tone === 'rx'
      ? 'from-cyan-400/24 via-blue-500/14 to-fuchsia-500/18'
      : 'from-amber-300/22 via-lime-300/12 to-emerald-400/20';

  return (
    <section className="relative border-t border-white/10 py-10 md:py-14">
      <div className={`absolute inset-0 bg-gradient-to-br ${panelAccent}`} />
      <div className="relative mx-auto grid w-full max-w-[1440px] gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
        <div className="flex flex-col justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">{label}</p>
            <h2 className="font-display mt-4 text-5xl uppercase leading-[0.9] tracking-[0.04em] text-white sm:text-6xl">
              {title}
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-200 md:text-base">
              Top 10 por consistencia de WODs y menor puntaje acumulado dentro de la categoria.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ['Atletas', topTen.length.toString()],
              ['WODs base', expectedWods.toString()],
              ['Ranking', tone.toUpperCase()],
            ].map(([statLabel, value]) => (
              <div
                key={statLabel}
                className="border border-white/15 bg-white/10 p-4 shadow-[0_18px_46px_rgba(0,0,0,0.22)] backdrop-blur-xl"
              >
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">
                  <PulseIcon />
                  {statLabel}
                </p>
                <p className="font-display mt-2 text-4xl uppercase tracking-[0.06em] text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {topTen.length === 0 ? (
          <div className="grid min-h-64 place-items-center border border-dashed border-white/25 bg-white/10 p-8 text-center text-sm font-bold uppercase tracking-[0.18em] text-slate-200">
            Sin atletas {tone.toUpperCase()} clasificados todavia
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="grid gap-4">
              {podium.map((entry, index) => {
                const style = rankStyles[index];
                const scored = entry.wodsScored ?? 0;
                const expected = entry.wodsExpected ?? scored;

                return (
                  <article
                    key={entry.athleteId}
                    className={`prequal-reveal border border-white/20 bg-gradient-to-r ${style} p-5 shadow-[0_28px_90px_rgba(0,0,0,0.34)]`}
                    style={{ animationDelay: `${delayOffset + index * 160}ms` }}
                  >
                    <div className="grid gap-4 sm:grid-cols-[6rem_1fr] sm:items-center">
                      <div className="grid gap-2">
                        <TrophyIcon />
                        <div className="font-display text-6xl leading-none tracking-[0.06em]">{medals[index]}</div>
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold leading-tight md:text-4xl">{entry.athleteName}</h3>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] opacity-80">
                          {entry.level} · {entry.points} puntos · {scored}/{expected} WODs
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="grid gap-3">
              {chasePack.map((entry, index) => {
                const absoluteIndex = index + 3;
                const scored = entry.wodsScored ?? 0;
                const expected = entry.wodsExpected ?? scored;

                return (
                  <article
                    key={entry.athleteId}
                    className="prequal-slide grid gap-4 border border-white/12 bg-white/[0.92] p-4 text-slate-950 shadow-[0_18px_48px_rgba(0,0,0,0.18)] sm:grid-cols-[5rem_1fr_auto] sm:items-center md:p-5"
                    style={{ animationDelay: `${delayOffset + 420 + index * 100}ms` }}
                  >
                    <div
                      className={`font-display bg-gradient-to-r ${rankStyles[absoluteIndex]} px-3 py-2 text-center text-3xl tracking-[0.06em]`}
                    >
                      <span className="inline-flex items-center justify-center gap-2">
                        <PulseIcon />
                        {entry.rank}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-950">{entry.athleteName}</h3>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                        {entry.level} · {entry.resultFormat}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <span className="bg-slate-950 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
                        {entry.points} pts
                      </span>
                      <span className="border border-slate-300 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-700">
                        {scored}/{expected} WODs
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function PrequalifierView({ entries }: PrequalifierViewProps) {
  const rxEntries = getDivisionEntries(entries, 'rx');
  const scaledEntries = getDivisionEntries(entries, 'scaled');
  const expectedWods = Math.max(...entries.map((entry) => entry.wodsExpected ?? entry.wodsScored ?? 0), 0);

  return (
    <div className="overflow-hidden bg-[#07101f] text-white">
      <section className="relative pb-10 pt-8 md:pt-12">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,92,255,0.26),transparent_32%),linear-gradient(240deg,rgba(20,184,166,0.28),transparent_28%),linear-gradient(180deg,#07101f_0%,#0e2652_58%,#081424_100%)]" />
        <div className="prequal-scan absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid w-full max-w-[1440px] gap-8 px-5 sm:px-8 lg:px-12">
          <div className="max-w-5xl">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">
                Burn the Ships
              </p>
              <h1 className="font-display mt-5 max-w-4xl text-6xl uppercase leading-[0.88] tracking-[0.04em] text-white sm:text-7xl lg:text-8xl">
                Preclasificatorio RX + Scaled
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
                Dos tableros independientes. Los nombres entran por consistencia: WODs completos primero, menor
                puntaje acumulado despues.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ['RX', rxEntries.length.toString()],
                ['Scaled', scaledEntries.length.toString()],
                ['WODs base', expectedWods.toString()],
              ].map(([label, value]) => (
                <div key={label} className="border border-white/15 bg-white/10 p-4 shadow-[0_18px_46px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                  <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">
                    <PulseIcon />
                    {label}
                  </p>
                  <p className="font-display mt-2 text-4xl uppercase tracking-[0.06em] text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <DivisionBoard title="Top 10 RX" label="Categoria RX" entries={rxEntries} tone="rx" delayOffset={0} />
      <DivisionBoard
        title="Top 10 Scaled"
        label="Categoria Scaled"
        entries={scaledEntries}
        tone="scaled"
        delayOffset={500}
      />
    </div>
  );
}
