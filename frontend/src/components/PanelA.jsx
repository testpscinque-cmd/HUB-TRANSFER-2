import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ContractCard } from "@/components/ContractCard";

export const PanelA = ({ profiles, selectedId, onSelect, onNewRumor, selectedProfile }) => {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return profiles;
    return profiles.filter((p) =>
      p.full_name.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [profiles, query]);

  return (
    <aside className="flex h-full flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          data-testid="search-player-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full rounded-lg border border-white/10 bg-[#1B2432] py-3 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 transition-all focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14]"
        />
      </div>

      <button
        data-testid="new-rumor-btn"
        onClick={onNewRumor}
        className="flex items-center justify-center gap-2 rounded-lg bg-[#39FF14] py-3 font-heading text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-[#39FF14]/85 hover:shadow-[0_0_20px_rgba(57,255,20,0.45)]"
      >
        <Plus size={18} strokeWidth={3} /> {t.newRumor}
      </button>

      {/* Selected contract card */}
      {selectedProfile && <ContractCard key={selectedProfile.id} profile={selectedProfile} />}

      {/* Roster list */}
      <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-white/10 bg-[#121620]">
        <p className="border-b border-white/5 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
          {t.recent}
        </p>
        <div className="flex-1 overflow-y-auto p-2" data-testid="roster-list">
          {filtered.map((p) => (
            <button
              key={p.id}
              data-testid={`roster-item-${p.id}`}
              onClick={() => onSelect(p.id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                selectedId === p.id
                  ? "border border-[#39FF14]/40 bg-[#39FF14]/10"
                  : "border border-transparent hover:bg-white/5"
              }`}
            >
              <img
                src={p.image}
                alt={p.full_name}
                className="h-9 w-9 shrink-0 rounded-full object-cover object-top"
              />
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-white">{p.full_name}</div>
                <div className="truncate text-[11px] text-gray-500">
                  {p.current_club} · {p.role}
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-gray-500">No results.</p>
          )}
        </div>
      </div>
    </aside>
  );
};
