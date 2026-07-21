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
export const matchmaker = (player_query, team_query) => post("/matchmaker", { player_query, team_query });
export const getLiveNews = (q = "Serie A", limit = 30) => get(`/news/live?q=${encodeURIComponent(q)}&limit=${limit}`);
export const getVideos = (q = "") => get(`/news/videos${q ? `?q=${encodeURIComponent(q)}` : ""}`);
