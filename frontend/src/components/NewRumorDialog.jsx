import { useState, useEffect } from "react";
import { X, Sparkles, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { STAGES, DEAL_FORMULAS, stageLabel } from "@/lib/stages";
import { consistencyCheck, createRumor } from "@/lib/api";

const today = () => new Date().toISOString().slice(0, 10);

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 focus:border-[#05A845] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#05A845]/20 transition-all";

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
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="tm-fade-up relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
        data-testid="new-rumor-dialog"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="font-heading text-xl font-black uppercase text-slate-900">{t.dialogTitle}</h2>
            <p className="mt-0.5 text-xs text-slate-500">{t.dialogSub}</p>
          </div>
          <button onClick={onClose} data-testid="dialog-close" className="text-slate-400 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-500">
              {t.profile}
            </label>
            <select data-testid="rumor-profile-select" value={form.profile_id} onChange={set("profile_id")} className={fieldClass}>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name} — {p.current_club}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                {t.stage}
              </label>
              <select data-testid="rumor-stage-select" value={form.stage} onChange={set("stage")} className={fieldClass}>
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {stageLabel(s, lang)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                {t.dateLogged}
              </label>
              <input type="date" data-testid="rumor-date-input" value={form.date_logged} onChange={set("date_logged")} className={fieldClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                {t.source}
              </label>
              <select data-testid="rumor-source-select" value={form.source_name} onChange={set("source_name")} className={fieldClass}>
                {sources.map((s) => (
                  <option key={s.id} value={s.source_name}>
                    {s.source_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                {t.dealFormula}
              </label>
              <select data-testid="rumor-formula-select" value={form.deal_formula} onChange={set("deal_formula")} className={fieldClass}>
                {DEAL_FORMULAS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-500">
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
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-green-200 bg-green-50 text-[#05A845]"
              }`}
              data-testid="dialog-check-result"
            >
              {lang === "it" ? localResult.message_it : localResult.message_en}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-slate-100 px-6 py-4">
          <button
            data-testid="run-check-btn"
            onClick={runCheck}
            disabled={checking}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#05A845]/40 bg-[#05A845]/5 py-2.5 text-sm font-bold text-[#05A845] transition-all hover:bg-[#05A845]/10 disabled:opacity-50"
          >
            {checking ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {t.runCheck}
          </button>
          <button
            data-testid="save-rumor-btn"
            onClick={save}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#05A845] px-5 py-2.5 font-heading text-sm font-black uppercase tracking-wider text-white transition-all hover:bg-[#048B39] disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};
