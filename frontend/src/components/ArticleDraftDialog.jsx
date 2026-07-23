import { useEffect, useState } from "react";
import { X, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { generateArticle } from "@/lib/api";

export const ArticleDraftDialog = ({ open, onClose, profile }) => {
  const { t, lang } = useI18n();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open && profile) {
      setArticle(null);
      setCopied(false);
      setLoading(true);
      generateArticle(profile.id, lang)
        .then(setArticle)
        .catch(() => toast.error("Generazione bozza fallita"))
        .finally(() => setLoading(false));
    }
  }, [open, profile, lang]);

  if (!open) return null;

  const hasUpdates = Boolean(profile?.timeline?.length);

  const copy = async () => {
    if (!article) return;
    await navigator.clipboard.writeText(`${article.title}\n\n${article.body}`);
    setCopied(true);
    toast.success(t.copied);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-gray-800 bg-gray-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-300">CONFIDENTIAL BRIEF</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">Executive briefing profilo</h2>
          </div>
          <button onClick={onClose} data-testid="article-close" className="text-slate-400 transition hover:text-white">
            <X size={22} />
          </button>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:grid-cols-2">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                <div className="text-white font-bold">Età</div>
                <div className="mt-2 text-lg">{profile?.age || "---"}</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                <div className="text-white font-bold">Ruolo</div>
                <div className="mt-2 text-lg">{profile?.position || profile?.role || "---"}</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                <div className="text-white font-bold">Scadenza</div>
                <div className="mt-2 text-lg">{profile?.contract_expiry || "---"}</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs uppercase tracking-[0.3em] text-slate-400">
                <div className="text-white font-bold">Nazione</div>
                <div className="mt-2 text-lg">{profile?.nationality || "---"}</div>
              </div>
            </div>
            {!hasUpdates && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold uppercase tracking-[0.25em] text-red-200">
                🔴 STATUS: STANDBY - Nessun movimento rilevato
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 text-sm leading-6 text-slate-300">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
                <Loader2 size={26} className="animate-spin text-emerald-300" />
                <p>Generazione briefing...</p>
              </div>
            ) : article ? (
              <>
                <h3 className="text-lg font-bold text-white">{article.title}</h3>
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-300">{article.body}</p>
              </>
            ) : (
              <p className="text-sm text-slate-500">Nessun briefing disponibile.</p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 px-6 py-5">
          <button
            data-testid="article-copy-btn"
            onClick={copy}
            disabled={!article}
            className="mx-auto flex w-full max-w-md items-center justify-center gap-3 rounded-3xl bg-emerald-500 px-6 py-4 text-sm font-black uppercase tracking-[0.25em] text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />} ESPORTA BOZZA
          </button>
        </div>
      </div>
    </div>
  );
};
