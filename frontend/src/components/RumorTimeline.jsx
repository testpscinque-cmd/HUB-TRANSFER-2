import { CalendarDays, Radio, FileText, ShieldCheck, Award, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { stageConfig, stageLabel } from "@/lib/stages";
import { dateTime } from "@/lib/time";
import { contractMismatch } from "@/lib/consistency";
import { MismatchBadge } from "@/components/MismatchBadge";
import { Thermometer } from "@/components/Thermometer";

const ts = (r) => new Date(r.logged_at || r.date_logged).getTime();

export const RumorTimeline = ({ rumors, profile }) => {
  const { t, lang } = useI18n();
  if (!rumors.length) {
    return <p className="py-10 text-center text-sm text-slate-400">{t.noRumors}</p>;
  }
  // Source guarantee: the earliest logged rumor = who broke the story first.
  const scoop = [...rumors].sort((a, b) => ts(a) - ts(b))[0];

  return (
    <div>
      {/* Source guarantee banner — solves "who reported it first" credit disputes */}
      {scoop && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#05A845]/30 bg-[#05A845]/5 p-3" data-testid="scoop-guarantee">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#05A845]" />
          <div className="text-sm">
            <span className="font-heading text-[10px] font-black uppercase tracking-widest text-[#05A845]">{t.sourceGuarantee}</span>
            <p className="text-slate-700">
              {t.firstReportedBy} <span className="font-bold text-slate-900">{scoop.source_name}</span> {t.on}{" "}
              <span className="font-mono text-xs text-slate-500">{dateTime(scoop.logged_at || scoop.date_logged, lang)}</span>
            </p>
          </div>
        </div>
      )}

      <div className="pl-1">
        {rumors.map((r, i) => {
          const cfg = stageConfig[r.stage] || stageConfig["Interesse Iniziale"];
          const isScoop = scoop && r.id === scoop.id;
          return (
            <div
              key={r.id}
              className="tm-fade-up relative border-l-2 border-slate-100 pb-8 pl-10 last:border-transparent last:pb-0"
              style={{ animationDelay: `${i * 55}ms` }}
              data-testid={`timeline-node-${r.id}`}
            >
              <span className="absolute left-[-15px] top-0 rounded-full bg-white p-0.5 ring-4 ring-white">
                <Thermometer stage={r.stage} size={24} lang={lang} />
              </span>
              <div className={`rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-sm ${isScoop ? "border-[#05A845]/40 bg-[#05A845]/5" : "border-slate-200 bg-slate-50/60 hover:border-[#05A845]/40"}`}>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}>
                    {stageLabel(r.stage, lang)}
                  </span>
                  {isScoop && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#05A845] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white" data-testid={`scoop-badge-${r.id}`}>
                      <Award size={10} /> {t.scoop}
                    </span>
                  )}
                  {contractMismatch(r.deal_formula, r.evolution_description, profile?.contract_expiry, profile?.role) && <MismatchBadge />}
                  <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                    <CalendarDays size={12} /> {dateTime(r.logged_at || r.date_logged, lang)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{r.evolution_description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-3 text-[11px]">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Radio size={12} className="text-blue-500" />
                    <span className="font-bold text-slate-900">{r.source_name}</span>
                  </span>
                  {r.deal_formula && (
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <FileText size={12} className="text-[#05A845]" /> {r.deal_formula}
                    </span>
                  )}
                  {r.external_link_url && (
                    <a
                      href={r.external_link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`rumor-source-link-${r.id}`}
                      title={r.external_link_url}
                      className="ml-auto flex max-w-[55%] items-center gap-1 font-mono text-[10px] font-semibold text-[#05A845] hover:underline"
                    >
                      <ExternalLink size={11} className="shrink-0" />
                      <span className="truncate">{r.external_link_url}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
