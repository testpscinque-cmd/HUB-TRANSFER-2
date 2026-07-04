import { Flame, ChevronRight, Newspaper } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { stageConfig, stageLabel } from "@/lib/stages";
import { timeAgo, dateTime } from "@/lib/time";
import { contractMismatch } from "@/lib/consistency";
import { Crest } from "@/components/Crest";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Thermometer } from "@/components/Thermometer";
import { MismatchBadge } from "@/components/MismatchBadge";

const NewsCard = ({ r, onOpen, lang, verified }) => {
  const cfg = stageConfig[r.stage] || stageConfig["Interesse Iniziale"];
  const isCoach = r.role === "Coach";
  return (
    <button
      data-testid={`news-card-${r.id}`}
      onClick={() => onOpen(r.profile_id)}
      className={`group flex w-full items-start gap-4 rounded-xl border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#05A845]/40 hover:shadow-md ${
        verified ? "border-slate-200 border-l-4 border-l-[#1D9BF0]" : "border-slate-200"
      }`}
    >
      <div className="relative shrink-0">
        <PlayerAvatar name={r.full_name} size={48} isCoach={isCoach} />
        <div className="absolute -bottom-1.5 -right-1.5">
          <Crest club={r.current_club} size={22} />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-heading text-sm font-bold text-slate-900">{r.full_name}</span>
          {contractMismatch(r.deal_formula, r.evolution_description, r.contract_expiry, r.role) && <MismatchBadge />}
          <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${isCoach ? "border-slate-900/15 bg-slate-900/5 text-slate-700" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
            {isCoach ? "Coach" : r.position || "Player"}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${cfg.badge}`}>
            {stageLabel(r.stage, lang)}
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-400">
            {timeAgo(r.logged_at || r.date_logged, lang)}
            <span className="hidden font-mono text-slate-300 sm:inline">· {dateTime(r.logged_at || r.date_logged, lang)}</span>
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-slate-600">{r.evolution_description}</p>
        <p className="mt-1.5 text-[11px] font-semibold text-[#05A845]">{r.source_name}</p>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-1">
        <Thermometer stage={r.stage} size={22} lang={lang} />
        <ChevronRight size={16} className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-[#05A845]" />
      </div>
    </button>
  );
};

export const DashboardView = ({ recent, sources = [], onOpenProfile }) => {
  const { t, lang } = useI18n();
  const verifiedSet = new Set(sources.filter((s) => s.reliability_score > 85).map((s) => s.source_name));
  const hot = recent.filter((r) => ["Trattativa Avanzata", "Fumata Bianca/Ufficiale"].includes(r.stage)).slice(0, 3);

  return (
    <div className="tm-fade-up mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1.5 inline-flex items-center gap-2 rounded-full bg-[#05A845]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#05A845]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#05A845]" /> Live
          </div>
          <h2 className="font-heading text-4xl font-black uppercase tracking-tight text-slate-900 sm:text-5xl">
            TOP NEWS
          </h2>
          <p className="mt-1 text-slate-500">{t.latestNewsSub}</p>
        </div>
      </div>

      {hot.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Flame size={18} className="text-red-500" />
            <h3 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-red-500">{t.hotNow}</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {hot.map((r) => {
              const cfg = stageConfig[r.stage] || stageConfig["Interesse Iniziale"];
              return (
                <button
                  key={`hot-${r.id}`}
                  data-testid={`hot-card-${r.id}`}
                  onClick={() => onOpenProfile(r.profile_id)}
                  className="rounded-xl border border-red-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Crest club={r.current_club} size={26} />
                    <span className="font-heading text-sm font-bold text-slate-900">{r.full_name}</span>
                    <span className="ml-auto"><Thermometer stage={r.stage} size={20} lang={lang} /></span>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${cfg.badge}`}>
                    {stageLabel(r.stage, lang)}
                  </span>
                  <p className="mt-2 line-clamp-2 text-xs leading-snug text-slate-500">{r.evolution_description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Newspaper size={18} className="text-slate-400" />
          <h3 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-slate-400">{t.latestNews}</h3>
        </div>
        <div className="space-y-3">
          {recent.map((r) => (
            <NewsCard key={r.id} r={r} onOpen={onOpenProfile} lang={lang} verified={verifiedSet.has(r.source_name)} />
          ))}
        </div>
      </div>
    </div>
  );
};
