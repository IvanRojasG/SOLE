import { ClassifierWodReportActions } from '@/components/coach/ClassifierWodReportActions';
import type { ClassifierWodReport } from '@/types';

type CoachClassifierWodReportViewProps = {
  report: ClassifierWodReport;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-CR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

function formatGeneratedAt(value: string): string {
  return new Intl.DateTimeFormat('es-CR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatResultFormat(value: ClassifierWodReport['rows'][number]['resultFormat']) {
  return value === 'rx' ? 'RX' : 'Escalado';
}

export function CoachClassifierWodReportView({
  report,
}: CoachClassifierWodReportViewProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--color-primary)] uppercase">
            Reporte imprimible
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            WODs que cuentan para clasificatorio
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {report.totalRows} registros · Generado {formatGeneratedAt(report.generatedAt)}
          </p>
        </div>
        <ClassifierWodReportActions />
      </div>

      {report.rows.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          No hay WODs clasificatorios registrados.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_20px_54px_rgba(15,23,42,0.08)]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-950 text-xs tracking-[0.16em] text-white/75 uppercase">
                <tr>
                  <th className="px-4 py-3">Atleta</th>
                  <th className="px-4 py-3">Nivel</th>
                  <th className="px-4 py-3">WOD</th>
                  <th className="px-4 py-3">Cierre</th>
                  <th className="px-4 py-3">Formato</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Tie-break</th>
                  <th className="px-4 py-3">Puntos</th>
                  <th className="px-4 py-3">Registro</th>
                </tr>
              </thead>
              <tbody>
                {report.rows.map((row) => (
                  <tr
                    key={`${row.athleteId}-${row.challengeId}-${row.resultFormat}-${row.achievementDate}`}
                    className="border-t border-slate-200 text-slate-800"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-950">
                      {row.athleteName}
                    </td>
                    <td className="px-4 py-3 uppercase">{row.athleteLevel}</td>
                    <td className="px-4 py-3">{row.challengeTitle}</td>
                    <td className="px-4 py-3">{formatDate(row.challengeEndDate)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
                        {formatResultFormat(row.resultFormat)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold">{row.scoreLabel}</td>
                    <td className="px-4 py-3">{row.tieBreakOrder ?? '-'}</td>
                    <td className="px-4 py-3 font-semibold">{row.rankPoints}</td>
                    <td className="px-4 py-3">{formatDate(row.achievementDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
