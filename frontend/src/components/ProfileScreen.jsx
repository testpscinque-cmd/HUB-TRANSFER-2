import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, CalendarClock, Wallet, TrendingUp, Flag, Radio } from "lucide-react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import { PlayerCutout, TeamBadge, TierBadge, VerifiedTick, StatusBar, dateFull } from "@/components/bits";

const STAGE = { rumor: { c: "#8B93A7", l: "Rumor" }, trattativa: { c: "#F5C518", l: "Trattativa" }, ufficiale: { c: "#22C55E", l: "Ufficiale" } };
const V = (x) => (x === undefined || x === null || x === "" ? "---" : x);

const Data = ({ icon: Icon, label, value, accent }) => (
  <div className="glass rounded-xl px-3 py-2.5">
    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/40"><Icon size={12} /> {label}</div>
    <div className="mt-0.5 font-heading text-sm font-bold" style={{ color: accent || "#fff" }}>{value}</div>
  </div>
);

export const ProfileScreen = ({ id, onBack, saveWatch }) => {
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getProfile(id).then(setP).catch(() => toast.error("Profilo non trovato")).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><span className="h-8 w-8 rounded-full border-2 border-white/20 border-t-[#2E7DF6] spin" /></div>;
  if (!p) return null;

  const isCoach = p.kind === "coach";
  const bookmark = () => { saveWatch("Radar", { id: p.id, name: p.name, team: p.team, position: p.position || p.role }); toast.success("Salvato nella Watchlist (Radar)"); };

  return (
    <div className="fade-up">
      <div className="mb-4 flex items-center justify-between">
        <button data-testid="profile-back" onClick={onBack} className="flex items-center gap-1.5 rounded-xl glass px-3 py-2 text-sm font-bold text-white/80"><ArrowLeft size={16} /> Indietro</button>
        <button data-testid="profile-bookmark" onClick={bookmark} className="flex items-center gap-1.5 rounded-xl glass px-3 py-2 text-sm font-bold text-green"><Bookmark size={16} /> Salva</button>
      </div>

      {/* Top — anagrafica */}
      <div className="glass relative overflow-hidden rounded-3xl p-5">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full" style={{ background: `radial-gradient(circle, ${p.team_info?.color || "#2E7DF6"}44, transparent 70%)` }} />
        <div className="relative flex items-center gap-4">
          <PlayerCutout name={p.name} size={92} color={p.team_info?.color} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {!isCoach && <TierBadge tier={p.value_tier} />}
              {isCoach && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white/70">Allenatore</span>}
              {p.extracomunitario && <span className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase text-yellow" style={{ background: "#F5C51818", border: "1px solid #F5C51844" }}>Extracom.</span>}
            </div>
            <h1 className="mt-1 font-heading text-2xl font-black leading-tight text-white">{p.name}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-white/60"><TeamBadge team={p.team_info || p.team} size={20} /> <span className="font-bold text-white">{V(p.team)}</span></div>
          </div>
        </div>
        <div className="relative mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Data icon={Flag} label="Età" value={V(p.age)} />
          <Data icon={Radio} label="Ruolo" value={V(p.position || p.role)} />
          <Data icon={CalendarClock} label="Scadenza" value={V(p.contract_expiry)} accent={Number(p.contract_expiry) <= 2026 ? "#FF4D4D" : "#2E7DF6"} />
          {!isCoach && <Data icon={Wallet} label="Ingaggio" value={V(p.salary)} />}
          {!isCoach && <Data icon={TrendingUp} label="Valore" value={V(p.market_value)} />}
          <Data icon={Flag} label="Nazione" value={V(p.nationality)} />
        </div>
      </div>

      {/* Bottom — Linea Evolutiva */}
      <div className="mt-5">
        <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-[0.2em] text-white/50">Linea Evolutiva</h2>
        {(!p.timeline || p.timeline.length === 0) ? (
          <p className="glass rounded-2xl p-5 text-center text-sm text-white/40">Nessun aggiornamento tracciato per questo profilo.</p>
        ) : (
          <div className="pl-1">
            {p.timeline.map((u, i) => {
              const st = STAGE[u.stage] || STAGE.rumor;
              return (
                <div key={i} data-testid={`timeline-${i}`} className="fade-up relative border-l-2 border-white/10 pb-6 pl-6 last:border-transparent last:pb-0" style={{ animationDelay: `${i * 60}ms` }}>
                  <span className="absolute left-[-7px] top-1 h-3 w-3 rounded-full" style={{ background: st.c, boxShadow: `0 0 10px ${st.c}` }} />
                  <div className="glass rounded-2xl p-3">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase" style={{ color: st.c, background: `${st.c}18` }}>{st.l}</span>
                      {u.type === "video" && <span className="rounded bg-red-500 px-1.5 py-0.5 text-[9px] font-black uppercase text-white">Video</span>}
                      <span className="ml-auto text-[11px] text-white/40">{dateFull(u.date)}</span>
                    </div>
                    <p className="text-sm leading-snug text-white/85">{u.text}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-white/60">
                      <Radio size={11} /> <span className="font-bold text-white/85">{u.source}</span> {u.verified && <VerifiedTick size={12} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
