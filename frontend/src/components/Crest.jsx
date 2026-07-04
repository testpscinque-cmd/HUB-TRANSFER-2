import { getClub } from "@/lib/clubs";

// Rounded monogram crest for clubs (no real logos), tuned for the light theme.
export const Crest = ({ club, size = 36, className = "" }) => {
  const c = getClub(club);
  return (
    <div
      title={club}
      className={`flex shrink-0 items-center justify-center rounded-full font-heading font-black ring-1 ring-black/5 shadow-sm ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: c.color,
        color: c.text || "#fff",
        fontSize: Math.round(size * 0.3),
        letterSpacing: "-0.02em",
      }}
    >
      {c.abbr}
    </div>
  );
};
