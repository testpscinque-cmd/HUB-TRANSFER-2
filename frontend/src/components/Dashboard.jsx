import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Search, Zap, X, ExternalLink, Play, Bookmark, RefreshCw, BadgeCheck, Newspaper, Users, TrendingUp, Radio } from "lucide-react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import { TeamBadge, PlayerCutout, StatusBar, VerifiedTick, TierBadge, timeAgo } from "@/components/bits";

const slug = (s = "") => "p-" + s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const STAGE_LABEL = { rumor: "Rumor", trattativa: "Trattativa", ufficiale: "Ufficiale" };

// X-style source avatar (initial monogram, brand-ish color, verified tick)
const SRC_COLOR = {
  "Fabrizio Romano": "#111827", "Sky Sport": "#0A2A66", "Gianluca Di Marzio": "#0F766E",
  "Gazzetta dello Sport": "#BE185D", "Tuttosport": "#B45309", "Nicolò Schira": "#374151",
  "Matteo Moretto": "#4B5563", "Calciomercato.it": "#334155",
};
const srcColor = (s = "") => SRC_COLOR[s] || "#334155";
const SourceAvatar = ({ source, verified, size = 40 }) => (
  <div className="relative shrink-0">
    <div className="flex items-center justify-center rounded-full font-heading font-black text-white"
      style={{ width: size, height: size, background: srcColor(source), fontSize: size * 0.4 }}>
      {(source || "?").slice(0, 1)}
    </div>
    {verified && <span className="absolute -bottom-0.5 -right-0.5"><VerifiedTick size={size * 0.42} /></span>}
  </div>
);

const Portal = ({ children }) => createPortal(children, document.body);

/* ---------------- X-style news card (white, like a real X/Twitter post) ---------------- */
const NewsCard = ({ n, onSave, onSearch }) => (
  <div data-testid={`post-${n.id}`} className="hover-lift fade-up flex flex-col gap-2 rounded-2xl border border-black/5 bg-white p-4 shadow-[0_6px_20px_rgba(0,0,0,0.18)]">
    <div className="flex items-center gap-2.5">
      <SourceAvatar source={n.source} verified={n.verified} size={40} />
      <div className="min-w-0 flex-1 leading-tight">
        <div className="flex items-center gap-1 truncate text-sm font-black text-slate-900">{n.source}</div>
        <div className="truncate text-[12px] text-slate-500">{n.handle ? `@${n.handle}` : "News"}</div>
      </div>
      <span className="rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider"
        style={{ color: n.color, background: `${n.color}22`, border: `1px solid ${n.color}66` }}>{STAGE_LABEL[n.stage]}</span>
      <button data-testid={`save-post-${n.id}`} onClick={() => onSave({ id: `post-${n.id}`, name: n.title, team: n.source, link: n.link })}
        title="Salva scoop" className="text-slate-400 transition-colors hover:text-[#0f9d58] active:scale-90"><Bookmark size={16} /></button>
    </div>
    <p className="text-[15px] font-medium leading-snug text-slate-800">{n.title}</p>
    {n.stage === "ufficiale" && (
      <span className="flex w-fit items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 ring-1 ring-emerald-200">
        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-500" /> Here we go!
      </span>
    )}
    <div className="mt-0.5 flex items-center gap-3 border-t border-slate-100 pt-2.5">
      <span className="text-[12px] font-semibold text-slate-500">{timeAgo(n.published)}</span>
      {n.player && <button onClick={() => onSearch(n.player)} className="flex items-center gap-1 text-[12px] font-bold text-slate-600 hover:text-[#0f9d58]"><Search size={12} /> {n.player}</button>}
      {n.team && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{n.team}</span>}
      <a href={n.link} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1 text-[12px] font-bold text-slate-500 hover:text-slate-900"><ExternalLink size={12} /> Apri</a>
    </div>
  </div>
);

