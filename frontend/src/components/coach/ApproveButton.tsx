type ApproveButtonProps = {
  onClick: () => void;
};

export function ApproveButton({ onClick }: ApproveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-emerald-400 bg-emerald-600 px-4 py-3 text-xs font-bold tracking-[0.18em] text-white uppercase shadow-[0_14px_32px_rgba(5,150,105,0.24)] transition hover:bg-emerald-700"
    >
      Aprobar
    </button>
  );
}
