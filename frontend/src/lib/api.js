const BASE = process.env.REACT_APP_BACKEND_URL;
const API = `${BASE}/api`;

async function get(path) {
  const r = await fetch(`${API}${path}`);
  if (!r.ok) throw new Error(`GET ${path} ${r.status}`);
  return r.json();
}
async function post(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`POST ${path} ${r.status}`);
  return r.json();
}

export const getTeams = () => get("/teams");
export const getPlayers = (params = {}) => {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
  return get(`/players${qs ? `?${qs}` : ""}`);
};
export const getCoaches = () => get("/coaches");
export const getProfile = (id) => get(`/profile/${id}`);
export const generateArticle = async (profileId, lang = "it") => {
  const profile = await getProfile(profileId);
  const timeline = profile.timeline || [];
  const hasUpdates = timeline.length > 0;
  const title = profile.kind === "coach"
    ? `Executive Brief — ${profile.name}`
    : `Executive Brief — ${profile.name}`;

  const details = {
    role: profile.position || profile.role || "—",
    club: profile.current_club || profile.team || "—",
    nationality: profile.nationality || "—",
    age: profile.age || "—",
    expiry: profile.contract_expiry || "—",
  };

  const bodyLines = [
    `Profilo: ${profile.name}`,
    `Club: ${details.club}`,
    `Ruolo: ${details.role}`,
    `Nazione: ${details.nationality}`,
    `Età: ${details.age}`,
    `Scadenza: ${details.expiry}`,
    "",
    hasUpdates ? "Ultimi sviluppi:" : "🔴 STATUS: STANDBY - Nessun movimento rilevato",
  ];

  if (hasUpdates) {
    timeline.slice(-5).forEach((item) => {
      bodyLines.push(`- ${item.date || item.logged_at || "Data sconosciuta"}: ${item.evolution_description || item.text || item.title || "Aggiornamento"}`);
    });
  }

  bodyLines.push("", "Questo briefing è pensato per uso executive e pubblicazione rapida.");

  return {
    title,
    details,
    status: hasUpdates ? "ACTIVE" : "STANDBY",
    body: bodyLines.join("\n"),
    timeline: timeline.slice(-5),
  };
};
export const matchmaker = (player_query, team_query) => post("/matchmaker", { player_query, team_query });
export const getLiveNews = (q = "Serie A", limit = 30) => get(`/news/live?q=${encodeURIComponent(q)}&limit=${limit}`);
export const getOfficialNews = () => get(`/news/official`);
export const getVideos = (q = "") => get(`/news/videos${q ? `?q=${encodeURIComponent(q)}` : ""}`);
