import type { RankingEntry } from '@/types';

type LeaderboardTableProps = {
  entries: RankingEntry[];
};

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-[2rem] border border-white/10 lg:block">
      <table className="min-w-full bg-[color:var(--color-surface)]">
        <thead className="bg-white/5">
          <tr className="text-left text-xs uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
            <th className="px-5 py-4">Rank</th>
            <th className="px-5 py-4">Atleta</th>
            <th className="px-5 py-4">Nivel</th>
            <th className="px-5 py-4">Puntos</th>
            <th className="px-5 py-4">Asistencia</th>
            <th className="px-5 py-4">Logros</th>
            <th className="px-5 py-4">Delta</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.athleteId} className="border-t border-white/6 text-sm text-white">
              <td className="px-5 py-4 font-display text-3xl tracking-[0.08em]">{entry.rank}</td>
              <td className="px-5 py-4 font-semibold">{entry.athleteName}</td>
              <td className="px-5 py-4 uppercase text-[color:var(--color-text-muted)]">{entry.level}</td>
              <td className="px-5 py-4">{entry.points}</td>
              <td className="px-5 py-4">{entry.attendanceRate}%</td>
              <td className="px-5 py-4">{entry.approvedAchievements}</td>
              <td className={`px-5 py-4 ${entry.delta >= 0 ? 'text-[color:var(--color-success)]' : 'text-[color:var(--color-danger)]'}`}>
                {entry.delta >= 0 ? `+${entry.delta}` : entry.delta}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
