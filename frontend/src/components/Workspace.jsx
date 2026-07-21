import { useEffect, useState } from "react";
import { Briefcase, PenTool, ChevronDown, TrendingDown, TrendingUp, X, FileText, Copy, Trash2, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import { PlayerCutout, TeamBadge, TierBadge } from "@/components/bits";

const ROLES = [["POR", "Portieri"], ["DIF", "Difensori"], ["CEN", "Centrocampisti"], ["ATT", "Attaccanti"]];
const parseM = (s) => { const m = String(s || "").match(/([\d.]+)/); return m ? parseFloat(m[1]) : 0; };

/* ---------------- Direttore Sportivo ---------------- */
const DirettoreSportivo = () => {
  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState(null);
  const [roster, setRoster] = useState([]);
  const [budget, setBudget] = useState(0);
  const [wages, setWages] = useState(0);
  const [open, setOpen] = useState({ POR: true, DIF: false, CEN: false, ATT: false });
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
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 font-heading text-xl font-black focus:outline-none" style={{ color: budget < 0 ? "#FF4D4D" : "#24E07A" }} />
        </label>
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Spazio Monte Ingaggi (M€)</span>
          <input data-testid="ds-wages" type="number" value={wages} onChange={(e) => setWages(+e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 font-heading text-xl font-black focus:outline-none" style={{ color: wages < 0 ? "#FF4D4D" : "#24E07A" }} />
        </label>
        {deficit && <div className="col-span-2 flex items-center gap-2 rounded-lg bg-red-500/15 px-3 py-2 text-xs font-bold text-red"><TrendingDown size={14} /> Deficit di bilancio! Rientra prima di chiudere.</div>}
      </div>

      {/* Acquisto */}
      <div className="glass mb-4 rounded-2xl p-3">
        <div className="relative">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
          <input data-testid="ds-buy-search" value={buyQ} onChange={(e) => setBuyQ(e.target.value)} placeholder="Simula acquisto: cerca un giocatore..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-[#24E07A] focus:outline-none" />
        </div>
        {buyResults.map((p) => (
          <div key={p.id} className="mt-2 flex items-center gap-2 rounded-lg bg-white/5 p-2">
            <PlayerCutout name={p.name} size={30} /><span className="flex-1 text-sm text-white">{p.name} <span className="text-white/40">· {p.team} · {p.market_value}</span></span>
            <button data-testid={`ds-buy-${p.id}`} onClick={() => buy(p)} className="rounded-lg bg-[#24E07A] px-2.5 py-1 text-xs font-black text-black">Acquista</button>
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

      <button data-testid="ds-report-btn" onClick={() => setReport(true)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#24E07A] py-3 font-heading text-sm font-black uppercase tracking-wider text-black active:scale-[0.98]">
        Vedi Rosa Finale
      </button>

      {report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setReport(false)} />
          <div className="glass-strong pop-in relative z-10 max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl p-5" data-testid="ds-report">
            <button onClick={() => setReport(false)} className="absolute right-4 top-4 text-white/50"><X size={20} /></button>
            <h3 className="mb-3 font-heading text-xl font-black text-white">{team.name} — Rosa Finale</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/5 p-3"><div className="text-[10px] uppercase text-white/40">Budget</div><div className="font-heading text-2xl font-black" style={{ color: budget < 0 ? "#FF4D4D" : "#24E07A" }}>{budget}M</div></div>
              <div className="rounded-xl bg-white/5 p-3"><div className="text-[10px] uppercase text-white/40">Monte Ingaggi</div><div className="font-heading text-2xl font-black" style={{ color: wages < 0 ? "#FF4D4D" : "#24E07A" }}>{wages}M</div></div>
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
const Giornalista = ({ watchlist, removeWatch, onOpenProfile }) => {
  const columns = Object.keys(watchlist).length ? Object.keys(watchlist) : ["Radar"];
  const [busy, setBusy] = useState(false);

  const dossier = async (col) => {
    const items = watchlist[col] || [];
    if (!items.length) { toast.error("Colonna vuota"); return; }
    setBusy(true);
    try {
      const profiles = await Promise.all(items.map((i) => api.getProfile(i.id).catch(() => null)));
      let txt = `DOSSIER — ${col}\n${new Date().toLocaleDateString("it-IT")}\n\n`;
      profiles.filter(Boolean).forEach((p) => {
        txt += `▸ ${p.name} (${p.team}) — ${p.position || p.role}, ${p.age} anni, scadenza ${p.contract_expiry || "---"}\n`;
        const verified = (p.timeline || []).filter((u) => u.verified);
        verified.forEach((u) => { txt += `   • [${u.stage.toUpperCase()}] ${u.text} — ${u.source} ✓\n`; });
        txt += "\n";
      });
      await navigator.clipboard.writeText(txt);
      toast.success("Dossier copiato negli appunti");
    } catch { toast.error("Errore generazione dossier"); }
    finally { setBusy(false); }
  };

  return (
    <div className="fade-up space-y-4">
      <p className="text-sm text-white/60">Salva le notizie e i profili dal feed (icona segnalibro), poi genera un dossier pronto da pubblicare.</p>
      {columns.map((col) => (
        <div key={col} className="glass rounded-2xl p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="font-heading text-sm font-bold uppercase tracking-wider text-white">{col}</span>
            <span className="text-xs text-white/40">({(watchlist[col] || []).length})</span>
            <button data-testid={`dossier-${col}`} onClick={() => dossier(col)} disabled={busy} className="ml-auto flex items-center gap-1.5 rounded-lg bg-[#24E07A] px-3 py-1.5 text-xs font-black uppercase text-black active:scale-95 disabled:opacity-60">
              <FileText size={13} /> Esporta Dossier
            </button>
          </div>
          {(watchlist[col] || []).length === 0 ? (
            <p className="text-xs text-white/30">Nessun elemento salvato.</p>
          ) : (
            <div className="space-y-2">
              {(watchlist[col] || []).map((i) => (
                <div key={i.id} className="flex items-center gap-2 rounded-lg bg-white/5 p-2">
                  <PlayerCutout name={i.name} size={28} />
                  <button onClick={() => onOpenProfile(i.id)} className="flex-1 text-left text-sm font-bold text-white hover:text-green">{i.name} <span className="text-white/40">· {i.team}</span></button>
                  <button onClick={() => removeWatch(col, i.id)} className="text-white/40 hover:text-red"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/* ---------------- Workspace shell ---------------- */
export const Workspace = ({ watchlist, removeWatch, onOpenProfile }) => {
  const [role, setRole] = useState(() => localStorage.getItem("th_role") || "");
  const setR = (r) => { setRole(r); localStorage.setItem("th_role", r); };

  if (!role) {
    return (
      <div className="fade-up flex min-h-[60vh] flex-col justify-center">
        <h1 className="mb-2 text-center font-heading text-3xl font-black uppercase text-white">Come vuoi operare?</h1>
        <p className="mb-8 text-center text-sm text-white/50">Scegli il tuo ruolo. Potrai cambiarlo in seguito.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <button data-testid="role-ds" onClick={() => setR("ds")} className="glass flex flex-col items-center gap-3 rounded-3xl p-8 active:scale-[0.97]">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#24E07A]/15"><Briefcase size={30} className="text-green" /></span>
            <span className="font-heading text-lg font-black text-white">Direttore Sportivo</span>
            <span className="text-center text-xs text-white/50">Simula il mercato: budget, cessioni e acquisti.</span>
          </button>
          <button data-testid="role-journalist" onClick={() => setR("journalist")} className="glass flex flex-col items-center gap-3 rounded-3xl p-8 active:scale-[0.97]">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/15"><PenTool size={30} className="text-blue-400" /></span>
            <span className="font-heading text-lg font-black text-white">Giornalista</span>
            <span className="text-center text-xs text-white/50">Watchlist, archivio e generatore di dossier.</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-black uppercase text-white">{role === "ds" ? "Direttore Sportivo" : "Giornalista"}</h1>
        <button data-testid="role-switch" onClick={() => setR(role === "ds" ? "journalist" : "ds")} className="rounded-xl glass px-3 py-2 text-xs font-bold text-white/70">Cambia ruolo</button>
      </div>
      {role === "ds" ? <DirettoreSportivo /> : <Giornalista watchlist={watchlist} removeWatch={removeWatch} onOpenProfile={onOpenProfile} />}
    </div>
  );
};
