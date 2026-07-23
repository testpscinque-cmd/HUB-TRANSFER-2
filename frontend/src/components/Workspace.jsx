import { useEffect, useState } from "react";
import { Briefcase, PenTool, ChevronDown, TrendingDown, TrendingUp, X, Trash2, Search, Plus, ExternalLink, Pencil, Check, Bookmark, Copy, Zap, Radio } from "lucide-react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { PlayerCutout, TeamBadge, TierBadge, VerifiedTick, timeAgo } from "@/components/bits";
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

  const [deal, setDeal] = useState(null);
  const openDeal = (mode, p) => {
    if (mode === "buy") setDeal({ mode, player: p, name: p.name, position: p.position, team: p.team, fee: parseM(p.market_value), wage: parseM(p.salary) });
    else if (mode === "sell") setDeal({ mode, player: p, name: p.name, position: p.position, fee: parseM(p.market_value), wage: parseM(p.salary) });
    else setDeal({ mode: "custom", name: "", position: "ATT", team: "", fee: 0, wage: 0 });
  };
  const setDF = (k, v) => setDeal((d) => ({ ...d, [k]: v }));
  const confirmDeal = () => {
    const d = deal;
    if (d.mode === "sell") {
      setRoster((r) => r.filter((x) => x.id !== d.player.id));
      setBudget((b) => +(b + (+d.fee || 0)).toFixed(1));
      setWages((w) => +(w + (+d.wage || 0)).toFixed(1));
      setMoves((m) => ({ ...m, out: [...m.out, { ...d.player, market_value: `€${d.fee}M` }] }));
      toast.success(`Ceduto ${d.player.name} · +${d.fee}M budget`);
    } else {
      if (d.mode === "custom" && !d.name.trim()) { toast.error("Inserisci il nome del giocatore"); return; }
      const id = d.mode === "custom" ? `custom-${Date.now()}` : d.player.id;
      const np = { id, name: d.name, position: d.position, team: d.mode === "custom" ? (d.team || "Svincolato") : d.player.team,
        market_value: `€${d.fee}M`, salary: `€${d.wage}M`, value_tier: d.player?.value_tier || "Media", isNew: true };
      setRoster((r) => [np, ...r]);
      setBudget((b) => +(b - (+d.fee || 0)).toFixed(1));
      setWages((w) => +(w - (+d.wage || 0)).toFixed(1));
      setMoves((m) => ({ ...m, in: [...m.in, np] }));
      toast.success(`Acquistato ${d.name} · -${d.fee}M budget`);
    }
    setDeal(null); setBuyQ("");
  };
  const sell = (p) => openDeal("sell", p);
  const buy = (p) => { if (roster.find((x) => x.id === p.id)) { toast.error("Già in rosa"); return; } openDeal("buy", p); };

  const [editId, setEditId] = useState(null);
  const [editVals, setEditVals] = useState({});
  const startEdit = (p) => { setEditId(p.id); setEditVals({ name: p.name, salary: p.salary, market_value: p.market_value }); };
  const saveEdit = (id) => { setRoster((r) => r.map((x) => (x.id === id ? { ...x, ...editVals } : x))); setEditId(null); toast.success("Giocatore aggiornato"); };

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
        <div className="mb-2 flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
            <input data-testid="ds-buy-search" value={buyQ} onChange={(e) => setBuyQ(e.target.value)} placeholder="Cerca un giocatore da acquistare..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-[#2BE07A]/50 focus:outline-none" />
          </div>
          <button data-testid="ds-custom-btn" onClick={() => openDeal("custom")} title="Giocatore fuori campionato"
            className="flex items-center gap-1 rounded-xl bg-[#2BE07A] px-3 py-2 text-xs font-black uppercase text-black active:scale-95"><Plus size={13} /> Fuori Serie A</button>
        </div>
        {buyResults.map((p) => (
          <div key={p.id} className="mt-2 flex items-center gap-2 rounded-lg bg-white/5 p-2">
            <PlayerCutout name={p.name} team={p.team} size={30} />
            <span className="flex-1 text-sm text-white">{p.name} <span className="text-white/40">· {p.team} · {p.market_value}</span></span>
            <button data-testid={`ds-buy-${p.id}`} onClick={() => buy(p)} className="rounded-lg bg-[#E9EEF7] px-2.5 py-1 text-xs font-black text-black active:scale-95">Tratta</button>
          </div>
        ))}
      </div>

      {/* Campo (panoramica formazione) */}
      <div className="relative mb-3 h-32 overflow-hidden rounded-2xl border border-white/10" style={{ background: "linear-gradient(160deg,#0d7a3a,#0a5227)" }}>
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0 2px, transparent 2px 34px)" }} />
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/25" />
        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-white/25" />
        <div className="relative flex h-full items-center justify-around px-3 text-center text-white">
          {ROLES.map(([code]) => (
            <div key={code} className="flex flex-col items-center">
              <span className="font-heading text-2xl font-black" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}>{roster.filter((p) => p.position === code).length}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/85">{code}</span>
            </div>
          ))}
        </div>
        <span className="absolute right-3 top-2 rounded bg-black/30 px-2 py-0.5 text-[10px] font-black uppercase text-white/90">{roster.length} in rosa</span>
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
                  <div key={p.id} className="rounded-lg bg-white/5 p-2">
                    {editId === p.id ? (
                      <div className="flex flex-col gap-1.5">
                        <input data-testid={`ds-edit-name-${p.id}`} value={editVals.name} onChange={(e) => setEditVals((v) => ({ ...v, name: e.target.value }))}
                          className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-sm font-bold text-white focus:border-[#2BE07A]/50 focus:outline-none" />
                        <div className="flex gap-1.5">
                          <input data-testid={`ds-edit-salary-${p.id}`} value={editVals.salary} onChange={(e) => setEditVals((v) => ({ ...v, salary: e.target.value }))} placeholder="Ingaggio"
                            className="min-w-0 flex-1 rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs text-white placeholder:text-white/35 focus:outline-none" />
                          <input data-testid={`ds-edit-value-${p.id}`} value={editVals.market_value} onChange={(e) => setEditVals((v) => ({ ...v, market_value: e.target.value }))} placeholder="Valore"
                            className="min-w-0 flex-1 rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs text-white placeholder:text-white/35 focus:outline-none" />
                          <button data-testid={`ds-save-${p.id}`} onClick={() => saveEdit(p.id)} className="rounded-md bg-[#2BE07A] px-2 py-1 text-black active:scale-95"><Check size={14} /></button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <PlayerCutout name={p.name} team={p.team} size={30} />
                        <div className="min-w-0 flex-1"><div className="truncate text-sm font-bold text-white">{p.name} {p.isNew && <span className="text-[9px] font-black text-green">NUOVO</span>}</div><div className="text-[11px] text-white/40">{p.market_value} · {p.salary}</div></div>
                        <button data-testid={`ds-edit-${p.id}`} onClick={() => startEdit(p)} title="Modifica" className="text-white/40 hover:text-white active:scale-90"><Pencil size={14} /></button>
                        <button data-testid={`ds-sell-${p.id}`} onClick={() => sell(p)} className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-white/80 active:scale-95">Cedi</button>
                      </div>
                    )}
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

      {deal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setDeal(null)} />
          <div className="glass-strong pop-in relative z-10 w-full max-w-sm rounded-3xl p-5" data-testid="ds-deal-modal">
            <button onClick={() => setDeal(null)} className="absolute right-4 top-4 text-white/50"><X size={20} /></button>
            <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: deal.mode === "sell" ? "#FF6B6B" : "#2BE07A" }}>
              {deal.mode === "sell" ? "Cessione" : deal.mode === "custom" ? "Colpo fuori Serie A" : "Trattativa in entrata"}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <PlayerCutout name={deal.name || "?"} team={deal.team} size={48} />
              <div className="min-w-0 flex-1">
                {deal.mode === "custom" ? (
                  <input data-testid="ds-deal-name" value={deal.name} onChange={(e) => setDF("name", e.target.value)} placeholder="Nome giocatore"
                    className="w-full rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-sm font-bold text-white placeholder:text-white/35 focus:outline-none" />
                ) : (
                  <div className="truncate font-heading text-lg font-black text-white">{deal.name}</div>
                )}
                <div className="mt-1 flex items-center gap-1.5">
                  {deal.mode === "custom" ? (
                    <>
                      <select value={deal.position} onChange={(e) => setDF("position", e.target.value)} className="rounded border border-white/10 bg-white/10 px-1.5 py-0.5 text-[11px] text-white focus:outline-none">
                        {ROLES.map(([c]) => <option key={c} value={c} className="bg-[#141A28]">{c}</option>)}
                      </select>
                      <input value={deal.team} onChange={(e) => setDF("team", e.target.value)} placeholder="Da (club)" className="w-24 rounded border border-white/10 bg-white/10 px-1.5 py-0.5 text-[11px] text-white placeholder:text-white/35 focus:outline-none" />
                    </>
                  ) : <RoleFlag code={deal.position} />}
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">{deal.mode === "sell" ? "Incasso cartellino (M€)" : "Costo cartellino (M€)"}</span>
                <input data-testid="ds-deal-fee" type="number" value={deal.fee} onChange={(e) => setDF("fee", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-2 py-2 font-heading text-lg font-black text-white focus:border-[#2BE07A]/50 focus:outline-none" />
              </label>
              <label className="block">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Ingaggio (M€/anno)</span>
                <input data-testid="ds-deal-wage" type="number" value={deal.wage} onChange={(e) => setDF("wage", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-2 py-2 font-heading text-lg font-black text-white focus:border-[#2BE07A]/50 focus:outline-none" />
              </label>
            </div>
            <button data-testid="ds-deal-confirm" onClick={confirmDeal}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-heading text-sm font-black uppercase tracking-wider active:scale-[0.98]"
              style={{ background: deal.mode === "sell" ? "#FF6B6B" : "#2BE07A", color: deal.mode === "sell" ? "#fff" : "#000" }}>
              <Check size={16} /> {deal.mode === "sell" ? "Conferma cessione" : "Chiudi la trattativa"}
            </button>
          </div>
        </div>
      )}

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
  const [news, setNews] = useState([]);
  const [bk, setBk] = useState({ player: "", from: "", to: "", stage: "ufficiale", fee: "" });
  const [bkText, setBkText] = useState("");

  useEffect(() => {
    api.getPlayers().then(setAllPlayers).catch(() => {});
    api.getLiveNews("Serie A", 16).then(setNews).catch(() => {});
  }, []);

  const copyText = (text) => {
    const done = () => toast.success("Copiato negli appunti!");
    const fb = () => { const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.focus(); ta.select(); try { document.execCommand("copy"); done(); } catch { toast.error("Copia non riuscita"); } document.body.removeChild(ta); };
    try { if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done).catch(fb); else fb(); } catch { fb(); }
  };
  const genBreaking = () => {
    const { player, from, to, stage, fee } = bk;
    if (!player.trim()) { toast.error("Inserisci il nome del giocatore"); return; }
    const route = [from, to].filter(Boolean).join(" ➡️ ");
    const feeTxt = fee ? ` Operazione da ${fee}.` : "";
    let txt;
    if (stage === "ufficiale") txt = `🚨🟢 UFFICIALE: ${player}${to ? ` è un nuovo giocatore del ${to}` : ""}. HERE WE GO! ✅\n\n${route}${feeTxt}\nContratto depositato, annuncio ufficiale in arrivo.\n\n#Calciomercato #SerieA`;
    else if (stage === "herewego") txt = `🚨 ${player} ➡️ ${to || "?"}. HERE WE GO! ✅🔴 Accordo totale tra i club e col giocatore, visite mediche fissate.${feeTxt}\n\n#HereWeGo #SerieA`;
    else if (stage === "trattativa") txt = `🔵 ${player}: trattativa avviata${to ? ` con il ${to}` : ""}. Contatti diretti in corso${fee ? `, base d'intesa ${fee}` : ""}. Fiducia in crescita nelle prossime ore. 🔎\n\n${route}\n#Calciomercato #SerieA`;
    else txt = `📝 ${player}: nome nuovo sul taccuino${to ? ` del ${to}` : ""}. Indiscrezione da verificare, si valuta la fattibilità dell'operazione.${feeTxt}\n\n#Calciomercato #Rumor`;
    setBkText(txt);
  };
  const saveNews = (n) => { saveWatch("Scoop", { id: `post-${n.id}`, name: n.title, team: n.source, link: n.link }); toast.success("Scoop salvato"); };

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
    <div className="fade-up grid gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <p className="text-sm text-white/60">Il tuo desk: salva scoop, costruisci watchlist e sforna annunci pronti da pubblicare.</p>

        {/* Breaking Studio — genera annunci pronti da postare */}
        <div className="glass rounded-2xl p-4" data-testid="breaking-studio" style={{ borderTop: "2px solid #2BE07A" }}>
          <p className="mb-3 flex items-center gap-1.5 font-heading text-sm font-black uppercase tracking-wider text-white"><Zap size={15} className="text-[#2BE07A]" fill="#2BE07A" /> Breaking Studio</p>
          <div className="grid grid-cols-2 gap-2">
            <input data-testid="bk-player" value={bk.player} onChange={(e) => setBk((b) => ({ ...b, player: e.target.value }))} placeholder="Giocatore" className="col-span-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-[#2BE07A]/50 focus:outline-none" />
            <input value={bk.from} onChange={(e) => setBk((b) => ({ ...b, from: e.target.value }))} placeholder="Da (club)" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none" />
            <input value={bk.to} onChange={(e) => setBk((b) => ({ ...b, to: e.target.value }))} placeholder="A (club)" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none" />
            <select data-testid="bk-stage" value={bk.stage} onChange={(e) => setBk((b) => ({ ...b, stage: e.target.value }))} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none">
              <option value="rumor" className="bg-[#141A28]">Rumor</option>
              <option value="trattativa" className="bg-[#141A28]">Trattativa</option>
              <option value="herewego" className="bg-[#141A28]">Here we go</option>
              <option value="ufficiale" className="bg-[#141A28]">Ufficiale</option>
            </select>
            <input value={bk.fee} onChange={(e) => setBk((b) => ({ ...b, fee: e.target.value }))} placeholder="Cifra (es. €25M)" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none" />
          </div>
          <button data-testid="bk-generate" onClick={genBreaking} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2BE07A] py-2.5 font-heading text-sm font-black uppercase tracking-wider text-black active:scale-[0.98]"><Zap size={15} fill="black" /> Genera annuncio</button>
          {bkText && (
            <div className="mt-3">
              <textarea data-testid="bk-output" readOnly value={bkText} className="h-32 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm leading-relaxed text-white/90 focus:outline-none" />
              <div className="mt-2 flex gap-2">
                <button data-testid="bk-copy" onClick={() => copyText(bkText)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white py-2 text-sm font-black text-black active:scale-95"><Copy size={14} /> Copia</button>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(bkText)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-white active:scale-95"><ExternalLink size={14} /> Su X</a>
              </div>
            </div>
          )}
        </div>

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

      </div>{/* end left column */}

      {/* Screening Live — colonna news a destra (stile Memory) */}
      <aside className="space-y-3 lg:col-span-1">
        <div className="glass rounded-2xl p-4">
          <p className="mb-3 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#2BE07A]"><Radio size={13} /> Screening Live</p>
          <div className="max-h-[68vh] space-y-2 overflow-y-auto pr-1">
            {news.length === 0 && <p className="text-xs text-white/30">Caricamento…</p>}
            {news.map((n) => (
              <div key={n.id} data-testid={`jrn-news-${n.id}`} className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-white/70">
                  <span className="truncate">{n.source}</span>{n.verified && <VerifiedTick size={11} />}
                  <span className="ml-auto shrink-0 text-white/35">{timeAgo(n.published)}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-white/85">{n.title}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="rounded px-1.5 py-0.5 text-[9px] font-black uppercase" style={{ color: n.color, background: `${n.color}22` }}>{n.stage}</span>
                  <button data-testid={`jrn-savenews-${n.id}`} onClick={() => saveNews(n)} title="Salva scoop" className="text-white/45 hover:text-[#2BE07A] active:scale-90"><Bookmark size={13} /></button>
                  <a href={n.link} target="_blank" rel="noreferrer" className="ml-auto text-white/40 hover:text-white"><ExternalLink size={12} /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

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
