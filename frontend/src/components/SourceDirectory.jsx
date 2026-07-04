import { useState } from "react";
import { Signal, BadgeCheck, X } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const scoreColor = (s) =>
  s >= 85 ? "#05A845" : s >= 65 ? "#3B82F6" : s >= 45 ? "#F59E0B" : "#EF4444";

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
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={submit} className="tm-fade-up relative z-10 w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl" data-testid="verification-modal">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-heading text-xl font-black uppercase text-slate-900">{t.verificationTitle}</h2>
            <p className="mt-0.5 text-xs text-slate-500">{t.verificationSub}</p>
          </div>
          <button type="button" onClick={onClose} data-testid="verification-close" className="text-slate-400 hover:text-slate-900"><X size={20} /></button>
        </div>
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-500">{t.formName}</label>
        <input required data-testid="verification-name" className="mb-4 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-[#05A845] focus:bg-white focus:outline-none" />
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-500">{t.formPressId}</label>
        <input required type="url" placeholder="https://" data-testid="verification-pressid" className="mb-5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#05A845] focus:bg-white focus:outline-none" />
        <button type="submit" data-testid="verification-submit" className="w-full rounded-lg bg-[#05A845] py-2.5 font-heading text-sm font-black uppercase tracking-wider text-white transition-all hover:bg-[#048B39]">
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
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm" data-testid="source-directory">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <Signal size={16} className="text-blue-500" />
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-900">{t.sourcesTitle}</h3>
          </div>
          {!compact && <p className="mt-0.5 text-[11px] text-slate-500">{t.sourcesSub}</p>}
        </div>
        {!compact && (
          <button
            data-testid="apply-verification-btn"
            onClick={() => setModal(true)}
            className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:border-[#05A845] hover:text-[#05A845]"
          >
            {t.applyVerification}
          </button>
        )}
      </div>
      <div className={compact ? "p-3" : "grid gap-x-8 gap-y-4 p-5 sm:grid-cols-2"}>
        {sources.map((s) => (
          <div key={s.id} className={compact ? "mb-3 last:mb-0" : ""} data-testid={`source-${s.id}`}>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-900">{s.source_name}</span>
              {s.reliability_score > 85 && (
                <BadgeCheck size={15} className="text-[#1D9BF0]" data-testid={`verified-${s.id}`} />
              )}
            </div>
            {s.notes && <p className="mt-1 text-[11px] leading-snug text-slate-500">{s.notes}</p>}
          </div>
        ))}
      </div>
      <VerificationModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
};
