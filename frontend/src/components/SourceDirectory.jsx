import { Signal } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const scoreColor = (s) =>
  s >= 85 ? "#39FF14" : s >= 65 ? "#00E5FF" : s >= 45 ? "#FBBF24" : "#FF007F";

export const SourceDirectory = ({ sources, compact = false }) => {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-white/10 bg-[#121620]" data-testid="source-directory">
      <div className="border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <Signal size={16} className="text-[#00E5FF]" />
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">{t.sourcesTitle}</h3>
        </div>
        {!compact && <p className="mt-0.5 text-[11px] text-gray-500">{t.sourcesSub}</p>}
      </div>
      <div className={compact ? "p-3" : "grid gap-x-8 gap-y-4 p-5 sm:grid-cols-2"}>
        {sources.map((s) => (
          <div key={s.id} className={compact ? "mb-3 last:mb-0" : ""} data-testid={`source-${s.id}`}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-bold text-white">{s.source_name}</span>
              <span className="font-mono text-xs font-bold" style={{ color: scoreColor(s.reliability_score) }}>
                {s.reliability_score}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full transition-all" style={{ width: `${s.reliability_score}%`, backgroundColor: scoreColor(s.reliability_score) }} />
            </div>
            {s.notes && <p className="mt-1 text-[11px] leading-snug text-gray-500">{s.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
