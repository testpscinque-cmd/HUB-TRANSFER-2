import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const MismatchBadge = () => {
  const { t } = useI18n();
  return (
    <span
      title={t.mismatchTooltip}
      data-testid="contract-mismatch-badge"
      className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none text-red-600"
      style={{ letterSpacing: "0.02em" }}
    >
      <AlertTriangle size={11} /> {t.contractMismatch}
    </span>
  );
};
