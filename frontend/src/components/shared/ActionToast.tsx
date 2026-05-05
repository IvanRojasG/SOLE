type ActionToastProps = {
  message: string;
  tone: 'success' | 'error';
  onDismiss: () => void;
};

export function ActionToast({ message, tone, onDismiss }: ActionToastProps) {
  if (!message) {
    return null;
  }

  const toneClasses =
    tone === 'success'
      ? 'border-emerald-200 bg-emerald-600 text-white shadow-[0_20px_48px_rgba(5,150,105,0.24)]'
      : 'border-rose-200 bg-rose-600 text-white shadow-[0_20px_48px_rgba(225,29,72,0.24)]';

  return (
    <div
      role="status"
      className={`fixed top-24 right-4 z-[70] flex max-w-sm items-center gap-4 rounded-2xl border px-5 py-4 text-sm font-semibold ${toneClasses}`}
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-full border border-white/30 px-2 py-1 text-[11px] font-bold tracking-[0.16em] text-white uppercase"
      >
        Cerrar
      </button>
    </div>
  );
}
