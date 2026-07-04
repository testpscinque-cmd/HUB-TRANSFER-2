import { useState, useMemo } from "react";
import { Newspaper, Search, Trash2, Globe, Clock, ExternalLink, CircleDot, BadgeCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { timeAgo, dateTime } from "@/lib/time";
import { Crest } from "@/components/Crest";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { Thermometer } from "@/components/Thermometer";

const anomalyToStage = { High: "Trattativa Avanzata", Medium: "Contatti", Low: "Interesse Iniziale" };
const anomalyStyle = {
  High: "border-red-200 bg-red-50 text-red-600",
  Medium: "border-amber-200 bg-amber-50 text-amber-600",
  Low: "border-blue-200 bg-blue-50 text-blue-600",
};

export const RadarFeed = ({ alerts, sources, onInvestigate, onDismiss }) => {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");

  const visible = useMemo(() => {
    const base = alerts.filter((a) => a.status !== "Dismissed");
    if (!q.trim()) return base;
    const s = q.toLowerCase();
    return base.filter(
      (a) =>
        a.player_name?.toLowerCase().includes(s) ||
        a.current_club?.toLowerCase().includes(s) ||
        a.flagged_country?.toLowerCase().includes(s) ||
        a.automated_summary?.toLowerCase().includes(s)
    );
  }, [alerts, q]);

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Newspaper size={17} className="text-[#05A845]" />
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-900">{t.radarTitle}</h3>
          <span className="ml-2 flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-red-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> Live
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-slate-500">{t.radarSub}</p>
        <div className="relative mt-3">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            data-testid="news-search-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.newsSearch}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#05A845] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#05A845]/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {visible.length === 0 && <p className="px-2 py-10 text-center text-sm text-slate-400">{t.noResults}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          {visible.map((a) => {
            const verified = a.status === "Verified";
            return (
              <div
                key={a.id}
                data-testid={`alert-${a.id}`}
                className={`tm-fade-up flex flex-col rounded-xl border bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  verified ? "border-slate-200 border-l-4 border-l-[#1D9BF0]" : "border-slate-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <PlayerAvatar name={a.player_name} size={42} />
                    <div className="absolute -bottom-1 -right-1"><Crest club={a.current_club} size={20} /></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-heading text-sm font-bold text-slate-900">{a.player_name}</span>
                      {verified && <BadgeCheck size={14} className="shrink-0 text-[#1D9BF0]" title={t.verifiedTag} />}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Globe size={10} /> {a.current_club} · {a.flagged_country}
                    </div>
                  </div>
                  <Thermometer stage={anomalyToStage[a.anomaly_score] || "Interesse Iniziale"} size={20} lang={lang} />
                </div>

                <p className="mt-2 line-clamp-3 flex-1 text-xs leading-snug text-slate-600">{a.automated_summary}</p>

                <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-bold uppercase ${anomalyStyle[a.anomaly_score] || anomalyStyle.Low}`}>
                    <CircleDot size={9} /> {a.anomaly_score}
                  </span>
                  <span className="flex items-center gap-1" title={dateTime(a.created_at, lang)}>
                    <Clock size={10} /> {timeAgo(a.created_at, lang)}
                  </span>
                  <span className="ml-auto font-mono">{dateTime(a.created_at, lang)}</span>
                </div>

                {a.external_link_url && (
                  <a
                    href={a.external_link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`verify-source-${a.id}`}
                    title={a.external_link_url}
                    className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-[#05A845] px-2.5 py-2 text-[11px] font-bold text-white transition-all hover:bg-[#048B39]"
                  >
                    <ExternalLink size={13} className="shrink-0" />
                    <span className="truncate font-mono">{a.external_link_url}</span>
                  </a>
                )}
                {a.status === "New" && (
                  <div className="mt-2 flex gap-2">
                    <button
                      data-testid={`investigate-${a.id}`}
                      onClick={() => onInvestigate(a.id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 py-1.5 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-slate-700"
                    >
                      <Search size={13} /> {t.investigate}
                    </button>
                    <button
                      data-testid={`dismiss-${a.id}`}
                      onClick={() => onDismiss(a.id)}
                      className="flex items-center justify-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 transition-colors hover:border-red-300 hover:text-red-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
