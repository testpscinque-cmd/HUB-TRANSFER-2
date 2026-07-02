import { Zap, Languages, Flame, CheckCircle2, Users, ListChecks } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const StatPill = ({ icon: Icon, label, value, color }) => (
  <div
    className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#121620] px-3 py-2"
    data-testid={`stat-${label}`}
  >
    <Icon size={16} style={{ color }} />
    <div className="leading-none">
      <div className="font-heading text-base font-extrabold text-white">{value ?? "—"}</div>
      <div className="text-[10px] uppercase tracking-widest text-gray-500">{label}</div>
    </div>
  </div>
);

export const Header = ({ stats }) => {
  const { t, lang, toggle } = useI18n();
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0D1B2A]/85 border-b border-white/10">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#39FF14] shadow-[0_0_18px_rgba(57,255,20,0.5)]">
            <Zap size={22} className="text-black" fill="black" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-black uppercase leading-none tracking-tight text-white">
              Transfer<span className="text-[#39FF14]">Memory</span>
            </h1>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#FF007F]">
              {t.tagline}
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <StatPill icon={Users} label={t.stats.profiles} value={stats?.profiles} color="#00E5FF" />
          <StatPill icon={ListChecks} label={t.stats.rumors} value={stats?.rumors} color="#94A3B8" />
          <StatPill icon={Flame} label={t.stats.hot} value={stats?.hot} color="#FF007F" />
          <StatPill icon={CheckCircle2} label={t.stats.official} value={stats?.official} color="#39FF14" />
        </div>

        <button
          onClick={toggle}
          data-testid="lang-toggle"
          className="flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-bold text-white transition-colors hover:border-[#39FF14] hover:text-[#39FF14]"
        >
          <Languages size={16} />
          {t.lang}
        </button>
      </div>
    </header>
  );
};
