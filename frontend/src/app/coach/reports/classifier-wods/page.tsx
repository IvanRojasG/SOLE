import { CoachAreaLayout } from '@/components/coach/CoachAreaLayout';
import { CoachClassifierWodReportView } from '@/components/pages/CoachClassifierWodReportView';
import { requireSession } from '@/services/auth/session';
import { getClassifierWodReport } from '@/services/repository/reportRepository';

export default async function CoachClassifierWodReportPage() {
  await requireSession('coach', '/coach/reports/classifier-wods');
  const report = await getClassifierWodReport();

  return (
    <CoachAreaLayout
      activePath="/coach/reports/classifier-wods"
      title="Reporte WODs"
      description="Listado consolidado de WODs aprobados que cuentan para el clasificatorio."
    >
      <CoachClassifierWodReportView report={report} />
    </CoachAreaLayout>
  );
}
