import { CalendarDays, Radio, FileText } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { stageConfig, stageLabel } from "@/lib/stages";
import { dateTime } from "@/lib/time";

export const RumorTimeline = ({ rumors }) => {
  const { t, lang } = useI18n();
  if (!rumors.length) {
    return <p className="py-10 text-center text-sm text-gray-500">{t.noRumors}</p>;
  }
  return (
    <div className="pl-1">
      {rumors.map((r, i) => {
        const cfg = stageConfig[r.stage] || stageConfig["Interesse Iniziale"];
        return (
          <div
            key={r.id}
            className="tm-fade-up relative border-l border-white/10 pb-8 pl-8 last:border-transparent last:pb-0"
            style={{ animationDelay: `${i * 55}ms` }}
            data-testid={`timeline-node-${r.id}`}
          >
            <span className={`absolute left-[-6px] top-1 h-[11px] w-[11px] rounded-full ring-4 ring-[#121620] ${cfg.dot}`} />
            <div className="rounded-xl border border-white/5 bg-[#1B2432] p-4 transition-all hover:-translate-y-1 hover:border-white/20">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}>
                  {stageLabel(r.stage, lang)}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
                  <CalendarDays size={12} /> {dateTime(r.logged_at || r.date_logged, lang)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-200">{r.evolution_description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-white/5 pt-3 text-[11px]">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <Radio size={12} className="text-[#00E5FF]" />
                  <span className="font-bold text-white">{r.source_name}</span>
                </span>
                {r.deal_formula && (
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <FileText size={12} className="text-[#39FF14]" /> {r.deal_formula}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
