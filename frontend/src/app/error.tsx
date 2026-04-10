'use client';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="es">
      <body className="bg-[#08111b] text-white">
        <main className="mx-auto flex min-h-screen w-[min(720px,calc(100vw-2rem))] items-center justify-center py-20">
          <div className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-[#ffb085]">Error UI</p>
            <h1 className="mt-4 text-3xl font-semibold">Algo salió mal en esta pantalla.</h1>
            <p className="mt-4 text-sm leading-7 text-[#9eb0c3]">
              {error.message || 'Ocurrió un error inesperado en la aplicación.'}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 rounded-full bg-[#f75c03] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#08111b]"
            >
              Reintentar
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
