import { useEffect, useState, useMemo } from "react";
import { Search, Bookmark } from "lucide-react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import { PlayerCutout, TeamBadge, TierBadge } from "@/components/bits";

const Card = ({ e, onOpen, onSave }) => (
  <div data-testid={`profile-card-${e.id}`}
    className="glass fade-up flex items-center gap-3 rounded-2xl p-3 transition-transform active:scale-[0.98]">
    <button onClick={() => onOpen(e.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
      <PlayerCutout name={e.name} size={52} />
      <div className="min-w-0 flex-1">
        <div className="truncate font-heading text-[15px] font-bold text-white">{e.name}</div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/50">
          <TeamBadge team={e.team} size={18} /> {e.team} · {e.position || e.role}
        </div>
      </div>
    </button>
    {e.value_tier && <TierBadge tier={e.value_tier} />}
    <button data-testid={`save-${e.id}`} onClick={() => onSave(e)} title="Salva in Watchlist"
      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-colors hover:text-green active:scale-90">
      <Bookmark size={15} />
    </button>
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
      <h1 className="mb-1 font-heading text-3xl font-black uppercase tracking-tight text-white">Profili</h1>
      <p className="mb-4 text-sm text-white/50">Database Serie A — {players.length} giocatori · {coaches.length} allenatori</p>

      <div className="mb-3 flex gap-2">
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
          {list.map((e) => <Card key={e.id} e={e} onOpen={onOpenProfile} onSave={save} />)}
        </div>
      )}
    </div>
  );
};
