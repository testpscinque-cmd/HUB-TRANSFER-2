import { useState, useEffect } from "react";
import { X, Newspaper, Loader2, Copy, Check } from "lucide-react";
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
        .catch(() => toast.error("Draft generation failed"))
        .finally(() => setLoading(false));
    }
  }, [open, profile, lang]);

  if (!open) return null;

  const copy = async () => {
    if (!article) return;
    await navigator.clipboard.writeText(`${article.title}\n\n${article.body}`);
    setCopied(true);
    toast.success(t.copied);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="tm-fade-up relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#121620] shadow-2xl" data-testid="article-dialog">
        <div className="flex items-start justify-between border-b border-white/5 px-6 py-4">
          <div className="flex items-center gap-2">
            <Newspaper size={18} className="text-[#39FF14]" />
            <div>
              <h2 className="font-heading text-xl font-black uppercase text-white">{t.articleModalTitle}</h2>
              <p className="mt-0.5 text-xs text-gray-500">{t.articleModalSub}</p>
            </div>
          </div>
          <button onClick={onClose} data-testid="article-close" className="text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6" data-testid="article-body">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 size={26} className="animate-spin text-[#39FF14]" />
              <span className="text-sm text-gray-400">{t.generating}</span>
            </div>
          ) : article ? (
            <article>
              <h1 className="font-heading text-2xl font-black leading-tight text-white">{article.title}</h1>
              <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-300">{article.body}</div>
            </article>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-white/5 px-6 py-4">
          <button onClick={onClose} className="rounded-lg border border-white/15 px-4 py-2 text-sm font-bold text-gray-300 transition-colors hover:border-white/40 hover:text-white">
            {t.close}
          </button>
          <button
            data-testid="article-copy-btn"
            onClick={copy}
            disabled={!article}
            className="flex items-center gap-2 rounded-lg bg-[#39FF14] px-5 py-2 font-heading text-sm font-black uppercase tracking-wider text-black transition-all hover:bg-[#39FF14]/85 disabled:opacity-50"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />} {t.copy}
          </button>
        </div>
      </div>
    </div>
  );
};
