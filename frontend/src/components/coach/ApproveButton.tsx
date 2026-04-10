type ApproveButtonProps = {
  onClick: () => void;
};

export function ApproveButton({ onClick }: ApproveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-[color:var(--color-success)] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--color-ink)]"
    >
      Aprobar
    </button>
  );
}
