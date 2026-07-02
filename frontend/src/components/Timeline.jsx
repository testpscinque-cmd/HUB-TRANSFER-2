import { CalendarDays, Radio, FileText, History } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { stageConfig, stageLabel } from "@/lib/stages";

const fmtDate = (d, lang) => {
  try {
    return new Date(d).toLocaleDateString(lang === "it" ? "it-IT" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
};

export const Timeline = ({ profile, rumors }) => {
  const { t, lang } = useI18n();

  if (!profile) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#121620] p-10 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-[#1B2432]">
          <History size={28} className="text-gray-500" />
        </div>
        <h3 className="font-heading text-xl font-black uppercase text-white">{t.selectPrompt}</h3>
        <p className="mt-2 max-w-sm text-sm text-gray-500">{t.selectSub}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/10 bg-[#121620]" data-testid="timeline-panel">
      <div className="border-b border-white/5 px-6 py-4">
        <h2 className="font-heading text-2xl font-black uppercase tracking-tight text-white">
          {t.timeline}
        </h2>
        <p className="text-xs uppercase tracking-widest text-gray-500">
          {profile.full_name} · {t.timelineSub}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {rumors.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">{t.noRumors}</p>
        ) : (
          <div className="pl-1">
            {rumors.map((r, i) => {
              const cfg = stageConfig[r.stage] || stageConfig["Interesse Iniziale"];
              return (
                <div
                  key={r.id}
                  className="tm-fade-up relative border-l border-white/10 pb-8 pl-8 last:border-transparent last:pb-0"
                  style={{ animationDelay: `${i * 60}ms` }}
                  data-testid={`timeline-node-${r.id}`}
                >
                  <span
                    className={`absolute left-[-6px] top-1 h-[11px] w-[11px] rounded-full ring-4 ring-[#121620] ${cfg.dot}`}
                  />
                  <div className="rounded-xl border border-white/5 bg-[#1B2432] p-4 transition-all hover:-translate-y-1 hover:border-white/20">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}
                      >
                        {stageLabel(r.stage, lang)}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-gray-500">
                        <CalendarDays size={12} /> {fmtDate(r.date_logged, lang)}
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
                          <FileText size={12} className="text-[#39FF14]" />
                          {r.deal_formula}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
