import { useState, useMemo } from "react";
import { ChevronRight, Filter } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Crest } from "@/components/Crest";
import { PlayerAvatar } from "@/components/PlayerAvatar";

const yearOf = (d) => (d && d.length >= 4 ? d.slice(0, 4) : "—");

const ProfileCard = ({ p, onOpen, t }) => {
  const isCoach = p.role === "Coach";
  const accent = isCoach ? "#0F172A" : "#05A845";
  return (
    <button
      data-testid={`profile-card-${p.id}`}
      onClick={() => onOpen(p.id)}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:border-[#05A845]/40 hover:shadow-md"
    >
      <div className="flex items-center gap-3 border-b border-slate-100 p-4">
        <PlayerAvatar name={p.full_name} size={52} isCoach={isCoach} />
        <div className="min-w-0 flex-1">
          <span
            className="inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest"
            style={{ borderColor: `${accent}33`, backgroundColor: `${accent}12`, color: accent }}
          >
            {isCoach ? t.coach : t.player}
          </span>
          <h3 className="mt-1 truncate font-heading text-base font-bold leading-tight text-slate-900">{p.full_name}</h3>
        </div>
        <Crest club={p.current_club} size={30} />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-slate-500">{p.position} · {p.current_club}</p>
        {p.league && p.league !== "—" && (
          <span className="mt-1.5 inline-block self-start rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
            {p.league}
          </span>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-[11px] text-slate-500">
            {t.expiry}: <span className="font-mono font-bold text-slate-900">{yearOf(p.contract_expiry)}</span>
          </span>
          <ChevronRight size={16} className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-[#05A845]" />
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
        <h2 className="font-heading text-4xl font-black uppercase tracking-tight text-slate-900 sm:text-5xl">{t.profilesTitle}</h2>
        <p className="mt-1 text-slate-500">{t.profilesSub}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          {roleTabs.map((tab) => (
            <button
              key={tab.key}
              data-testid={`role-filter-${tab.key}`}
              onClick={() => setRole(tab.key)}
              className={`rounded-md px-4 py-1.5 text-sm font-bold transition-all ${
                role === tab.key ? "bg-[#05A845] text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex items-center gap-2">
          <Filter size={15} className="text-slate-400" />
          <select
            data-testid="club-filter"
            value={club}
            onChange={(e) => setClub(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-[#05A845] focus:outline-none"
          >
            <option value="all">{t.allClubs}</option>
            {clubs.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-slate-400">{t.noResults}</p>
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
