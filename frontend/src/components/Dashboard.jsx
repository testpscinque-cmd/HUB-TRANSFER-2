import { useEffect, useState, useMemo } from "react";
import { Search, Zap, X, ExternalLink, Play, Newspaper, Bookmark } from "lucide-react";
import { toast } from "sonner";
import * as api from "@/lib/api";
import { TeamBadge, PlayerCutout, StatusBar, VerifiedTick, TierBadge, timeAgo } from "@/components/bits";

const slug = (s = "") => "p-" + s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const STAGE_LABEL = { rumor: "Rumor", trattativa: "Trattativa", ufficiale: "Ufficiale" };

const NewsCard = ({ n, onSave }) => (
  <div data-testid={`post-${n.id}`} className="glass fade-up flex flex-col gap-2 rounded-2xl p-4">
    <div className="flex items-center gap-2">
      <Newspaper size={14} className="text-white/40" />
      <span className="flex items-center gap-1 text-xs font-bold text-white/80">
        {n.source} {n.verified && <VerifiedTick size={13} />}
      </span>
      <span className="ml-auto text-[11px] text-white/40">{timeAgo(n.published)}</span>
      <button data-testid={`save-post-${n.id}`} onClick={() => onSave({ id: `post-${n.id}`, name: n.title, team: n.source, link: n.link })}
        title="Salva scoop" className="text-white/50 transition-colors hover:text-green active:scale-90"><Bookmark size={15} /></button>
    </div>
    <p className="font-heading text-[15px] font-bold leading-snug text-white">{n.title}</p>
    <div className="flex items-center justify-between">
      <StatusBar color={n.color} label={STAGE_LABEL[n.stage]} />
      <a href={n.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] font-bold text-green active:scale-95"><ExternalLink size={12} /> Vai a</a>
    </div>
  </div>
);

const VideoCard = ({ v, onOpen, onOpenProfile, onSave }) => (
  <div data-testid={`video-${v.id}`} className="glass fade-up overflow-hidden rounded-2xl">
    <button onClick={() => onOpen(v)} className="relative flex h-28 w-full items-center justify-center"
      style={{ background: "linear-gradient(135deg, rgba(36,224,122,0.16), rgba(59,130,246,0.14))" }}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur"><Play size={20} className="ml-0.5 text-white" fill="white" /></span>
      <span className="absolute left-3 top-3 rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-black uppercase text-white">Video</span>
      <span className="absolute bottom-2 right-3 text-[10px] font-bold text-white/70">{v.views} views</span>
    </button>
    <div className="flex flex-col gap-2 p-4">
      <p className="font-heading text-[14px] font-bold leading-snug text-white">{v.title}</p>
      <div className="flex items-center gap-2">
        <button onClick={() => onOpenProfile(slug(v.player))} className="text-[11px] font-bold text-white/90 hover:underline">{v.player}</button>
        <span className="text-white/30">·</span>
        <span className="flex items-center gap-1 text-[11px] text-white/70">{v.channel} {v.verified && <VerifiedTick size={12} />}</span>
        <button data-testid={`save-video-${v.id}`} onClick={() => onSave({ id: slug(v.player), name: v.player, team: v.team })}
          title="Salva" className="ml-auto text-white/50 hover:text-green active:scale-90"><Bookmark size={15} /></button>
      </div>
    </div>
  </div>
);

