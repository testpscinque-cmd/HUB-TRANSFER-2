import { useState, useEffect } from "react";
import { X, Sparkles, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { STAGES, DEAL_FORMULAS, stageLabel } from "@/lib/stages";
import { consistencyCheck, createRumor } from "@/lib/api";

const today = () => new Date().toISOString().slice(0, 10);

const fieldClass =
  "w-full rounded-lg border border-white/10 bg-[#1B2432] px-3 py-2.5 text-sm text-white focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14] transition-all";

export const NewRumorDialog = ({ open, onClose, profiles, selectedProfile, sources, onSaved, onCheck }) => {
  const { t, lang } = useI18n();
  const [form, setForm] = useState({
    profile_id: "",
    stage: STAGES[0],
    date_logged: today(),
    source_name: "",
    deal_formula: DEAL_FORMULAS[0],
    evolution_description: "",
  });
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localResult, setLocalResult] = useState(null);

  useEffect(() => {
    if (open) {
      setForm({
        profile_id: selectedProfile?.id || profiles[0]?.id || "",
        stage: STAGES[0],
        date_logged: today(),
        source_name: sources[0]?.source_name || "",
        deal_formula: DEAL_FORMULAS[0],
        evolution_description: "",
      });
      setLocalResult(null);
    }
  }, [open, selectedProfile, profiles, sources]);

  if (!open) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const runCheck = async () => {
    if (!form.profile_id || !form.evolution_description.trim()) {
      toast.error(lang === "it" ? "Compila profilo e descrizione" : "Fill profile and description");
      return;
    }
    setChecking(true);
    onCheck?.(null, true);
    try {
      const res = await consistencyCheck(form);
      setLocalResult(res);
      onCheck?.(res, false);
    } catch {
      toast.error("Consistency check failed");
      onCheck?.(null, false);
    } finally {
      setChecking(false);
    }
  };

  const save = async () => {
    if (!form.profile_id || !form.evolution_description.trim() || !form.source_name) {
      toast.error(lang === "it" ? "Compila tutti i campi" : "Fill all fields");
      return;
    }
    setSaving(true);
    try {
      await createRumor(form);
      toast.success(t.saved);
      onSaved(form.profile_id, localResult);
      onClose();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="tm-fade-up relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-white/10 bg-[#121620] shadow-2xl"
        data-testid="new-rumor-dialog"
      >
        <div className="flex items-start justify-between border-b border-white/5 px-6 py-4">
          <div>
            <h2 className="font-heading text-xl font-black uppercase text-white">{t.dialogTitle}</h2>
            <p className="mt-0.5 text-xs text-gray-500">{t.dialogSub}</p>
          </div>
          <button onClick={onClose} data-testid="dialog-close" className="text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-400">
              {t.profile}
            </label>
            <select data-testid="rumor-profile-select" value={form.profile_id} onChange={set("profile_id")} className={fieldClass}>
              {profiles.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#1B2432]">
                  {p.full_name} — {p.current_club}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-400">
                {t.stage}
              </label>
              <select data-testid="rumor-stage-select" value={form.stage} onChange={set("stage")} className={fieldClass}>
                {STAGES.map((s) => (
                  <option key={s} value={s} className="bg-[#1B2432]">
                    {stageLabel(s, lang)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-400">
                {t.dateLogged}
              </label>
              <input type="date" data-testid="rumor-date-input" value={form.date_logged} onChange={set("date_logged")} className={fieldClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-400">
                {t.source}
              </label>
              <select data-testid="rumor-source-select" value={form.source_name} onChange={set("source_name")} className={fieldClass}>
                {sources.map((s) => (
                  <option key={s.id} value={s.source_name} className="bg-[#1B2432]">
                    {s.source_name} ({s.reliability_score}%)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-400">
                {t.dealFormula}
              </label>
              <select data-testid="rumor-formula-select" value={form.deal_formula} onChange={set("deal_formula")} className={fieldClass}>
                {DEAL_FORMULAS.map((d) => (
                  <option key={d} value={d} className="bg-[#1B2432]">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-400">
              {t.description}
            </label>
            <textarea
              data-testid="rumor-description-input"
              rows={3}
              value={form.evolution_description}
              onChange={set("evolution_description")}
              placeholder={t.descPlaceholder}
              className={fieldClass + " resize-none"}
            />
          </div>

          {localResult && (
            <div
              className={`rounded-lg border p-3 text-sm ${
                localResult.has_contradiction
                  ? "border-[#FF007F]/50 bg-[#FF007F]/5 text-[#FF007F]"
                  : "border-[#39FF14]/40 bg-[#39FF14]/5 text-[#39FF14]"
              }`}
              data-testid="dialog-check-result"
            >
              {lang === "it" ? localResult.message_it : localResult.message_en}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-white/5 px-6 py-4">
          <button
            data-testid="run-check-btn"
            onClick={runCheck}
            disabled={checking}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#FF007F]/50 bg-[#FF007F]/10 py-2.5 text-sm font-bold text-[#FF007F] transition-all hover:bg-[#FF007F]/20 disabled:opacity-50"
          >
            {checking ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {t.runCheck}
          </button>
          <button
            data-testid="save-rumor-btn"
            onClick={save}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#39FF14] px-5 py-2.5 font-heading text-sm font-black uppercase tracking-wider text-black transition-all hover:bg-[#39FF14]/85 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};
