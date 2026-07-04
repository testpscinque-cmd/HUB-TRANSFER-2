import { ShieldAlert, ShieldCheck, Loader2, Sparkles, Lightbulb } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const severityStyle = {
  high: { border: "border-red-300", bg: "bg-red-50", text: "text-red-600", pulse: "tm-pulse-hot" },
  medium: { border: "border-orange-300", bg: "bg-orange-50", text: "text-orange-600", pulse: "" },
  low: { border: "border-amber-300", bg: "bg-amber-50", text: "text-amber-600", pulse: "" },
};

export const ConsistencyWidget = ({ result, checking }) => {
  const { t, lang } = useI18n();
  let body;
  if (checking) {
    body = (
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <Loader2 size={18} className="animate-spin text-blue-500" />
        <span className="text-sm text-slate-600">{t.scanning}</span>
      </div>
    );
  } else if (!result) {
    return null;
  } else if (result.has_contradiction) {
    const s = severityStyle[result.severity] || severityStyle.medium;
    body = (
      <div className={`rounded-lg border ${s.border} ${s.bg} ${s.pulse} p-4`} data-testid="consistency-warning">
        <div className={`mb-2 flex items-center gap-2 font-heading text-sm font-black uppercase tracking-wider ${s.text}`}>
          <ShieldAlert size={18} /> {result.severity}
        </div>
        <p className="text-sm leading-relaxed text-slate-800">{lang === "it" ? result.message_it : result.message_en}</p>
        {(lang === "it" ? result.advice_it : result.advice_en) && (
          <div className="mt-3 flex gap-2 border-t border-black/5 pt-3">
            <Lightbulb size={14} className="mt-0.5 shrink-0 text-[#05A845]" />
            <p className="text-xs leading-relaxed text-slate-600">
              <span className="font-bold text-[#05A845]">{t.advice}: </span>
              {lang === "it" ? result.advice_it : result.advice_en}
            </p>
          </div>
        )}
      </div>
    );
  } else {
    body = (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4" data-testid="consistency-ok">
        <div className="mb-2 flex items-center gap-2 font-heading text-sm font-black uppercase tracking-wider text-[#05A845]">
          <ShieldCheck size={18} /> OK
        </div>
        <p className="text-sm leading-relaxed text-slate-700">{lang === "it" ? result.message_it : result.message_en}</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" data-testid="consistency-widget">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-[#05A845]" />
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-900">{t.aiVerdict}</h3>
      </div>
      {body}
    </div>
  );
};
