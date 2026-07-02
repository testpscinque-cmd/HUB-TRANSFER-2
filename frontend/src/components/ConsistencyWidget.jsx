import { ShieldAlert, ShieldCheck, Loader2, Sparkles, Lightbulb } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const severityStyle = {
  high: { border: "border-[#FF007F]/60", glow: "shadow-[0_0_18px_rgba(255,0,127,0.25)]", text: "text-[#FF007F]", pulse: "tm-pulse-magenta" },
  medium: { border: "border-orange-500/50", glow: "", text: "text-orange-400", pulse: "" },
  low: { border: "border-yellow-500/40", glow: "", text: "text-yellow-400", pulse: "" },
};

export const ConsistencyWidget = ({ result, checking }) => {
  const { t, lang } = useI18n();
  let body;
  if (checking) {
    body = (
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#1B2432] p-4">
        <Loader2 size={18} className="animate-spin text-[#00E5FF]" />
        <span className="text-sm text-gray-300">{t.scanning}</span>
      </div>
    );
  } else if (!result) {
    return null;
  } else if (result.has_contradiction) {
    const s = severityStyle[result.severity] || severityStyle.medium;
    body = (
      <div className={`rounded-lg border ${s.border} ${s.glow} ${s.pulse} bg-[#1B2432] p-4`} data-testid="consistency-warning">
        <div className={`mb-2 flex items-center gap-2 font-heading text-sm font-black uppercase tracking-wider ${s.text}`}>
          <ShieldAlert size={18} /> {result.severity}
        </div>
        <p className="text-sm leading-relaxed text-white">{lang === "it" ? result.message_it : result.message_en}</p>
        {(lang === "it" ? result.advice_it : result.advice_en) && (
          <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
            <Lightbulb size={14} className="mt-0.5 shrink-0 text-[#39FF14]" />
            <p className="text-xs leading-relaxed text-gray-300">
              <span className="font-bold text-[#39FF14]">{t.advice}: </span>
              {lang === "it" ? result.advice_it : result.advice_en}
            </p>
          </div>
        )}
      </div>
    );
  } else {
    body = (
      <div className="rounded-lg border border-[#39FF14]/40 bg-[#39FF14]/5 p-4 shadow-[0_0_15px_rgba(57,255,20,0.1)]" data-testid="consistency-ok">
        <div className="mb-2 flex items-center gap-2 font-heading text-sm font-black uppercase tracking-wider text-[#39FF14]">
          <ShieldCheck size={18} /> OK
        </div>
        <p className="text-sm leading-relaxed text-gray-200">{lang === "it" ? result.message_it : result.message_en}</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-[#FF007F]/30 bg-[#121620] p-4" data-testid="consistency-widget">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-[#FF007F]" />
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">{t.aiVerdict}</h3>
      </div>
      {body}
    </div>
  );
};
