type RejectButtonProps = {
  onClick: () => void;
};

export function RejectButton({ onClick }: RejectButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-rose-400 bg-rose-600 px-4 py-3 text-xs font-bold tracking-[0.18em] text-white uppercase shadow-[0_14px_32px_rgba(225,29,72,0.24)] transition hover:bg-rose-700"
    >
      Rechazar
    </button>
  );
}
