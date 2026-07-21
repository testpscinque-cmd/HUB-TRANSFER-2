// Shared visual bits for TransferHub (dark/glass).

const PALETTE = ["#2E7DF6", "#3B82F6", "#A855F7", "#F5C518", "#FF7A00", "#06B6D4", "#EC4899", "#64748B"];
function hash(s = "") { let h = 0; for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h); return Math.abs(h); }
function initials(name = "") {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (!p.length) return "?";
  return (p.length === 1 ? p[0].slice(0, 2) : p[0][0] + p[p.length - 1][0]).toUpperCase();
}

// Stylized "cutout" avatar — glowing jersey-style badge that pops out of the card.
export const PlayerCutout = ({ name, size = 64, color, className = "" }) => {
  const c = color || PALETTE[hash(name) % PALETTE.length];
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-2xl font-heading font-black ${className}`}
      style={{
        width: size, height: size, fontSize: Math.round(size * 0.36),
        background: `radial-gradient(circle at 30% 20%, ${c}, ${c}22 70%, transparent)`,
        border: `1px solid ${c}55`,
        color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.4)",
        boxShadow: `inset 0 0 24px ${c}33, 0 8px 22px ${c}22`,
      }}
    >
      {initials(name)}
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
  Top: { c: "#2E7DF6" }, Media: { c: "#F5C518" }, Accessibile: { c: "#8B93A7" },
  "Budget Alto": { c: "#2E7DF6" }, Bilanciato: { c: "#F5C518" }, Autofinanziamento: { c: "#8B93A7" },
  Alta: { c: "#2E7DF6" }, Bassa: { c: "#FF4D4D" },
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