const VideoCard = ({ v, onOpen, onOpenProfile, onSave }) => (
  <div data-testid={`video-${v.id}`} className="glass hover-lift fade-up overflow-hidden rounded-2xl">
    <button onClick={() => onOpen(v)} className="relative flex h-32 w-full items-center justify-center overflow-hidden"
      style={{ background: v.thumb ? `linear-gradient(rgba(10,14,23,0.15), rgba(10,14,23,0.7)), url('${v.thumb}') center/cover` : "linear-gradient(135deg, rgba(36,224,122,0.18), rgba(15,23,42,0.5))" }}>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 backdrop-blur"><Play size={22} className="ml-0.5 text-white" fill="white" /></span>
      <span className="absolute left-3 top-3 rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-black uppercase text-white">▶ Video</span>
      <span className="absolute bottom-2 right-3 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-bold text-white/85">{v.views} views</span>
    </button>
    <div className="flex flex-col gap-2 p-4">
      <p className="text-[14px] font-semibold leading-snug text-white/90">{v.title}</p>
      <div className="flex items-center gap-2">
        <button onClick={() => onOpenProfile(slug(v.player))} className="text-[11px] font-bold text-white/80 hover:underline">{v.player}</button>
        <span className="text-white/25">·</span>
        <span className="flex items-center gap-1 text-[11px] text-white/60">{v.channel} {v.verified && <VerifiedTick size={12} />}</span>
        <button data-testid={`save-video-${v.id}`} onClick={() => onSave({ id: slug(v.player), name: v.player, team: v.team })}
          title="Salva" className="ml-auto text-white/45 hover:text-[#2BE07A] active:scale-90"><Bookmark size={15} /></button>
      </div>
    </div>
  </div>
);

const VideoModal = ({ v, onClose }) => (
  <Portal><div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
    <div className="glass-strong pop-in relative z-10 w-full max-w-md rounded-2xl p-5" data-testid="video-modal">
      <button onClick={onClose} className="absolute right-3 top-3 text-white/50 hover:text-white"><X size={20} /></button>
      <div className="mb-4 flex h-44 items-center justify-center overflow-hidden rounded-xl"
        style={{ background: v.thumb ? `linear-gradient(rgba(10,14,23,0.2), rgba(10,14,23,0.65)), url('${v.thumb}') center/cover` : "linear-gradient(135deg, rgba(36,224,122,0.22), rgba(15,23,42,0.6))" }}>
        <Play size={42} className="text-white/85" fill="white" />
      </div>
      <p className="text-lg font-bold text-white">{v.title}</p>
      <p className="mt-1 flex items-center gap-1 text-sm text-white/60">{v.channel} {v.verified && <VerifiedTick size={13} />}</p>
      <a href={v.link} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 font-heading text-sm font-black uppercase text-white">
        <ExternalLink size={15} /> Guarda su YouTube
      </a>
    </div>
  </div></Portal>
);

const MatchModal = ({ res, onClose, onOpenProfile, onSearch }) => (
  <Portal><div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
    <div className="glass-strong pop-in relative z-10 w-full max-w-sm rounded-3xl p-6 text-center" data-testid="match-modal">
      <button onClick={onClose} className="absolute right-4 top-4 text-white/50 hover:text-white"><X size={20} /></button>
      {!res.found ? (
        <p className="py-6 text-white/80">{res.message}</p>
      ) : (
        <>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Indice di Fattibilità</p>
          <div className="my-4 font-heading text-5xl font-black uppercase" style={{ color: res.color, textShadow: `0 0 24px ${res.color}66` }}>{res.feasibility}</div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => onOpenProfile(res.player.id)} className="flex items-center gap-2 rounded-xl glass px-3 py-2">
              <PlayerCutout name={res.player.name} size={34} />
              <span className="text-sm font-bold text-white">{res.player.name}</span>
            </button>
            <span className="text-white/40">→</span>
            <div className="flex items-center gap-2 rounded-xl glass px-3 py-2">
              <TeamBadge team={res.team} size={30} />
              <span className="text-sm font-bold text-white">{res.team.name}</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px]">
            <TierBadge tier={res.player.value_tier} /> <TierBadge tier={res.team.wealth_tier} />
          </div>
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80" data-testid="match-db-status">{res.db_status}</div>
          {res.news_count > 0 && (
            <button data-testid="match-news-link" onClick={() => onSearch(res.player.name)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2BE07A] py-2.5 font-heading text-sm font-black uppercase tracking-wider text-black active:scale-[0.98]">
              <Search size={15} /> Vedi notizie collegate
            </button>
          )}
        </>
      )}
    </div>
  </div></Portal>
);

