import type { RankingEntry } from '@/types';
import { getScoreLabel, getStatusLabel } from '@/components/leaderboard/scoreFormat';

type LeaderboardTableProps = {
  entries: RankingEntry[];
};

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  const isEventMode = entries.some((entry) => entry.rankingView === 'event');

  return (
    <div className="hidden overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/95 shadow-[0_24px_70px_rgba(15,23,42,0.09)] lg:block">
      <table className="min-w-full">
        <thead className="bg-slate-950">
          <tr className="text-left text-xs tracking-[0.2em] text-white/70 uppercase">
            <th className="px-5 py-4">Rank</th>
            <th className="px-5 py-4">Atleta</th>
            <th className="px-5 py-4">Nivel</th>
            <th className="px-5 py-4">Formato</th>
            <th className="px-5 py-4">{isEventMode ? 'WODs' : 'Estado'}</th>
            <th className="px-5 py-4">{isEventMode ? 'Scores' : 'Resultado'}</th>
            {!isEventMode ? <th className="px-5 py-4">Intentos</th> : null}
            <th className="px-5 py-4">Puntos</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={`${entry.athleteId}-${entry.resultFormat}`}
              className={`border-t border-slate-200 text-sm text-slate-800 ${
                index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
              }`}
            >
              <td className="font-display px-5 py-4 text-3xl tracking-[0.08em]">
                {entry.rank}
              </td>
              <td className="px-5 py-4 font-semibold">{entry.athleteName}</td>
              <td className="px-5 py-4 text-slate-500 uppercase">
                {entry.level}
              </td>
              <td className="px-5 py-4 text-slate-500 uppercase">
                {entry.resultFormat}
              </td>
              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-3 py-2 text-xs font-bold uppercase ${
                    entry.completed
                      ? 'bg-emerald-100 text-emerald-800'
                      : entry.repsCompleted != null
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {getStatusLabel(entry)}
                </span>
              </td>
              <td className="px-5 py-4 font-semibold text-slate-950">
                {isEventMode ? entry.approvedAchievements : getScoreLabel(entry)}
              </td>
              {!isEventMode ? (
                <td className="px-5 py-4">{entry.approvedAchievements}</td>
              ) : null}
              <td className="px-5 py-4 font-semibold text-slate-950">
                {entry.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
