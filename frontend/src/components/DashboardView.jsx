import { Flame, ChevronRight, Newspaper, Users, ListChecks, CheckCircle2, Radar } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { stageConfig, stageLabel } from "@/lib/stages";
import { Crest } from "@/components/Crest";

const fmtDate = (d, lang) => {
  try {
    return new Date(d).toLocaleDateString(lang === "it" ? "it-IT" : "en-GB", { day: "2-digit", month: "short" });
  } catch { return d; }
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#121620] px-4 py-3" data-testid={`stat-${label}`}>
    <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}1A` }}>
      <Icon size={18} style={{ color }} />
    </div>
    <div>
      <div className="font-heading text-xl font-black leading-none text-white">{value ?? "—"}</div>
      <div className="text-[10px] uppercase tracking-widest text-gray-500">{label}</div>
    </div>
  </div>
);

const NewsCard = ({ r, onOpen, lang }) => {
  const cfg = stageConfig[r.stage] || stageConfig["Interesse Iniziale"];
  const isCoach = r.role === "Coach";
  return (
    <button
      data-testid={`news-card-${r.id}`}
      onClick={() => onOpen(r.profile_id)}
      className="group flex w-full items-start gap-4 rounded-xl border border-white/10 bg-[#121620] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-white/25"
    >
      <div className="relative shrink-0">
        <img src={r.image} alt={r.full_name} className="h-12 w-12 rounded-lg object-cover object-top" />
        <div className="absolute -bottom-1.5 -right-1.5">
          <Crest club={r.current_club} size={22} />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-heading text-sm font-bold text-white">{r.full_name}</span>
          <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${isCoach ? "border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF]" : "border-white/10 bg-white/5 text-gray-400"}`}>
            {isCoach ? "Coach" : r.position || "Player"}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${cfg.badge}`}>
            {stageLabel(r.stage, lang)}
          </span>
          <span className="ml-auto text-[11px] text-gray-500">{fmtDate(r.date_logged, lang)}</span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-gray-300">{r.evolution_description}</p>
        <p className="mt-1.5 text-[11px] font-medium text-[#00E5FF]">{r.source_name}</p>
      </div>
      <ChevronRight size={18} className="mt-1 shrink-0 text-gray-600 transition-transform group-hover:translate-x-1 group-hover:text-[#39FF14]" />
    </button>
  );
};

export const DashboardView = ({ recent, stats, onOpenProfile }) => {
  const { t, lang } = useI18n();
  const hot = recent.filter((r) => ["Trattativa Avanzata", "Fumata Bianca/Ufficiale"].includes(r.stage)).slice(0, 3);

  return (
    <div className="tm-fade-up mx-auto max-w-5xl space-y-8">
      <div>
        <h2 className="font-heading text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
          {t.latestNews}
        </h2>
        <p className="mt-1 text-gray-500">{t.latestNewsSub}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard icon={Users} label={t.stats.profiles} value={stats?.profiles} color="#00E5FF" />
        <StatCard icon={ListChecks} label={t.stats.rumors} value={stats?.rumors} color="#94A3B8" />
        <StatCard icon={Flame} label={t.stats.hot} value={stats?.hot} color="#FF007F" />
        <StatCard icon={CheckCircle2} label={t.stats.official} value={stats?.official} color="#39FF14" />
        <StatCard icon={Radar} label={t.stats.alerts} value={stats?.alerts} color="#FF007F" />
      </div>

      {hot.length > 0 && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Flame size={18} className="text-[#FF007F]" />
            <h3 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-[#FF007F]">{t.hotNow}</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {hot.map((r) => {
              const cfg = stageConfig[r.stage] || stageConfig["Interesse Iniziale"];
              return (
                <button
                  key={`hot-${r.id}`}
                  data-testid={`hot-card-${r.id}`}
                  onClick={() => onOpenProfile(r.profile_id)}
                  className="rounded-xl border border-[#FF007F]/40 bg-[#121620] p-4 text-left shadow-[0_0_15px_rgba(255,0,127,0.1)] transition-all hover:-translate-y-1"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Crest club={r.current_club} size={26} />
                    <span className="font-heading text-sm font-bold text-white">{r.full_name}</span>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${cfg.badge}`}>
                    {stageLabel(r.stage, lang)}
                  </span>
                  <p className="mt-2 line-clamp-2 text-xs leading-snug text-gray-400">{r.evolution_description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Newspaper size={18} className="text-gray-400" />
          <h3 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-gray-400">{t.latestNews}</h3>
        </div>
        <div className="space-y-3">
          {recent.map((r) => (
            <NewsCard key={r.id} r={r} onOpen={onOpenProfile} lang={lang} />
          ))}
        </div>
      </div>
    </div>
  );
};