const Stat = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2" data-testid={`stat-${label}`}>
    <Icon size={16} style={{ color }} />
    <div className="leading-none">
      <div className="font-heading text-base font-black text-white">{value ?? "—"}</div>
      <div className="text-[9px] uppercase tracking-widest text-white/40">{label}</div>
    </div>
  </div>
);

export const Dashboard = ({ onOpenProfile, saveWatch }) => {
  const [pName, setPName] = useState("");
  const [pTeam, setPTeam] = useState("");
  const saveScoop = (item) => { saveWatch("Scoop", item); toast.success("Salvato in Watchlist (Scoop)"); };
  const [names, setNames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [playerCount, setPlayerCount] = useState(0);
  const [matching, setMatching] = useState(false);
  const [match, setMatch] = useState(null);

  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("Serie A");
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [official, setOfficial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState(null);
  const [pending, setPending] = useState(null);

  useEffect(() => {
    api.getPlayers().then((p) => { setNames(p.map((x) => x.name)); setPlayerCount(p.length); }).catch(() => {});
    api.getTeams().then(setTeams).catch(() => {});
    api.getOfficialNews().then(setOfficial).catch(() => {});
  }, []);

  const loadFeed = (queryTerm) => {
    setLoading(true);
    Promise.all([api.getLiveNews(queryTerm, 30), api.getVideos()])
      .then(([n, v]) => { setNews(n); setVideos(v); })
      .catch(() => toast.error("Errore nel caricamento notizie"))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    const pre = typeof window !== 'undefined' ? window.localStorage.getItem('prefill_query') : null;
    if (pre) {
      window.localStorage.removeItem('prefill_query');
      doSearch(pre);
    } else {
      loadFeed("Serie A");
    }
  }, []);

  useEffect(() => {
    const iv = setInterval(async () => {
      try {
        const fresh = await api.getLiveNews(query, 30);
        const ids = new Set(news.map((n) => n.id));
        const freshNew = fresh.filter((n) => !ids.has(n.id));
        if (freshNew.length) setPending({ news: fresh, count: freshNew.length });
      } catch { /* silent */ }
    }, 60000);
    return () => clearInterval(iv);
  }, [query, news]);

  const applyPending = () => { setNews(pending.news); setPending(null); toast.success(`${pending.count} nuove notizie`); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const runMatch = async () => {
    if (!pName || !pTeam) { toast.error("Compila giocatore e squadra"); return; }
    setMatching(true);
    await new Promise((r) => setTimeout(r, 500));
    try { setMatch(await api.matchmaker(pName, pTeam)); }
    catch { toast.error("Errore matchmaker"); }
    finally { setMatching(false); }
  };

  const doSearch = (term) => { const t = term || "Serie A"; setQ(term && term !== "Serie A" ? term : ""); setQuery(t); setFilter("all"); loadFeed(t); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const runSearch = () => doSearch(q);
  const searchFromMatch = (name) => { setMatch(null); doSearch(name); };

  const feed = useMemo(() => {
    let list = filter === "all" ? [...news, ...videos] : filter === "posts" ? news : videos;
    return [...list].sort((a, b) => new Date(b.published) - new Date(a.published));
  }, [filter, news, videos]);

  const stats = useMemo(() => ({
    trattative: news.filter((n) => n.stage === "trattativa").length,
    ufficiali: news.filter((n) => n.stage === "ufficiale").length,
    fonti: new Set(news.map((n) => n.source)).size,
  }), [news]);

  return (
    <div className="fade-up">
      {/* Hero — compact, contemporary, showcase-ready */}
      <div className="hero-shine relative mb-5 overflow-hidden rounded-3xl border border-white/10" data-testid="dash-hero"
        style={{
          background:
            "radial-gradient(120% 140% at 100% 0%, rgba(43,224,122,0.35) 0%, rgba(43,224,122,0) 55%), radial-gradient(90% 120% at 0% 100%, rgba(46,125,246,0.28) 0%, rgba(46,125,246,0) 55%), linear-gradient(120deg, rgba(6,10,18,0.92) 0%, rgba(9,15,26,0.85) 60%, rgba(9,15,26,0.72) 100%), url('https://images.unsplash.com/photo-1502481686408-d428268c24ff?crop=entropy&cs=srgb&fm=jpg&q=75&w=1400') center/cover"
        }}>
        {/* fine grid + orbs (decor) */}
        <div className="hero-grid-fine absolute inset-0 opacity-70" />
        <div className="hero-orb pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(43,224,122,0.55), transparent 70%)" }} />
        <div className="hero-orb pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full" style={{ background: "radial-gradient(circle, rgba(46,125,246,0.35), transparent 70%)", animationDelay: "1.2s" }} />

        <div className="relative px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          {/* top badges row */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-white/90 backdrop-blur">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-red-500" /> LIVE
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-white/85 backdrop-blur">
              <Zap size={11} className="text-[#2BE07A]" fill="#2BE07A" /> HUB TRANSFER
            </span>
            <span className="ml-auto hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/70 backdrop-blur md:inline-flex">
              Season 25/26 · Serie A
            </span>
          </div>

          {/* headline */}
          <h1 className="font-heading font-black uppercase leading-[0.92] tracking-[-0.02em] text-white text-[clamp(2rem,6.2vw,4.5rem)]">
            <span className="block">Tutto il calciomercato</span>
            <span className="block">
              in un{" "}
              <span className="hero-gradient-text relative inline-block">
                hub
                <span className="absolute -bottom-1 left-0 h-[6px] w-full rounded-full opacity-80"
                  style={{ background: "linear-gradient(90deg, #2BE07A, #C6F94F)" }} />
              </span>
              .
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-white/70 sm:text-sm lg:text-base">
            Rumor in tempo reale, trattative tracciate, workspace da professionista.
            <span className="text-white/90"> Un unico command center per il mercato.</span>
          </p>

          {/* inline stat chips (compact) */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { icon: Users, label: "Giocatori", value: playerCount, color: "#7DD3FC" },
              { icon: TrendingUp, label: "Trattative", value: stats.trattative, color: "#F5C518" },
              { icon: BadgeCheck, label: "Ufficiali", value: official.length, color: "#2BE07A" },
              { icon: Radio, label: "Fonti", value: stats.fonti, color: "#E9EEF7" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} data-testid={`stat-${label}`}
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 backdrop-blur transition-colors hover:border-white/20 hover:bg-white/10">
                <Icon size={13} style={{ color }} />
                <span className="font-heading text-[13px] font-black text-white leading-none">{value ?? "—"}</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/50 leading-none">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ufficialità strip */}
      {official.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#2BE07A]"><BadgeCheck size={13} /> Ufficialità</p>
          <div className="flex gap-2.5 overflow-x-auto pb-1" data-testid="official-strip">
            {official.map((o) => (
              <button key={o.id} onClick={() => o.player && doSearch(o.player)}
                className="glass hover-lift flex w-64 shrink-0 flex-col gap-1.5 rounded-2xl p-3 text-left"
                style={{ borderLeft: "3px solid #2BE07A" }}>
                <div className="flex items-center gap-1.5 text-[11px] font-black text-[#2BE07A]"><span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#2BE07A]" /> HERE WE GO</div>
                <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-white/90">{o.title}</p>
                <span className="flex items-center gap-1 text-[10px] text-white/50">{o.source} <VerifiedTick size={11} /></span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="glass mb-4 rounded-2xl p-3">
        <div className="grid grid-cols-2 gap-2">
          <input list="player-list" data-testid="mm-player" value={pName} onChange={(e) => setPName(e.target.value)} placeholder="Giocatore / Allenatore"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[#2BE07A]/50 focus:outline-none" />
          <input list="team-list" data-testid="mm-team" value={pTeam} onChange={(e) => setPTeam(e.target.value)} placeholder="Squadra target"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[#2BE07A]/50 focus:outline-none" />
        </div>
        <datalist id="player-list">{names.map((n) => <option key={n} value={n} />)}</datalist>
        <datalist id="team-list">{teams.map((t) => <option key={t.id} value={t.name} />)}</datalist>
        <button data-testid="match-scoop-btn" onClick={runMatch} disabled={matching}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 font-heading text-sm font-black uppercase tracking-wider text-[#0A0E17] active:scale-[0.98] disabled:opacity-60">
          {matching ? <span className="h-4 w-4 rounded-full border-2 border-black/20 border-t-black spin" /> : <Zap size={16} fill="black" className="text-black" />}
          {matching ? "Analisi dati..." : "Match Scoop"}
        </button>
      </div>

      {/* Search + pills */}
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
          <input data-testid="news-search-input" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder="Cerca giocatore, squadra, fonte..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-[#2BE07A]/50 focus:outline-none" />
        </div>
        <button data-testid="news-search-btn" onClick={runSearch} className="rounded-xl bg-white/10 px-3 py-2.5 text-sm font-bold text-white active:scale-95">Cerca</button>
      </div>
      <div className="mb-4 flex items-center gap-2">
        {[["all", "Tutto"], ["posts", "Post"], ["videos", "Video"]].map(([k, l]) => (
          <button key={k} data-testid={`filter-${k}`} onClick={() => setFilter(k)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${filter === k ? "bg-[#2BE07A] text-black" : "glass text-white/60"}`}>{l}</button>
        ))}
        <span className="ml-auto self-center text-[11px] text-white/40">“{query}”</span>
      </div>

      {pending && (
        <button data-testid="new-news-badge" onClick={applyPending}
          className="pending-shine slide-down relative mb-3 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#2BE07A]/40 bg-[#2BE07A]/10 py-2.5 font-heading text-xs font-black uppercase tracking-wider text-[#2BE07A] active:scale-[0.98]">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#2BE07A]" />
          <RefreshCw size={14} className="animate-[spin_2.4s_linear_infinite]" /> {pending.count} nuove notizie · aggiorna
        </button>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><span className="h-8 w-8 rounded-full border-2 border-white/20 border-t-white spin" /></div>
      ) : (
        <div className="columns-1 gap-3 sm:columns-2 [&>*]:mb-3 [&>*]:break-inside-avoid">
          {feed.length === 0 && <p className="py-12 text-center text-sm text-white/40">Nessuna notizia trovata.</p>}
          {feed.map((item) => item.type === "video"
            ? <VideoCard key={item.id} v={item} onOpen={setVideo} onOpenProfile={onOpenProfile} onSave={saveScoop} />
            : <NewsCard key={item.id} n={item} onSave={saveScoop} onSearch={doSearch} />)}
        </div>
      )}

      {match && <MatchModal res={match} onClose={() => setMatch(null)} onOpenProfile={(id) => { setMatch(null); onOpenProfile(id); }} onSearch={searchFromMatch} />}
      {video && <VideoModal v={video} onClose={() => setVideo(null)} />}
    </div>
  );
};
