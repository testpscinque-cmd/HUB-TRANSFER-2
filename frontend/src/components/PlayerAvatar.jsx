// Monogram avatar (initials) — no photos, light theme.
const PALETTE = [
  ["#05A845", "#ffffff"],
  ["#2563EB", "#ffffff"],
  ["#7C3AED", "#ffffff"],
  ["#DB2777", "#ffffff"],
  ["#EA580C", "#ffffff"],
  ["#0891B2", "#ffffff"],
  ["#CA8A04", "#ffffff"],
  ["#475569", "#ffffff"],
];

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function hash(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h);
}

export const PlayerAvatar = ({ name, size = 48, isCoach = false, className = "", rounded = "rounded-2xl" }) => {
  const [bg, fg] = isCoach ? ["#0F172A", "#39D3A0"] : PALETTE[hash(name) % PALETTE.length];
  return (
    <div
      className={`flex shrink-0 items-center justify-center font-heading font-black ring-1 ring-black/5 shadow-sm ${rounded} ${className}`}
      style={{ width: size, height: size, backgroundColor: bg, color: fg, fontSize: Math.round(size * 0.36) }}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
};
