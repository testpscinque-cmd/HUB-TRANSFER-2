// Shared visual bits for TransferHub (dark/glass).

const PALETTE = ["#2E7DF6", "#3B82F6", "#A855F7", "#F5C518", "#FF7A00", "#06B6D4", "#EC4899", "#64748B"];
function hash(s = "") { let h = 0; for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h); return Math.abs(h); }
function initials(name = "") {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (!p.length) return "?";
  return (p.length === 1 ? p[0].slice(0, 2) : p[0][0] + p[p.length - 1][0]).toUpperCase();
}

export const TEAM_COLORS = {
  Atalanta: "#1C61B6", Bologna: "#A21C28", Cagliari: "#B01F30", Como: "#0B3D91",
  Cremonese: "#9B1C2E", Fiorentina: "#5E2E8E", Genoa: "#C8102E", Inter: "#0A1A8C",
  Juventus: "#111111", Lazio: "#5CB8E6", Lecce: "#E30613", Milan: "#C8102E",
  Napoli: "#12A0D7", Parma: "#F5C518", Pisa: "#0A2A66", Roma: "#8E1F2F",
  Sassuolo: "#0B7A3B", Torino: "#7A0E14", Udinese: "#1F2937", Verona: "#F4C300",
};
export const teamColor = (team) => {
  if (!team) return null;
  const name = typeof team === "string" ? team : team.name;
  return (typeof team === "object" && team.color) || TEAM_COLORS[name] || null;
};

// FIFA-style "serious" cutout — grey silhouette on a card gradient (team-color tint).
export const PlayerCutout = ({ name, size = 64, color, team, className = "" }) => {
  const tint = color || teamColor(team) || "#4B5563";
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      title={name}
      style={{
        width: size, height: size, borderRadius: Math.round(size * 0.26),
        background: `linear-gradient(160deg, ${tint}, #1b2431 78%)`,
        border: `1px solid rgba(255,255,255,0.12)`,
        boxShadow: `inset 0 -${Math.round(size * 0.16)}px ${Math.round(size * 0.3)}px rgba(0,0,0,0.4)`,
      }}
    >
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)" style={{ marginBottom: -size * 0.06 }}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7v1H4v-1z" />
      </svg>
    </div>
  );
};

// Negotiation thermometer: rumor -> trattativa -> ufficiale
const TEMP = { rumor: { pct: 28, c: "#94A3B8", l: "Rumor" }, trattativa: { pct: 64, c: "#EAB308", l: "Trattativa" }, ufficiale: { pct: 100, c: "#22C55E", l: "Ufficiale" } };
export const Thermometer = ({ stage = "rumor" }) => {
  const t = TEMP[stage] || TEMP.rumor;
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
        <span className="text-white/40">Temperatura trattativa</span>
        <span style={{ color: t.c }}>{t.l}</span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full transition-all" style={{ width: `${t.pct}%`, background: `linear-gradient(90deg, #94A3B8, #EAB308, ${t.c})`, boxShadow: `0 0 12px ${t.c}` }} />
      </div>
    </div>
  );
};

export const TeamBadge = ({ team, size = 30 }) => {
  if (!team) return null;
  const t = typeof team === "object" ? team : { abbr: (team || "").slice(0, 3).toUpperCase(), color: "#334155", text_color: "#fff", name: team };
  return (
    <div
      title={t.name}
      className="flex shrink-0 items-center justify-center rounded-lg font-heading font-black ring-1 ring-white/10"
      style={{ width: size, height: size, background: t.color, color: t.text_color || "#fff", fontSize: Math.round(size * 0.32) }}
    >
      {t.abbr}
    </div>
  );
};

// Non-numeric status bar (grey / yellow / green / red)
export const StatusBar = ({ color = "#8B93A7", label }) => (
  <div className="flex items-center gap-2">
    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
      <div className="h-full rounded-full" style={{ width: "100%", background: color, boxShadow: `0 0 8px ${color}` }} />
    </div>
    {label && <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>{label}</span>}
  </div>
);

const TIER_STYLE = {
  Top: { c: "#E9EEF7" }, Media: { c: "#F5C518" }, Accessibile: { c: "#8B93A7" },
  "Budget Alto": { c: "#E9EEF7" }, Bilanciato: { c: "#F5C518" }, Autofinanziamento: { c: "#8B93A7" },
  Alta: { c: "#22C55E" }, Bassa: { c: "#FF4D4D" },
};
export const TierBadge = ({ tier }) => {
  const s = TIER_STYLE[tier] || { c: "#8B93A7" };
  return (
    <span className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
      style={{ color: s.c, background: `${s.c}18`, border: `1px solid ${s.c}44` }}>
      {tier}
    </span>
  );
};

export const VerifiedTick = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" title="Fonte verificata">
    <circle cx="12" cy="12" r="11" fill="#2E7DF6" />
    <path d="M7 12.5l3 3 7-7" stroke="#07070B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function timeAgo(iso) {
  if (!iso) return "";
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "ora";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24); if (d < 30) return `${d}g`;
  return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short" });
}
export function dateFull(iso) {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return ""; }
}
