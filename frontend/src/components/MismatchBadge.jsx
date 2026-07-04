import { useI18n } from "@/lib/i18n";

export const MismatchBadge = () => {
  const { t } = useI18n();
  return (
    <span
      title={t.mismatchTooltip}
      data-testid="contract-mismatch-badge"
      className="inline-flex items-center gap-1 rounded bg-[#FF007F] px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none text-white"
      style={{ letterSpacing: "0.02em" }}
    >
      ⚠️ {t.contractMismatch}
    </span>
  );
};
