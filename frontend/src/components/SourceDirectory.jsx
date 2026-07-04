import { useState } from "react";
import { Signal, BadgeCheck, X } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const scoreColor = (s) =>
  s >= 85 ? "#39FF14" : s >= 65 ? "#00E5FF" : s >= 45 ? "#FBBF24" : "#FF007F";

const VerificationModal = ({ open, onClose }) => {
  const { t } = useI18n();
  if (!open) return null;
  const submit = (e) => {
    e.preventDefault();
    toast.success(t.verificationSent);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={submit} className="tm-fade-up relative z-10 w-full max-w-md rounded-xl border border-[#1E293B] bg-[#121620] p-6 shadow-2xl" data-testid="verification-modal">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-heading text-xl font-black uppercase text-white">{t.verificationTitle}</h2>
            <p className="mt-0.5 text-xs text-gray-500">{t.verificationSub}</p>
          </div>
          <button type="button" onClick={onClose} data-testid="verification-close" className="text-gray-500 hover:text-white"><X size={20} /></button>
        </div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-400">{t.formName}</label>
        <input required data-testid="verification-name" className="mb-4 w-full rounded-lg border border-white/10 bg-[#1B2432] px-3 py-2.5 text-sm text-white focus:border-[#39FF14] focus:outline-none" />
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-400">{t.formPressId}</label>
        <input required type="url" placeholder="https://" data-testid="verification-pressid" className="mb-5 w-full rounded-lg border border-white/10 bg-[#1B2432] px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-[#39FF14] focus:outline-none" />
        <button type="submit" data-testid="verification-submit" className="w-full rounded-lg bg-[#39FF14] py-2.5 font-heading text-sm font-black uppercase tracking-wider text-black transition-all hover:brightness-110">
          {t.submit}
        </button>
      </form>
    </div>
  );
};

export const SourceDirectory = ({ sources, compact = false }) => {
  const { t } = useI18n();
  const [modal, setModal] = useState(false);
  return (
    <div className="rounded-xl border border-[#1E293B] bg-[#121620]" data-testid="source-directory">
      <div className="flex items-start justify-between gap-3 border-b border-white/5 px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <Signal size={16} className="text-[#00E5FF]" />
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">{t.sourcesTitle}</h3>
          </div>
          {!compact && <p className="mt-0.5 text-[11px] text-gray-500">{t.sourcesSub}</p>}
        </div>
        {!compact && (
          <button
            data-testid="apply-verification-btn"
            onClick={() => setModal(true)}
            className="shrink-0 rounded-lg border border-white/25 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:border-[#39FF14] hover:text-[#39FF14]"
          >
            {t.applyVerification}
          </button>
        )}
      </div>
      <div className={compact ? "p-3" : "grid gap-x-8 gap-y-4 p-5 sm:grid-cols-2"}>
        {sources.map((s) => (
          <div key={s.id} className={compact ? "mb-3 last:mb-0" : ""} data-testid={`source-${s.id}`}>
            <div className="mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-bold text-white">
                {s.source_name}
                {s.reliability_score > 85 && (
                  <BadgeCheck size={15} className="text-[#1D9BF0]" data-testid={`verified-${s.id}`} />
                )}
              </span>
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
      <VerificationModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
};
