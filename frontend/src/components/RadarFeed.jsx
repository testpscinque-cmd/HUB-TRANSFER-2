import { Radar, Loader2, Search, Trash2, Globe, Clock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { timeAgo, dateTime } from "@/lib/time";

const anomalyStyle = {
  High: { cls: "border-[#FF007F]/50 bg-[#FF007F]/10 text-[#FF007F]", dot: "bg-[#FF007F]" },
  Medium: { cls: "border-orange-500/40 bg-orange-500/10 text-orange-400", dot: "bg-orange-400" },
  Low: { cls: "border-white/15 bg-white/5 text-gray-300", dot: "bg-gray-400" },
};

const statusStyle = {
  New: "text-[#39FF14]",
  Investigating: "text-[#00E5FF]",
  Verified: "text-[#39FF14]",
  Dismissed: "text-gray-500",
};

export const RadarFeed = ({ alerts, onInvestigate, onDismiss, onScan, scanning }) => {
  const { t, lang } = useI18n();
  const visible = alerts.filter((a) => a.status !== "Dismissed");

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/10 bg-[#121620]">
      <div className="border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <Radar size={17} className="text-[#FF007F]" />
          <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">{t.radarTitle}</h3>
        </div>
        <p className="mt-0.5 text-[11px] text-gray-500">{t.radarSub}</p>
        <button
          data-testid="radar-scan-btn"
          onClick={onScan}
          disabled={scanning}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#FF007F]/50 bg-[#FF007F]/10 py-2.5 text-sm font-bold text-[#FF007F] transition-all hover:bg-[#FF007F]/20 disabled:opacity-60"
        >
          {scanning ? <Loader2 size={16} className="animate-spin" /> : <Radar size={16} />}
          {scanning ? t.scanning : t.simulateScan}
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {visible.length === 0 && <p className="px-2 py-8 text-center text-sm text-gray-500">{t.noAlerts}</p>}
        {visible.map((a) => {
          const st = anomalyStyle[a.anomaly_score] || anomalyStyle.Low;
          return (
            <div key={a.id} className="tm-fade-up rounded-xl border border-white/10 bg-[#1B2432] p-3" data-testid={`alert-${a.id}`}>
              <div className="mb-1.5 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${st.cls}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} /> {t.anomaly}: {a.anomaly_score}
                </span>
                <span className={`ml-auto text-[10px] font-bold uppercase ${statusStyle[a.status] || "text-gray-500"}`}>{a.status}</span>
              </div>
              <div className="font-heading text-sm font-bold text-white">{a.player_name}</div>
              <div className="mb-2 flex flex-wrap items-center gap-1 text-[11px] text-gray-500">
                <Globe size={11} /> {a.current_club} · {t.flaggedIn} {a.flagged_country}
                <span className="flex items-center gap-1 text-[#00E5FF]" title={dateTime(a.created_at, lang)}>
                  · <Clock size={10} /> {timeAgo(a.created_at, lang)}
                </span>
              </div>
              <p className="text-xs leading-snug text-gray-300">{a.automated_summary}</p>
              {a.external_link_url && (
                <a
                  href={a.external_link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`verify-source-${a.id}`}
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-[#39FF14] py-2 text-xs font-black uppercase tracking-wider text-black transition-all hover:brightness-110"
                >
                  {t.verifySource}
                </a>
              )}
              {a.status === "New" && (
                <div className="mt-3 flex gap-2">
                  <button
                    data-testid={`investigate-${a.id}`}
                    onClick={() => onInvestigate(a.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#39FF14] py-1.5 text-xs font-black uppercase tracking-wider text-black transition-all hover:bg-[#39FF14]/85"
                  >
                    <Search size={13} /> {t.investigate}
                  </button>
                  <button
                    data-testid={`dismiss-${a.id}`}
                    onClick={() => onDismiss(a.id)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-gray-400 transition-colors hover:border-red-500/50 hover:text-red-400"
                  >
                    <Trash2 size={13} /> {t.dismiss}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
