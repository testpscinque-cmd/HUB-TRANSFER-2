import { useState, useMemo } from "react";
import { ChevronRight, Filter } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Crest } from "@/components/Crest";

const yearOf = (d) => (d && d.length >= 4 ? d.slice(0, 4) : "—");

const ProfileCard = ({ p, onOpen, t }) => {
  const isCoach = p.role === "Coach";
  const accent = isCoach ? "#00E5FF" : "#39FF14";
  return (
    <button
      data-testid={`profile-card-${p.id}`}
      onClick={() => onOpen(p.id)}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#121620] text-left transition-all hover:-translate-y-1 hover:border-white/25"
    >
      <div className="relative h-28 overflow-hidden">
        <img src={p.image} alt={p.full_name} className="h-full w-full object-cover object-top opacity-80 transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121620] to-transparent" />
        <span
          className="absolute left-3 top-3 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest"
          style={{ borderColor: `${accent}66`, backgroundColor: `${accent}1A`, color: accent }}
        >
          {isCoach ? t.coach : t.player}
        </span>
        <div className="absolute right-3 top-3">
          <Crest club={p.current_club} size={26} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base font-bold leading-tight text-white">{p.full_name}</h3>
        <p className="text-xs text-gray-500">{p.position} · {p.current_club}</p>
        {p.league && p.league !== "—" && (
          <span className="mt-1.5 inline-block self-start rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gray-400">
            {p.league}
          </span>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
          <span className="text-[11px] text-gray-500">
            {t.expiry}: <span className="font-mono font-bold text-white">{yearOf(p.contract_expiry)}</span>
          </span>
          <ChevronRight size={16} className="text-gray-600 transition-transform group-hover:translate-x-1 group-hover:text-[color:var(--tm-volt)]" />
        </div>
      </div>
    </button>
  );
};

export const ProfilesView = ({ profiles, clubs, query, onOpenProfile }) => {
  const { t } = useI18n();
  const [role, setRole] = useState("all");
  const [club, setClub] = useState("all");

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      if (query && !p.full_name.toLowerCase().includes(query.toLowerCase())) return false;
      if (role !== "all" && p.role !== role) return false;
      if (club !== "all" && p.current_club !== club) return false;
      return true;
    });
  }, [profiles, query, role, club]);

  const roleTabs = [
    { key: "all", label: t.all },
    { key: "Player", label: t.players },
    { key: "Coach", label: t.coaches },
  ];

  return (
    <div className="tm-fade-up mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="font-heading text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">{t.profilesTitle}</h2>
        <p className="mt-1 text-gray-500">{t.profilesSub}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-1 rounded-lg border border-white/10 bg-[#121620] p-1">
          {roleTabs.map((tab) => (
            <button
              key={tab.key}
              data-testid={`role-filter-${tab.key}`}
              onClick={() => setRole(tab.key)}
              className={`rounded-md px-4 py-1.5 text-sm font-bold transition-all ${
                role === tab.key ? "bg-[#39FF14] text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex items-center gap-2">
          <Filter size={15} className="text-gray-500" />
          <select
            data-testid="club-filter"
            value={club}
            onChange={(e) => setClub(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#1B2432] px-3 py-2 text-sm text-white focus:border-[#39FF14] focus:outline-none"
          >
            <option value="all" className="bg-[#1B2432]">{t.allClubs}</option>
            {clubs.map((c) => (
              <option key={c} value={c} className="bg-[#1B2432]">{c}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-gray-500">{t.noResults}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-testid="profiles-grid">
          {filtered.map((p) => (
            <ProfileCard key={p.id} p={p} onOpen={onOpenProfile} t={t} />
          ))}
        </div>
      )}
    </div>
  );
};