const VideoModal = ({ v, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
    <div className="glass-strong pop-in relative z-10 w-full max-w-md rounded-2xl p-5" data-testid="video-modal">
      <button onClick={onClose} className="absolute right-3 top-3 text-white/50 hover:text-white"><X size={20} /></button>
      <div className="mb-4 flex h-40 items-center justify-center rounded-xl" style={{ background: "linear-gradient(135deg, rgba(36,224,122,0.2), rgba(59,130,246,0.18))" }}>
        <Play size={40} className="text-white/80" fill="white" />
      </div>
      <p className="font-heading text-lg font-bold text-white">{v.title}</p>
      <p className="mt-1 flex items-center gap-1 text-sm text-white/60">{v.channel} {v.verified && <VerifiedTick size={13} />}</p>
      <a href={v.link} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 font-heading text-sm font-black uppercase text-white">
        <ExternalLink size={15} /> Guarda su YouTube
      </a>
    </div>
  </div>
);

const MatchModal = ({ res, onClose, onOpenProfile }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
    <div className="glass-strong pop-in relative z-10 w-full max-w-sm rounded-3xl p-6 text-center" data-testid="match-modal">
      <button onClick={onClose} className="absolute right-4 top-4 text-white/50 hover:text-white"><X size={20} /></button>
      {!res.found ? (
        <p className="py-6 text-white/80">{res.message}</p>
      ) : (
        <>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Indice di Fattibilità</p>
          <div className="my-4 font-heading text-5xl font-black uppercase" style={{ color: res.color, textShadow: `0 0 24px ${res.color}66` }}>
            {res.feasibility}
          </div>
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
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80" data-testid="match-db-status">
            {res.db_status}
          </div>
        </>
      )}
    </div>
  </div>
);

export const Dashboard = ({ onOpenProfile, saveWatch }) => {
  const [pName, setPName] = useState("");
  const [pTeam, setPTeam] = useState("");
  const saveScoop = (item) => { saveWatch("Scoop", item); toast.success("Salvato in Watchlist (Scoop)"); };
  const [names, setNames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matching, setMatching] = useState(false);
  const [match, setMatch] = useState(null);

  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("Serie A");
  const [news, setNews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    api.getPlayers().then((p) => setNames(p.map((x) => x.name))).catch(() => {});
    api.getTeams().then((t) => setTeams(t)).catch(() => {});
  }, []);

  const loadFeed = (queryTerm) => {
    setLoading(true);
    Promise.all([api.getLiveNews(queryTerm, 30), api.getVideos()])
      .then(([n, v]) => { setNews(n); setVideos(v); })
      .catch(() => toast.error("Errore nel caricamento notizie"))
      .finally(() => setLoading(false));
  };
  useEffect(() => { loadFeed("Serie A"); }, []);

  const runMatch = async () => {
    if (!pName || !pTeam) { toast.error("Compila giocatore e squadra"); return; }
    setMatching(true);
    await new Promise((r) => setTimeout(r, 550));
    try { setMatch(await api.matchmaker(pName, pTeam)); }
    catch { toast.error("Errore matchmaker"); }
    finally { setMatching(false); }
  };

  const runSearch = () => { setQuery(q || "Serie A"); loadFeed(q || "Serie A"); };

  const feed = useMemo(() => {
    let list = [];
    if (filter === "all") list = [...news, ...videos];
    else if (filter === "posts") list = news;
    else list = videos;
    return list.sort((a, b) => new Date(b.published) - new Date(a.published));
  }, [filter, news, videos]);

  return (
    <div className="fade-up">
      {/* Header (non fisso) */}
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2E7DF6]"><Zap size={19} className="text-white" fill="white" /></span>
        <h1 className="font-heading text-2xl font-black uppercase tracking-tight text-white">Transfer<span style={{ color: "#2BE07A" }}>Hub</span></h1>
        <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white/60">Serie A</span>
      </div>

      {/* Matchmaker */}
      <div className="mb-5">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Matchmaker · Fattibilità Scoop</p>
        <div className="glass rounded-2xl p-3">
          <div className="grid grid-cols-2 gap-2">
            <input list="player-list" data-testid="mm-player" value={pName} onChange={(e) => setPName(e.target.value)} placeholder="Giocatore / Allenatore"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[#2E7DF6] focus:outline-none" />
            <input list="team-list" data-testid="mm-team" value={pTeam} onChange={(e) => setPTeam(e.target.value)} placeholder="Squadra target"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[#2E7DF6] focus:outline-none" />
          </div>
          <datalist id="player-list">{names.map((n) => <option key={n} value={n} />)}</datalist>
          <datalist id="team-list">{teams.map((t) => <option key={t.id} value={t.name} />)}</datalist>
          <button data-testid="match-scoop-btn" onClick={runMatch} disabled={matching}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2E7DF6] py-2.5 font-heading text-sm font-black uppercase tracking-wider text-white transition-all active:scale-[0.98] disabled:opacity-60">
            {matching ? <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white spin" /> : <Zap size={16} fill="white" />}
            {matching ? "Analisi dati..." : "Match Scoop"}
          </button>
        </div>
      </div>

      {/* Feed search + pills */}
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
          <input data-testid="news-search-input" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runSearch()}
            placeholder="Cerca notizie, fonti, parole chiave..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/35 focus:border-[#2E7DF6] focus:outline-none" />
        </div>
        <button data-testid="news-search-btn" onClick={runSearch} className="rounded-xl bg-white/10 px-3 py-2.5 text-sm font-bold text-white active:scale-95">Cerca</button>
      </div>
      <div className="mb-4 flex gap-2">
        {[["all", "Tutto"], ["posts", "Post"], ["videos", "Video"]].map(([k, l]) => (
          <button key={k} data-testid={`filter-${k}`} onClick={() => setFilter(k)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${filter === k ? "bg-[#2E7DF6] text-black" : "glass text-white/60"}`}>
            {l}
          </button>
        ))}
        <span className="ml-auto self-center text-[11px] text-white/40">“{query}”</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><span className="h-8 w-8 rounded-full border-2 border-white/20 border-t-[#2E7DF6] spin" /></div>
      ) : (
        <div className="space-y-3">
          {feed.length === 0 && <p className="py-12 text-center text-sm text-white/40">Nessuna notizia trovata.</p>}
          {feed.map((item) => item.type === "video"
            ? <VideoCard key={item.id} v={item} onOpen={setVideo} onOpenProfile={onOpenProfile} onSave={saveScoop} />
            : <NewsCard key={item.id} n={item} onSave={saveScoop} />)}
        </div>
      )}

      {match && <MatchModal res={match} onClose={() => setMatch(null)} onOpenProfile={(id) => { setMatch(null); onOpenProfile(id); }} />}
      {video && <VideoModal v={video} onClose={() => setVideo(null)} />}
    </div>
  );
};
