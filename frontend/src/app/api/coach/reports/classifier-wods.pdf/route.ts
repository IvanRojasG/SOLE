import { backendFileRequest } from '@/services/api/backend';

export async function GET() {
  const response = await backendFileRequest('/reports/classifier-wods.pdf', {
    role: 'coach',
    nextTarget: '/coach/reports/classifier-wods',
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') ?? 'application/pdf',
      'Content-Disposition':
        response.headers.get('Content-Disposition') ??
        'attachment; filename="reporte-wods-clasificatorio.pdf"',
    },
  });
}
