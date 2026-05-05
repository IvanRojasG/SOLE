import type { RankingEntry } from '@/types';

type LeaderboardTableProps = {
  entries: RankingEntry[];
};

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-[2rem] border border-slate-200 bg-white/95 shadow-[0_24px_70px_rgba(15,23,42,0.09)] lg:block">
      <table className="min-w-full">
        <thead className="bg-slate-950">
          <tr className="text-left text-xs tracking-[0.2em] text-white/70 uppercase">
            <th className="px-5 py-4">Rank</th>
            <th className="px-5 py-4">Atleta</th>
            <th className="px-5 py-4">Nivel</th>
            <th className="px-5 py-4">Formato</th>
            <th className="px-5 py-4">Puntos</th>
            <th className="px-5 py-4">Logros</th>
            <th className="px-5 py-4">Delta</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={`${entry.athleteId}-${entry.resultFormat}`}
              className={`border-t border-slate-200 text-sm text-slate-800 ${
                index % 2 === 0 ? 'bg-white' : 'bg-sky-50/70'
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
              <td className="px-5 py-4 font-semibold text-slate-950">
                {entry.points}
              </td>
              <td className="px-5 py-4">{entry.approvedAchievements}</td>
              <td
                className={`px-5 py-4 ${entry.delta >= 0 ? 'text-[color:var(--color-success)]' : 'text-[color:var(--color-danger)]'}`}
              >
                {entry.delta >= 0 ? `+${entry.delta}` : entry.delta}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
