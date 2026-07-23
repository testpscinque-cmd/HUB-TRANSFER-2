import { useEffect, useState } from "react";
import { Bookmark, Check } from "lucide-react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import { dateFull } from "@/components/bits";
import { ArticleDraftDialog } from "@/components/ArticleDraftDialog";
import { TransferCardDialog } from "@/components/TransferCardDialog";

const STAGE_LABELS = {
  rumor: { label: "INTERESSE INIZIALE", badge: "bg-sky-500/10 text-sky-300 border border-sky-500/20" },
  trattativa: { label: "OFFERTA", badge: "bg-amber-500/10 text-amber-300 border border-amber-500/20" },
  ufficiale: { label: "FIRMA", badge: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20" },
};
const V = (x) => (x === undefined || x === null || x === "" ? "---" : x);
const initials = (name) => (name || "").split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export const ProfileScreen = ({ id, onBack, saveWatch, go }) => {
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [articleOpen, setArticleOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [tab, setTab] = useState("cronologia");

  useEffect(() => {
    setLoading(true);
    api.getProfile(id).then(setP).catch(() => toast.error("Profilo non trovato")).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><span className="h-8 w-8 rounded-full border-2 border-white/20 border-t-[#E9EEF7] spin" /></div>;
  if (!p) return null;

  const roleLabel = p.position || p.role || "Giocatore";
  const club = p.current_club || p.team || "---";
  const nationality = p.nationality || "---";
  const contractExpiry = p.contract_expiry || "---";
  const salary = p.salary || "---";
  const marketValue = p.market_value || "---";
  const agent = p.agent || p.agent_name || "N/D";
  const timeline = p.timeline || [];
  const source = timeline[0];
  const sourceName = source?.source || source?.source_name || "Fonte sconosciuta";
  const sourceDate = source ? dateFull(source.date || source.logged_at || source.logged_at || source.date) : "Data non disponibile";
  const avatarGradient = `linear-gradient(135deg, ${p.team_info?.color || "#7c3aed"} 0%, rgba(15,23,42,0.92) 100%)`;

  const bookmark = () => {
    saveWatch("Radar", { id: p.id, name: p.name, team: p.team, position: p.position || p.role });
    localStorage.setItem("th_role", "journalist");
    toast.success("Salvato in Watchlist — apro il Giornalista");
    go && go("workspace");
  };

  const openArticle = () => setArticleOpen(true);
  const openTransfer = () => setTransferOpen(true);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl text-3xl font-black text-white shadow-lg" style={{ backgroundColor: p.team_info?.color || "#7c3aed" }}>
              {initials(p.name)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-emerald-600">GIOCATORE</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">{roleLabel} · Serie A</span>
              </div>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">{p.name}</h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                <span>{club}</span>
                <span>{nationality}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={openTransfer} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-600 bg-emerald-50 px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-emerald-700 transition hover:bg-emerald-100">
              TRANSFER CARD
            </button>
            <button onClick={openArticle} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-slate-200">
              ESPORTA BOZZA
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 pt-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-emerald-200/80 bg-emerald-50 p-5">
            <div className="flex items-center gap-3 rounded-3xl border border-emerald-200 bg-white/80 p-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-700"><Check size={18} /></span>
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Garanzia Fonte</div>
                <p className="mt-2 text-sm leading-6 text-slate-700">Rivelata per prima da <span className="font-semibold text-slate-900">{sourceName}</span> il <span className="font-semibold text-slate-900">{sourceDate}</span></p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <button onClick={() => setTab("cronologia")} className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition ${tab === "cronologia" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"}`}>
                Cronologia
              </button>
              <button onClick={() => setTab("carriera")} className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition ${tab === "carriera" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"}`}>
                Carriera
              </button>
            </div>

            {tab === "cronologia" ? (
              <div className="mt-5 space-y-5">
                {timeline.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500">Nessun aggiornamento tracciato per questo profilo.</div>
                ) : (
                  timeline.map((item, idx) => {
                    const stage = item.stage || "rumor";
                    const stageConfig = STAGE_LABELS[stage] || STAGE_LABELS.rumor;
                    return (
                      <div key={idx} className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] ${stageConfig.badge}`}>{stageConfig.label}</span>
                          {item.verified && <span className="rounded-full bg-emerald-600/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-700">SCOOP</span>}
                          <span className="ml-auto text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{dateFull(item.date || item.logged_at || item.logged_at || item.date)}</span>
                        </div>
                        <p className="text-sm leading-7 text-slate-700">{item.evolution_description || item.text || item.title || "Aggiornamento non disponibile."}</p>
                        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500">
                          <span>{item.source || item.source_name || "Sorgente sconosciuta"}</span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">Definitive</span>
                          {(item.external_link_url || item.link) && (
                            <a href={item.external_link_url || item.link} target="_blank" rel="noreferrer" className="font-mono text-xs font-semibold text-emerald-600 hover:text-emerald-500">{item.external_link_url || item.link}</a>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-500">Contenuto carriera e progressione disponibile qui.</div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Dati Contratto</p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-600">{p.current_club || p.team}</div>
            </div>
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex justify-between gap-3"><span className="font-semibold text-slate-900">Club</span><span>{club}</span></div>
              <div className="flex justify-between gap-3"><span className="font-semibold text-slate-900">Contratto</span><span className="text-emerald-700">{contractExpiry}</span></div>
              <div className="flex justify-between gap-3"><span className="font-semibold text-slate-900">Ingaggio</span><span>{salary}</span></div>
              <div className="flex justify-between gap-3"><span className="font-semibold text-slate-900">Valore</span><span>{marketValue}</span></div>
              <div className="flex justify-between gap-3"><span className="font-semibold text-slate-900">Agente</span><span>{agent}</span></div>
              <div className="flex justify-between gap-3"><span className="font-semibold text-slate-900">Nazione</span><span>{nationality}</span></div>
            </div>
            <div className="mt-6 rounded-3xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-500">
              <div className="font-semibold uppercase tracking-[0.2em] text-slate-600">Note Interne</div>
              <p className="mt-2">Riservato: focus sulle indiscrezioni club, status contrattuale e scenari di mercato.</p>
            </div>
          </div>
        </aside>
      </div>

      <ArticleDraftDialog open={articleOpen} onClose={() => setArticleOpen(false)} profile={p} />
      <TransferCardDialog open={transferOpen} onClose={() => setTransferOpen(false)} profile={p} rumors={p.timeline || []} />
    </div>
  );
};
