type RejectButtonProps = {
  onClick: () => void;
};

export function RejectButton({ onClick }: RejectButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-[color:var(--color-danger)] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white"
    >
      Rechazar
    </button>
  );
}
