import { useEffect, useState, useMemo } from "react";
import { Search, Bookmark } from "lucide-react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import { PlayerCutout, TierBadge } from "@/components/bits";

const Card = ({ e, onOpen, onSave }) => (
  <div data-testid={`profile-card-${e.id}`} className="glass group fade-up overflow-hidden rounded-[1.75rem] p-4 transition duration-200 hover:-translate-y-1 hover:border-[#2BE07A]/20 hover:shadow-[0_16px_40px_rgba(43,224,122,0.18)]">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <PlayerCutout name={e.name} size={56} className="transition-transform duration-200 group-hover:scale-[1.05]" />
        <div className="min-w-0">
          <button onClick={() => onOpen(e.id)} className="min-w-0 text-left">
            <div className="truncate font-heading text-lg font-black text-white">{e.name}</div>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/50">
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{e.position || e.role}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{e.team}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{e.nationality || "Nazione"}</span>
            </div>
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          {e.value_tier && <TierBadge tier={e.value_tier} />}
          <button data-testid={`save-${e.id}`} onClick={() => onSave(e)} title="Salva in Watchlist"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white/70 transition-colors hover:bg-[#2BE07A]/15 hover:text-[#E9EEF7] active:scale-95">
            <Bookmark size={15} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export const Profili = ({ onOpenProfile, saveWatch }) => {
  const [kind, setKind] = useState("player");
  const [q, setQ] = useState("");
  const [team, setTeam] = useState("");
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    api.getTeams().then(setTeams).catch(() => {});
    api.getPlayers().then(setPlayers).catch(() => {});
    api.getCoaches().then(setCoaches).catch(() => {});
  }, []);

  const save = (e) => { saveWatch("Radar", { id: e.id, name: e.name, team: e.team, position: e.position || e.role }); toast.success(`${e.name} salvato in Watchlist`); };

  const list = useMemo(() => {
    const base = kind === "player" ? players : coaches;
    return base.filter((e) => {
      if (q && !e.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (team && e.team !== team) return false;
      return true;
    });
  }, [kind, players, coaches, q, team]);

  return (
    <div className="fade-up">
      <div className="mb-4 rounded-[2rem] border border-white/10 bg-[#09101d]/70 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-3xl bg-[#2BE07A]/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.35em] text-[#2BE07A]">Database</div>
          <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-white">Database Serie A</h1>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">Negozia con intelligenza: filtra giocatori e allenatori Serie A e prendi decisioni vincenti con dati live e scouting pro.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">{players.length} giocatori</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">{coaches.length} allenatori</span>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {[["player", "Giocatori"], ["coach", "Allenatori"]].map(([k, l]) => (
          <button key={k} data-testid={`kind-${k}`} onClick={() => setKind(k)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${kind === k ? "bg-white text-black" : "glass text-white/60"}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
          <input data-testid="profili-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cerca nome..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-white/40 focus:outline-none" />
        </div>
        <select data-testid="profili-team-filter" value={team} onChange={(e) => setTeam(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-white/40 focus:outline-none">
          <option value="">Tutte</option>
          {teams.map((t) => <option key={t.id} value={t.name} className="bg-[#12141C]">{t.name}</option>)}
        </select>
      </div>

      {list.length === 0 ? (
        <p className="py-12 text-center text-sm text-white/40">Nessun risultato.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {list.map((e) => (
            <Card
              key={e.id}
              e={e}
              onOpen={onOpenProfile}
              onSave={save}
            />
          ))}
        </div>
      )}
    </div>
  );
};
