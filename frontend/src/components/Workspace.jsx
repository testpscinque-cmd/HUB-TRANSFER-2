import { useEffect, useState } from "react";
import { Briefcase, PenTool, ChevronDown, TrendingDown, TrendingUp, X, Trash2, Search, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { PlayerCutout, TeamBadge, TierBadge } from "@/components/bits";
import { ArticleDraftDialog } from "@/components/ArticleDraftDialog";
import { TransferCardDialog } from "@/components/TransferCardDialog";

const ROLES = [["POR", "Portieri"], ["DIF", "Difensori"], ["CEN", "Centrocampisti"], ["ATT", "Attaccanti"]];
const ROLE_FLAG = { POR: "#F5C518", DIF: "#8B93A7", CEN: "#2BE07A", ATT: "#FF7A00" };
const RoleFlag = ({ code }) => code ? (
  <span className="rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider"
    style={{ color: ROLE_FLAG[code] || "#8B93A7", background: `${ROLE_FLAG[code] || "#8B93A7"}1f`, border: `1px solid ${ROLE_FLAG[code] || "#8B93A7"}55` }}>{code}</span>
) : null;
const parseM = (s) => { const m = String(s || "").match(/([\d.]+)/); return m ? parseFloat(m[1]) : 0; };

/* ---------------- Direttore Sportivo ---------------- */
const DirettoreSportivo = () => {
  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState(null);
  const [roster, setRoster] = useState([]);
  const [budget, setBudget] = useState(0);
  const [wages, setWages] = useState(0);
  const [open, setOpen] = useState({ POR: true, DIF: true, CEN: true, ATT: true });
  const [allPlayers, setAllPlayers] = useState([]);
  const [buyQ, setBuyQ] = useState("");
  const [report, setReport] = useState(false);
  const [moves, setMoves] = useState({ in: [], out: [] });

  useEffect(() => { api.getTeams().then(setTeams); api.getPlayers().then(setAllPlayers); }, []);

  const pick = async (name) => {
    const t = teams.find((x) => x.name === name);
    if (!t) return;
    setTeam(t); setBudget(t.budget_m); setWages(t.wage_space_m); setMoves({ in: [], out: [] });
    const pl = await api.getPlayers({ team: name });
    setRoster(pl.map((p) => ({ ...p })));
  };

  const sell = (p) => {
    setRoster((r) => r.filter((x) => x.id !== p.id));
    setBudget((b) => +(b + parseM(p.market_value)).toFixed(1));
    setWages((w) => +(w + parseM(p.salary)).toFixed(1));
    setMoves((m) => ({ ...m, out: [...m.out, p] }));
    toast.success(`Ceduto ${p.name} · +${parseM(p.market_value)}M budget`);
  };
  const buy = (p) => {
    if (roster.find((x) => x.id === p.id)) { toast.error("Già in rosa"); return; }
    setRoster((r) => [{ ...p, isNew: true }, ...r]);
    setBudget((b) => +(b - parseM(p.market_value)).toFixed(1));
    setWages((w) => +(w - parseM(p.salary)).toFixed(1));
    setMoves((m) => ({ ...m, in: [...m.in, p] }));
    setBuyQ("");
    toast.success(`Acquistato ${p.name} · -${parseM(p.market_value)}M budget`);
  };

  const deficit = budget < 0 || wages < 0;
  const buyResults = buyQ.length >= 2 ? allPlayers.filter((p) => p.name.toLowerCase().includes(buyQ.toLowerCase()) && p.team !== team?.name).slice(0, 5) : [];

  if (!team) {
    return (
      <div className="fade-up">
        <p className="mb-3 text-sm text-white/60">Scegli una squadra di Serie A per avviare la simulazione di mercato (sandbox).</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {teams.map((t) => (
            <button key={t.id} data-testid={`ds-team-${t.id}`} onClick={() => pick(t.name)} className="glass flex items-center gap-2 rounded-2xl p-3 active:scale-95">
              <TeamBadge team={t} size={34} /><div className="text-left"><div className="text-sm font-bold text-white">{t.name}</div><TierBadge tier={t.wealth_tier} /></div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <button onClick={() => setTeam(null)} className="mb-3 text-xs font-bold text-white/50">← Cambia squadra</button>
      {/* Cruscotto */}
      <div className={`glass mb-4 grid grid-cols-2 gap-3 rounded-2xl p-4 ${deficit ? "ring-1 ring-red-500" : ""}`}>
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Budget Trasferimenti (M€)</span>
          <input data-testid="ds-budget" type="number" value={budget} onChange={(e) => setBudget(+e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 font-heading text-xl font-black focus:outline-none" style={{ color: budget < 0 ? "#FF4D4D" : "#E9EEF7" }} />
        </label>
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Spazio Monte Ingaggi (M€)</span>
          <input data-testid="ds-wages" type="number" value={wages} onChange={(e) => setWages(+e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 font-heading text-xl font-black focus:outline-none" style={{ color: wages < 0 ? "#FF4D4D" : "#E9EEF7" }} />
        </label>
        {deficit && <div className="col-span-2 flex items-center gap-2 rounded-lg bg-red-500/15 px-3 py-2 text-xs font-bold text-red"><TrendingDown size={14} /> Deficit di bilancio! Rientra prima di chiudere.</div>}
      </div>

      {/* Acquisto */}
      <div className="glass mb-4 rounded-2xl p-3">
        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
          <input data-testid="ds-buy-search" value={buyQ} onChange={(e) => setBuyQ(e.target.value)} placeholder="Simula acquisto: cerca un giocatore..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-[#E9EEF7] focus:outline-none" />
        </div>
        {buyResults.map((p) => (
          <div key={p.id} className="mt-2 flex items-center gap-2 rounded-lg bg-white/5 p-2">
            <PlayerCutout name={p.name} size={30} /><span className="flex-1 text-sm text-white">{p.name} <span className="text-white/40">· {p.team} · {p.market_value}</span></span>
            <button data-testid={`ds-buy-${p.id}`} onClick={() => buy(p)} className="rounded-lg bg-[#E9EEF7] px-2.5 py-1 text-xs font-black text-black">Acquista</button>
          </div>
        ))}
      </div>

      {/* Rosa a cassetti */}
      {ROLES.map(([code, label]) => {
        const group = roster.filter((p) => p.position === code);
        return (
          <div key={code} className="glass mb-2 overflow-hidden rounded-2xl">
            <button onClick={() => setOpen((o) => ({ ...o, [code]: !o[code] }))} className="flex w-full items-center gap-2 px-4 py-3">
              <span className="font-heading text-sm font-bold uppercase tracking-wider text-white">{label}</span>
              <span className="text-xs text-white/40">({group.length})</span>
              <ChevronDown size={16} className={`ml-auto text-white/40 transition-transform ${open[code] ? "rotate-180" : ""}`} />
            </button>
            {open[code] && (
              <div className="space-y-1.5 px-3 pb-3">
                {group.length === 0 && <p className="px-1 py-2 text-xs text-white/30">Nessun giocatore.</p>}
                {group.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 rounded-lg bg-white/5 p-2">
                    <PlayerCutout name={p.name} size={30} />
                    <div className="min-w-0 flex-1"><div className="truncate text-sm font-bold text-white">{p.name} {p.isNew && <span className="text-[9px] font-black text-green">NUOVO</span>}</div><div className="text-[11px] text-white/40">{p.market_value} · {p.salary}</div></div>
                    <button data-testid={`ds-sell-${p.id}`} onClick={() => sell(p)} className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-white/80 active:scale-95">Cedi</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <button data-testid="ds-report-btn" onClick={() => setReport(true)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E9EEF7] py-3 font-heading text-sm font-black uppercase tracking-wider text-black active:scale-[0.98]">
        Vedi Rosa Finale
      </button>

      {report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setReport(false)} />
          <div className="glass-strong pop-in relative z-10 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl p-5" data-testid="ds-report">
            <button onClick={() => setReport(false)} className="absolute right-4 top-4 text-white/50"><X size={20} /></button>
            <h3 className="mb-3 font-heading text-xl font-black text-white">{team.name} — Rosa Finale</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/5 p-3"><div className="text-[10px] uppercase text-white/40">Budget</div><div className="font-heading text-2xl font-black" style={{ color: budget < 0 ? "#FF4D4D" : "#E9EEF7" }}>{budget}M</div></div>
              <div className="rounded-xl bg-white/5 p-3"><div className="text-[10px] uppercase text-white/40">Monte Ingaggi</div><div className="font-heading text-2xl font-black" style={{ color: wages < 0 ? "#FF4D4D" : "#E9EEF7" }}>{wages}M</div></div>
            </div>
            <p className="mt-4 flex items-center gap-1 text-xs font-bold uppercase text-green"><TrendingUp size={13} /> Acquisti ({moves.in.length})</p>
            {moves.in.map((p) => <div key={p.id} className="text-sm text-white/80">+ {p.name} <span className="text-white/40">({p.market_value})</span></div>)}
            <p className="mt-3 flex items-center gap-1 text-xs font-bold uppercase text-red"><TrendingDown size={13} /> Cessioni ({moves.out.length})</p>
            {moves.out.map((p) => <div key={p.id} className="text-sm text-white/80">− {p.name} <span className="text-white/40">({p.market_value})</span></div>)}
            <p className="mt-4 text-sm text-white/60">Rosa attuale: <b className="text-white">{roster.length}</b> giocatori.</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- Giornalista ---------------- */
const Giornalista = ({ watchlist, removeWatch, saveWatch, onOpenProfile }) => {
  const { t } = useI18n();
  const columns = Object.keys(watchlist).length ? Object.keys(watchlist) : ["Radar"];
  const [busy, setBusy] = useState(false);
  const [allPlayers, setAllPlayers] = useState([]);
  const [jq, setJq] = useState("");
  const [target, setTarget] = useState(columns[0] || "Radar");
  const [newCol, setNewCol] = useState("");
  const [transferProfile, setTransferProfile] = useState(null);
  const [draftProfile, setDraftProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => { api.getPlayers().then(setAllPlayers).catch(() => {}); }, []);

  const results = jq.length >= 2 ? allPlayers.filter((p) => p.name.toLowerCase().includes(jq.toLowerCase())).slice(0, 6) : [];
  const add = (p) => { saveWatch(target || "Radar", { id: p.id, name: p.name, team: p.team, position: p.position }); toast.success(`${p.name} aggiunto a ${target}`); setJq(""); };
  const createCol = () => { if (!newCol.trim()) return; setTarget(newCol.trim()); toast.success(`Colonna "${newCol.trim()}" pronta — aggiungi un giocatore`); };

  const openTransferFor = async (id) => {
    setProfileLoading(true);
    const profile = await api.getProfile(id).catch(() => null);
    setProfileLoading(false);
    if (!profile) { toast.error("Impossibile caricare il profilo"); return; }
    setTransferProfile(profile);
  };

  const openDraftFor = async (id) => {
    setProfileLoading(true);
    const profile = await api.getProfile(id).catch(() => null);
    setProfileLoading(false);
    if (!profile) { toast.error("Impossibile caricare il profilo"); return; }
    setDraftProfile(profile);
  };

  const closeTransfer = () => setTransferProfile(null);
  const closeDraft = () => setDraftProfile(null);

  return (
    <div className="fade-up space-y-4">
      <p className="text-sm text-white/60">Cerca e salva giocatori nelle tue liste, poi genera report e Transfer Card profilate.</p>

      <div className="glass rounded-2xl p-4">
        <div className="relative mb-3">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
          <input data-testid="jrn-search" value={jq} onChange={(e) => setJq(e.target.value)} placeholder="Cerca un giocatore da salvare..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-3 text-sm text-white placeholder:text-white/40 focus:border-[#2BE07A]/50 focus:outline-none" />
        </div>
        {results.length > 0 && (
          <div className="mb-3 space-y-2">
            {results.map((p) => (
              <div key={p.id} className="flex items-center gap-2.5 rounded-xl bg-white/5 p-2.5 hover-lift">
                <PlayerCutout name={p.name} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-white">{p.name}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    {p.team && <TeamBadge team={p.team} size={16} />}
                    <RoleFlag code={p.position} />
                  </div>
                </div>
                <button data-testid={`jrn-add-${p.id}`} onClick={() => add(p)} className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-black text-[#0A0E17] active:scale-95"><Plus size={12} /> Aggiungi</button>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">Salva in lista</span>
          <select data-testid="jrn-target" value={target} onChange={(e) => setTarget(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white focus:outline-none">
            {[...new Set([...columns, target])].filter(Boolean).map((c) => <option key={c} value={c} className="bg-[#141A28]">{c}</option>)}
          </select>
          <input value={newCol} onChange={(e) => setNewCol(e.target.value)} placeholder="+ nuova lista"
            className="w-28 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white placeholder:text-white/35 focus:outline-none" />
          <button data-testid="jrn-newcol" onClick={createCol} className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white active:scale-95">Crea</button>
        </div>
      </div>

      {columns.map((col) => (
        <div key={col} className="glass rounded-2xl p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="font-heading text-sm font-bold uppercase tracking-wider text-white">{col}</span>
            <span className="text-xs text-white/40">({(watchlist[col] || []).length})</span>
          </div>
          {(watchlist[col] || []).length === 0 ? (
            <p className="text-xs text-white/30">Nessun elemento salvato.</p>
          ) : (
            <div className="space-y-2">
              {(watchlist[col] || []).map((i) => (
                <div key={i.id} className="flex items-center gap-2.5 rounded-xl bg-white/5 p-2.5 hover-lift">
                  <PlayerCutout name={i.name} size={32} />
                  <button onClick={() => (/^(p|c)-/.test(i.id) ? onOpenProfile(i.id) : (i.link && window.open(i.link, "_blank")))} className="min-w-0 flex-1 text-left hover:opacity-80">
                    <div className="truncate text-sm font-bold text-white">{i.name}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      {i.team && <TeamBadge team={i.team} size={16} />}
                      {i.position
                        ? <RoleFlag code={i.position} />
                        : <span className="rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#2BE07A]" style={{ background: "rgba(43,224,122,0.14)", border: "1px solid rgba(43,224,122,0.4)" }}>Scoop</span>}
                    </div>
                  </button>
                  {i.link && <a href={i.link} target="_blank" rel="noreferrer" className="text-white/40 hover:text-[#2BE07A]"><ExternalLink size={14} /></a>}
                  {/^(p|c)-/.test(i.id) && (
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); openTransferFor(i.id); }} disabled={profileLoading} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white/80 hover:bg-white/10 disabled:opacity-50">
                        TRANSFER CARD
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); openDraftFor(i.id); }} disabled={profileLoading} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white/80 hover:bg-white/10 disabled:opacity-50">
                        ESPORTA BOZZA
                      </button>
                    </div>
                  )}
                  <button onClick={() => removeWatch(col, i.id)} className="text-white/40 hover:text-red"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <TransferCardDialog open={Boolean(transferProfile)} onClose={closeTransfer} profile={transferProfile} rumors={transferProfile?.timeline || []} />
      <ArticleDraftDialog open={Boolean(draftProfile)} onClose={closeDraft} profile={draftProfile} />
    </div>
  );
};

/* ---------------- Workspace shell ---------------- */
export const Workspace = ({ watchlist, removeWatch, saveWatch, onOpenProfile }) => {
  const [role, setRole] = useState(() => localStorage.getItem("th_role") || "");
  const setR = (r) => { setRole(r); localStorage.setItem("th_role", r); };

  if (!role) {
    return (
      <div className="fade-up flex min-h-[60vh] flex-col justify-center">
        <h1 className="mb-2 text-center font-heading text-3xl font-black uppercase text-white">Come vuoi operare?</h1>
        <p className="mb-8 text-center text-sm text-white/50">Scegli il tuo ruolo. Potrai cambiarlo in seguito.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <button data-testid="role-ds" onClick={() => setR("ds")} className="glass flex flex-col items-center gap-3 rounded-3xl p-8 active:scale-[0.97]">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E9EEF7]/15"><Briefcase size={30} className="text-green" /></span>
            <span className="font-heading text-lg font-black text-white">Direttore Sportivo</span>
            <span className="text-center text-xs text-white/50">Simula il mercato: budget, cessioni e acquisti.</span>
          </button>
          <button data-testid="role-journalist" onClick={() => setR("journalist")} className="glass flex flex-col items-center gap-3 rounded-3xl p-8 active:scale-[0.97]">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10"><PenTool size={30} className="text-white/80" /></span>
            <span className="font-heading text-lg font-black text-white">Giornalista</span>
            <span className="text-center text-xs text-white/50">Watchlist, archivio e report executive.</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-black uppercase text-white">{role === "ds" ? "Direttore Sportivo" : "Giornalista"}</h1>
        <div className="flex rounded-xl glass p-1">
          <button data-testid="role-toggle-ds" onClick={() => setR("ds")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-black uppercase tracking-wide transition-all ${role === "ds" ? "bg-white text-black" : "text-white/55 hover:text-white/80"}`}>DS</button>
          <button data-testid="role-toggle-journalist" onClick={() => setR("journalist")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-black uppercase tracking-wide transition-all ${role === "journalist" ? "bg-white text-black" : "text-white/55 hover:text-white/80"}`}>Giornalista</button>
        </div>
      </div>
      {role === "ds" ? <DirettoreSportivo /> : <Giornalista watchlist={watchlist} removeWatch={removeWatch} saveWatch={saveWatch} onOpenProfile={onOpenProfile} />}
    </div>
  );
};
